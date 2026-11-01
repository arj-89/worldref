// Assembles the GitHub Pages output: the static API, schemas, flags, llms files and OpenAPI.
// The human-facing website is added here once its design passes review.
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
const OUT = `${ROOT}site/_out/`;
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(`${ROOT}data/api`, `${OUT}api`, { recursive: true });
cpSync(`${ROOT}schema`, `${OUT}schema`, { recursive: true });
cpSync(`${ROOT}flags`, `${OUT}flags`, { recursive: true });
for (const f of ["llms.txt", "llms-full.txt", "AGENTS.md"]) cpSync(`${ROOT}${f}`, `${OUT}${f}`);
cpSync(`${ROOT}site/openapi.json`, `${OUT}openapi.json`);
const v = JSON.parse(readFileSync(`${ROOT}package.json`, "utf8")).version;
writeFileSync(`${OUT}robots.txt`, "User-agent: *\nAllow: /\n");
writeFileSync(`${OUT}index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>worldref ${v}</title>
<meta name="description" content="Every country in Arabic, English, or both: names, nationalities, dial codes, phone validation and more.">
<link rel="canonical" href="https://github.com/arj-89/worldref"><meta http-equiv="refresh" content="0; url=https://github.com/arj-89/worldref"></head>
<body><a href="https://github.com/arj-89/worldref">worldref on GitHub</a></body></html>\n`);
writeFileSync(`${OUT}.nojekyll`, "");
console.log(`site/_out ready (v${v})`);
