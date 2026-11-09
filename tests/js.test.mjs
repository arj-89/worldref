// JavaScript package against the shared vectors, plus the dataset-wide gates.
//   node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { countries, byIso2, search, sortCountries, parsePhone, normalize, westernDigits, addressForm, editDistance } from "../dist/index.js";
import * as reference from "../scripts/lib/text.mjs";

const V = JSON.parse(readFileSync(new URL("vectors.json", import.meta.url)));
const ROOT = new URL("../", import.meta.url).pathname;

test("westernDigits", () => {
    for (const [i, o] of V.westernDigits) assert.equal(westernDigits(i), o, i);
});

test("normalize matches the vectors and the build's reference", () => {
    for (const [i, o] of V.normalize) {
        assert.equal(normalize(i), o, i);
        assert.equal(reference.normalize(i), o, `reference: ${i}`);
    }
});

test("search", () => {
    for (const c of V.search) {
        const hits = search(countries, c.query, c.lang);
        if ("count" in c) assert.equal(hits.length, c.count, c.query);
        if (c.first) assert.equal(hits[0]?.iso2, c.first, `${c.query} -> ${hits.slice(0, 3).map((h) => h.iso2)}`);
    }
});

test("sort", () => {
    for (const c of V.sort) {
        const head = sortCountries(countries, c.lang, c.first).slice(0, c.head.length).map((x) => x.iso2);
        assert.deepEqual(head, c.head, `${c.lang} ${c.first}`);
    }
});

test("phone", () => {
    for (const c of V.phone) {
        const p = parsePhone(c.input, byIso2(c.country), countries);
        assert.ok(p, c.input);
        assert.deepEqual({ e164: p.e164, iso2: p.iso2, valid: p.valid, mobile: p.mobile }, { e164: c.e164, iso2: c.iso2, valid: c.valid, mobile: c.mobile }, c.input);
    }
});

test("the excluded entity appears in no output file", () => {
    const files = [];
    const walk = (d) => {
        for (const f of readdirSync(d)) {
            const p = `${d}/${f}`;
            statSync(p).isDirectory() ? walk(p) : files.push(p);
        }
    };
    for (const d of ["data", "schema", "flags", "dist"]) walk(`${ROOT}${d}`);
    const words = /Israel|إسرائيل|اسرائيل/i;
    for (const f of files) {
        const s = readFileSync(f, "utf8");
        assert.ok(!words.test(s), `${f} names the excluded entity`);
        assert.ok(!/"(IL|ISR)"/.test(s), `${f} carries its code`);
    }
    assert.ok(!countries.some((c) => c.iso2 === "IL" || c.iso3 === "ISR" || c.iso_numeric === "376"));
    assert.ok(!files.some((f) => /\/il\.(svg|json)$/.test(f)));
});

test("policy rows", () => {
    const ps = byIso2("PS");
    assert.equal(ps.name_ar, "فلسطين");
    assert.equal(ps.capital_ar ?? ps.geo.capital_ar, "القدس");
    assert.deepEqual(ps.phone.map((p) => p.calling_code), ["+970", "+972"]);
    assert.deepEqual(ps.currencies.map((c) => [c.code, c.name_ar]), [["JOD", "دينار أردني"], ["ILS", "شيكل"]]);
    assert.ok(ps.geo.timezones.includes("Asia/Jerusalem"));
    assert.equal(byIso2("EH"), undefined);
    assert.equal(byIso2("XK").kind, "country");
    for (const t of ["TW", "HK", "MO"]) {
        assert.equal(byIso2(t).kind, "territory");
        assert.ok(byIso2(t).nationality.nationality_en);
    }
});

test("every module row joins the full file on iso2", () => {
    const iso = countries.map((c) => c.iso2).join();
    for (const f of readdirSync(`${ROOT}data/modules`)) {
        const rows = JSON.parse(readFileSync(`${ROOT}data/modules/${f}`, "utf8"));
        assert.equal(rows.map((r) => r.iso2).join(), iso, f);
    }
});

test("addressForm", () => {
    for (const c of V.addressForm) {
        const got = addressForm(byIso2(c.iso2), c.lang).map((line) => line.map((f) => [f.field, f.label, f.required]));
        assert.deepEqual(got, c.lines, `${c.iso2} ${c.lang}`);
    }
});

test("editDistance", () => {
    for (const [a, b, limit, want] of V.editDistance) assert.equal(editDistance(a, b, limit), want, `${a} ${b}`);
});
