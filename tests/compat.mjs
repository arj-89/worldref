// Field paths every shipped release has had. A path in tests/compat-baseline.json must stay in the data:
// removing or renaming one breaks users and needs a major release (and a hand edit of the baseline).
import { readFileSync, existsSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const FILES = ["data/worldref.json", "data/worldref.ar.json", "data/worldref.en.json", "data/subdivisions.json", "data/subdivisions.ar.json", "data/subdivisions.en.json"];

function paths(value, prefix, out) {
    if (Array.isArray(value)) for (const v of value) paths(v, `${prefix}[]`, out);
    else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) paths(v, prefix ? `${prefix}.${k}` : k, out);
    else out.add(prefix);
    return out;
}

/** Current field paths per file, merged with the committed baseline (paths are only ever added). */
export function current() {
    return Object.fromEntries(FILES.map((f) => [f, [...paths(JSON.parse(readFileSync(`${ROOT}${f}`, "utf8")), "", new Set())].sort()]));
}
export function baseline() {
    const old = existsSync(`${ROOT}tests/compat-baseline.json`) ? JSON.parse(readFileSync(`${ROOT}tests/compat-baseline.json`, "utf8")) : {};
    const now = current();
    return Object.fromEntries(FILES.map((f) => [f, [...new Set([...(old[f] ?? []), ...now[f]])].sort()]));
}
