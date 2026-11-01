// Writes every output file from the built records: JSON (3 builds, full and per module), CSV, SQL, the static
// per-country API, schemas, flags, meta.json and sources.json.
import { writeFileSync, mkdirSync, rmSync, copyFileSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { describe } from "./fields.mjs";

const require = createRequire(import.meta.url);

export const MODULES = {
    core: ["iso3", "iso_numeric", "kind", "name_ar", "name_en", "official_name_ar", "official_name_en", "aliases_ar", "aliases_en", "flag", "flag_svg", "continent", "groups", "un_member", "tld", "sort_ar", "sort_en"],
    nationality: ["nationality"],
    phone: ["phone"],
    currency: ["currencies"],
    geo: ["geo"],
    locale: ["locale"],
    address: ["address"],
    travel: ["travel"],
    sports: ["sports"],
};
const NESTED = new Set(["nationality", "geo", "locale", "address", "travel", "sports"]);

/** Arabic-only or English-only view: `x_ar` becomes `x`, `x_en` is dropped (and the reverse), recursively. */
export function localize(value, lang) {
    if (Array.isArray(value)) return value.map((v) => localize(v, lang));
    if (!value || typeof value !== "object") return value;
    const other = lang === "ar" ? "en" : "ar";
    const out = {};
    for (const [k, v] of Object.entries(value)) {
        const m = k.match(/^(.*)_(ar|en)(_[mf])?$/);
        if (m && m[2] === other) continue;
        out[m ? m[1] + (m[3] ?? "") : k] = localize(v, lang);
    }
    return out;
}

const jsonLines = (rows) => `[\n${rows.map((r) => JSON.stringify(r)).join(",\n")}\n]\n`;

function flatten(rec, prefix = "", out = {}) {
    for (const [k, v] of Object.entries(rec)) {
        const key = prefix + k;
        if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, `${key}.`, out);
        else if (Array.isArray(v)) out[key] = v.length && typeof v[0] === "object" ? JSON.stringify(v) : v.join("|");
        else out[key] = v;
    }
    return out;
}
const csvCell = (v) => {
    if (v == null) return "";
    const s = String(v);
    return /[",\n|]/.test(s) || s !== s.trim() ? `"${s.replace(/"/g, '""')}"` : s;
};
function csv(rows) {
    const flat = rows.map((r) => flatten(r));
    const cols = Object.keys(flat[0]);
    return "﻿" + [cols.join(","), ...flat.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n") + "\n";
}

function sql(dialect, countries, subdivisions) {
    const q = (s) => (dialect === "mysql" ? `\`${s}\`` : `"${s}"`);
    const lit = (v) => (v == null ? "NULL" : typeof v === "boolean" ? (dialect === "sqlite" ? (v ? 1 : 0) : v ? "TRUE" : "FALSE") : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
    const table = (name, rows, key) => {
        const flat = rows.map((r) => flatten(r));
        const cols = Object.keys(flat[0]);
        const type = (c) => {
            const vals = flat.map((r) => r[c]).filter((v) => v != null);
            if (vals.every((v) => typeof v === "boolean")) return dialect === "sqlite" ? "INTEGER" : "BOOLEAN";
            if (vals.every((v) => Number.isInteger(v))) return dialect === "postgres" ? "BIGINT" : "INTEGER";
            if (vals.every((v) => typeof v === "number")) return dialect === "postgres" ? "DOUBLE PRECISION" : "REAL";
            return "TEXT";
        };
        const colName = (c) => c.replace(/\./g, "_");
        const lines = [`DROP TABLE IF EXISTS ${q(name)};`, `CREATE TABLE ${q(name)} (`];
        lines.push(cols.map((c) => `  ${q(colName(c))} ${type(c)}${c === key ? (dialect === "mysql" ? " NOT NULL PRIMARY KEY" : " PRIMARY KEY") : ""}`).join(",\n"));
        lines.push(dialect === "mysql" ? ") CHARACTER SET utf8mb4;" : ");");
        for (const r of flat) lines.push(`INSERT INTO ${q(name)} (${cols.map((c) => q(colName(c))).join(", ")}) VALUES (${cols.map((c) => lit(r[c])).join(", ")});`);
        return lines.join("\n");
    };
    const head = dialect === "mysql" ? "SET NAMES utf8mb4;\n" : "";
    return `-- worldref ${dialect} seed. Generated; do not edit. Arrays are '|'-joined, lists of objects are JSON text.\n${head}${table("countries", countries, "iso2")}\n\n${table("subdivisions", subdivisions, "code")}\n`;
}

/** JSON Schema inferred from the data, with descriptions from fields.mjs. */
function schemaOf(rows, path = "") {
    const vals = rows.filter((v) => v !== undefined);
    const nullable = vals.some((v) => v === null);
    const present = vals.filter((v) => v !== null);
    const withNull = (s) => (nullable ? { ...s, type: [s.type, "null"].flat() } : s);
    const desc = describe(path);
    const base = desc ? { description: desc } : {};
    if (!present.length) return { ...base, type: "null" };
    const sample = present[0];
    if (Array.isArray(sample)) return withNull({ ...base, type: "array", items: schemaOf(present.flat(), `${path}[]`) });
    if (typeof sample === "object") {
        const keys = Object.keys(sample);
        return withNull({ ...base, type: "object", additionalProperties: false, required: keys, properties: Object.fromEntries(keys.map((k) => [k, schemaOf(present.map((o) => o[k]), path ? `${path}.${k}` : k)])) });
    }
    const t = present.every((v) => Number.isInteger(v)) ? "integer" : typeof sample === "number" ? "number" : typeof sample;
    return withNull({ ...base, type: t });
}

export function writeOutputs({ ROOT, records, subdivisions, SOURCES, COLUMN_SOURCE, overrides, ABSENT }) {
    const out = (p) => `${ROOT}${p}`;
    for (const d of ["data", "schema", "flags"]) rmSync(out(d), { recursive: true, force: true });
    for (const d of ["data/modules", "data/csv", "data/sql", "data/api/v1", "schema", "flags"]) mkdirSync(out(d), { recursive: true });
    const write = (p, body) => writeFileSync(out(p), body);

    const builds = { "": (x) => x, ".ar": (x) => localize(x, "ar"), ".en": (x) => localize(x, "en") };
    const moduleRows = (name) => records.map((r) => ({ iso2: r.iso2, ...Object.fromEntries(MODULES[name].map((k) => [k, r[k]])) }));

    for (const [suffix, view] of Object.entries(builds)) {
        write(`data/worldref${suffix}.json`, jsonLines(records.map(view)));
        write(`data/subdivisions${suffix}.json`, jsonLines(subdivisions.map(view)));
        for (const m of Object.keys(MODULES)) write(`data/modules/${m}${suffix}.json`, jsonLines(moduleRows(m).map(view)));
        write(`data/csv/worldref${suffix}.csv`, csv(records.map(view)));
        write(`data/csv/subdivisions${suffix}.csv`, csv(subdivisions.map(view)));
    }
    for (const d of ["postgres", "mysql", "sqlite"]) write(`data/sql/${d}.sql`, sql(d, records, subdivisions));

    // Static API: one file per country, plus an index. Served by GitHub Pages and jsDelivr.
    const subsBy = {};
    for (const s of subdivisions) (subsBy[s.iso2] ??= []).push(s);
    for (const r of records) write(`data/api/v1/${r.iso2.toLowerCase()}.json`, JSON.stringify({ ...r, subdivisions: subsBy[r.iso2] ?? [] }) + "\n");
    write("data/api/v1/index.json", JSON.stringify(records.map((r) => ({ iso2: r.iso2, name_ar: r.name_ar, name_en: r.name_en, flag: r.flag, kind: r.kind }))) + "\n");

    // Schemas.
    const sch = (title, rows, path = "") => JSON.stringify({ $schema: "https://json-schema.org/draft/2020-12/schema", $id: `https://arj-89.github.io/worldref/schema/${title}.schema.json`, title: `worldref ${title}`, type: "array", items: schemaOf(rows, path) }, null, 2) + "\n";
    for (const [suffix, view] of Object.entries(builds)) {
        write(`schema/worldref${suffix}.schema.json`, sch(`worldref${suffix}`, records.map(view)));
        write(`schema/subdivisions${suffix}.schema.json`, sch(`subdivisions${suffix}`, subdivisions.map(view), "subdivisions"));
        for (const m of Object.keys(MODULES)) write(`schema/${m}${suffix}.schema.json`, sch(`${m}${suffix}`, moduleRows(m).map(view)));
    }

    // Flags: flag-icons 4x3 SVGs for the rows only.
    const flagDir = require.resolve("flag-icons/package.json").replace("package.json", "flags/4x3/");
    for (const r of records) copyFileSync(`${flagDir}${r.iso2.toLowerCase()}.svg`, out(`flags/${r.iso2.toLowerCase()}.svg`));

    // Provenance and nulls.
    const get = (r, path) => path.split(".").reduce((o, k) => o?.[k], r);
    const nulls = {};
    for (const keys of Object.keys(COLUMN_SOURCE)) for (const path of keys.split(",")) {
        const missing = records.filter((r) => {
            const v = get(r, path);
            return v == null || (Array.isArray(v) && !v.length);
        }).map((r) => r.iso2);
        if (missing.length) nulls[path] = missing;
    }
    const pkg = JSON.parse(readFileSync(out("package.json"), "utf8"));
    write("data/sources.json", JSON.stringify({
        sources: SOURCES,
        columns: COLUMN_SOURCE,
        overrides,
        nulls: { _rule: "null (or an empty list) means no source states a value. Values are never guessed or machine-translated.", ...nulls },
        emergency_sources: JSON.parse(readFileSync(out("upstream/snapshot/emergency.json"), "utf8")).filter((e) => e.sources?.length).map(({ iso2, sources, note }) => ({ iso2, sources, ...(note ? { note } : {}) })),
    }, null, 1) + "\n");
    write("data/meta.json", JSON.stringify({
        name: "worldref",
        version: pkg.version,
        countries: records.length,
        subdivisions: subdivisions.length,
        modules: Object.keys(MODULES),
        builds: { bilingual: ".json", arabic: ".ar.json", english: ".en.json" },
        excluded: ["EH", "AQ", "BV", "HM", "TF", "UM", "GS"],
        sources: Object.fromEntries(Object.entries(SOURCES).map(([k, v]) => [k, v.version])),
    }, null, 1) + "\n");

    console.log(`wrote ${records.length} countries, ${subdivisions.length} subdivisions`);
}
