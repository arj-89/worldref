// Summarises what changed in the built data between a git revision and the working tree, as changelog lines.
// release.mjs writes it into CHANGELOG.md for releases that have no hand-written entry (the upkeep job).
//
//   node scripts/datadiff.mjs [rev]   # default HEAD
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const ROOT = new URL("../", import.meta.url).pathname;
const MAX_CODES = 12;

const atRev = (rev, path) => {
    try {
        return JSON.parse(execFileSync("git", ["show", `${rev}:${path}`], { cwd: ROOT, maxBuffer: 1 << 28 }).toString());
    } catch {
        return null;
    }
};
const now = (path) => JSON.parse(readFileSync(`${ROOT}${path}`, "utf8"));

/** Leaf paths of a record; lists are compared whole. */
function leaves(rec, prefix = "", out = {}) {
    for (const [k, v] of Object.entries(rec ?? {})) {
        const key = prefix + k;
        if (v && typeof v === "object" && !Array.isArray(v)) leaves(v, `${key}.`, out);
        else out[key] = JSON.stringify(v);
    }
    return out;
}
const codes = (list) => (list.length > MAX_CODES ? `${list.slice(0, MAX_CODES).join(", ")} and ${list.length - MAX_CODES} more` : list.join(", "));
const byKey = (rows, key) => new Map((rows ?? []).map((r) => [r[key], r]));

export function dataDiff(rev = "HEAD") {
    const lines = [];
    const metaOld = atRev(rev, "data/meta.json"), metaNew = now("data/meta.json");
    for (const [src, v] of Object.entries(metaNew.sources))
        if (metaOld?.sources?.[src] !== undefined && metaOld.sources[src] !== v) lines.push(`Source \`${src}\`: ${metaOld.sources[src]} to ${v}.`);
        else if (metaOld && metaOld.sources?.[src] === undefined) lines.push(`New source \`${src}\`: ${v}.`);

    const oldC = byKey(atRev(rev, "data/worldref.json"), "iso2"), newC = byKey(now("data/worldref.json"), "iso2");
    const added = [...newC.keys()].filter((k) => !oldC.has(k)), removed = [...oldC.keys()].filter((k) => !newC.has(k));
    if (added.length) lines.push(`Rows added: ${codes(added)}.`);
    if (removed.length) lines.push(`Rows removed: ${codes(removed)}. This is a breaking change.`);
    const fields = {};
    for (const [iso, rec] of newC) {
        if (!oldC.has(iso)) continue;
        const a = leaves(oldC.get(iso)), b = leaves(rec);
        for (const path of new Set([...Object.keys(a), ...Object.keys(b)])) {
            if (a[path] === b[path]) continue;
            const how = a[path] === undefined ? "added" : b[path] === undefined ? "removed" : "changed";
            (fields[`${path}\u0000${how}`] ??= []).push(iso);
        }
    }
    for (const [key, isos] of Object.entries(fields).sort(([x], [y]) => (x < y ? -1 : 1))) {
        const [path, how] = key.split("\u0000");
        const rows = isos.length === 1 ? "1 row" : `${isos.length} rows`;
        lines.push(how === "changed" ? `\`${path}\` changed for ${rows}: ${codes(isos)}.`
            : how === "added" ? `New field \`${path}\` (${rows}).` : `Field \`${path}\` removed (${rows}). This is a breaking change.`);
    }

    const oldS = byKey(atRev(rev, "data/subdivisions.json"), "code"), newS = byKey(now("data/subdivisions.json"), "code");
    const sAdded = [...newS.keys()].filter((k) => !oldS.has(k)), sRemoved = [...oldS.keys()].filter((k) => !newS.has(k));
    const sChanged = [...newS.keys()].filter((k) => oldS.has(k) && JSON.stringify(oldS.get(k)) !== JSON.stringify(newS.get(k)));
    if (sAdded.length) lines.push(`Subdivisions added: ${codes(sAdded)}.`);
    if (sRemoved.length) lines.push(`Subdivisions removed: ${codes(sRemoved)}.`);
    if (sChanged.length) lines.push(`Subdivisions changed: ${codes(sChanged)}.`);
    return lines;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
    const lines = dataDiff(process.argv[2] ?? "HEAD");
    console.log(lines.length ? lines.map((l) => `- ${l}`).join("\n") : "- No data changes.");
}
