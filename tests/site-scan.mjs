// Gate for the published site (entry 14): the excluded state appears nowhere in site/_out, except the
// three agent files that state the policy, which must stay byte-identical to their repo copies.
//   node tests/site-scan.mjs   (after node site/build.mjs)
import { readFileSync, readdirSync, statSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const OUT = `${ROOT}site/_out/`;
const EXEMPT = ["llms.txt", "llms-full.txt", "AGENTS.md"];
const NAMES = /israel|إسرائيل|اسرائيل|إسرائيلي|اسرائيلي/i;
// Standalone codes; "US-IL" style subdivision codes and the ILS currency code are other things.
const CODES = /(^|[^A-Za-z-])(IL|ISR)([^A-Za-z]|$)/;
const bad = [];
const walk = (d) => {
    for (const f of readdirSync(d)) {
        const p = `${d}${f}`;
        if (statSync(p).isDirectory()) { walk(`${p}/`); continue; }
        const rel = p.slice(OUT.length);
        if (/(^|\/)il(\.|\/)/.test(rel)) bad.push(`${rel}: path`);
        if (EXEMPT.includes(rel)) {
            if (readFileSync(p, "utf8") !== readFileSync(`${ROOT}${rel}`, "utf8")) bad.push(`${rel}: differs from the repo copy`);
            continue;
        }
        if (!/\.(html|json|txt|xml|md|csv|js|css|svg)$/.test(rel)) continue;
        const s = readFileSync(p, "utf8");
        if (NAMES.test(s)) bad.push(`${rel}: name`);
        if (/\.json$/.test(rel) && /"iso2":"IL"|"iso3":"ISR"|"iso_numeric":"376"|"code":"IL-/.test(s.replace(/\s+/g, ""))) bad.push(`${rel}: code`);
        if (/\.csv$/.test(rel) && /(^|\n)(IL|ISR),/.test(s.replace(/^\uFEFF/, ""))) bad.push(`${rel}: code`);
        if (/\.html$/.test(rel) && (CODES.test(s.replace(/<[^>]+>/g, " ").replace(/\b(ILS)\b/g, "")) || /data-iso="IL"|"(IL|ISR)"/.test(s))) bad.push(`${rel}: code token`);
        if (/\/il\/|\bil\.(svg|json)\b/.test(s)) bad.push(`${rel}: path reference`);
    }
};
walk(OUT);
if (bad.length) {
    console.error(bad.slice(0, 30).join("\n"));
    process.exit(1);
}
console.log("site scan: clean");
