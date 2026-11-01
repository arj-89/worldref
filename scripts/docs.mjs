// Regenerates the parts of the docs that come from the data: the README field table and llms-full.txt.
//   node scripts/docs.mjs   (run by `npm run build`)
import { readFileSync, writeFileSync } from "node:fs";
import { FIELDS } from "./lib/fields.mjs";
import { MODULES } from "./lib/outputs.mjs";

const ROOT = new URL("../", import.meta.url).pathname;
const meta = JSON.parse(readFileSync(`${ROOT}data/meta.json`, "utf8"));
const sa = JSON.parse(readFileSync(`${ROOT}data/api/v1/sa.json`, "utf8"));

const moduleOf = (field) => {
    const top = field.split(/[.[]/)[0];
    if (field.startsWith("subdivisions.")) return "subdivisions";
    return Object.entries(MODULES).find(([, keys]) => keys.includes(top))?.[0] ?? (top === "iso2" ? "all" : "core");
};
const example = (field) => {
    if (field.startsWith("subdivisions.")) return sa.subdivisions[0]?.[field.split(".")[1]];
    const v = field.split(".").reduce((o, k) => {
        if (o == null) return o;
        const arr = k.endsWith("[]");
        const key = k.replace("[]", "");
        const val = o[key];
        return arr ? val?.[0] : val;
    }, sa);
    return v;
};
const fmt = (v) => {
    if (v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    if (typeof v === "object" && v !== null && !Array.isArray(v)) return "";
    return `\`${s.length > 40 ? `${s.slice(0, 37)}...` : s}\``.replace(/\|/g, "\\|");
};

const rows = Object.entries(FIELDS).map(([f, d]) => `| \`${f}\` | ${moduleOf(f)} | ${fmt(example(f))} | ${d.replace(/\|/g, "\\|")} |`);
const table = ["| Field | Module | Example (SA) | Meaning |", "|---|---|---|---|", ...rows].join("\n");

const readme = readFileSync(`${ROOT}README.md`, "utf8");
writeFileSync(`${ROOT}README.md`, readme.replace(/<!-- fields:start -->[\s\S]*<!-- fields:end -->/, `<!-- fields:start -->\nSingle-language builds drop the \`_ar\` / \`_en\` suffix (\`name_ar\` becomes \`name\` in \`.ar.json\`).\n\n${table}\n<!-- fields:end -->`));

const llmsFull = `# worldref: full reference for language models

> Every country and territory (${meta.countries}) in Arabic and English, plus ${meta.subdivisions} ISO 3166-2 subdivisions. Version ${meta.version}.

${readFileSync(`${ROOT}llms.txt`, "utf8").split("\n").slice(2).join("\n")}

## Every field

${table}

## Example record (Saudi Arabia, bilingual build)

\`\`\`json
${JSON.stringify({ ...sa, subdivisions: sa.subdivisions.slice(0, 2) }, null, 1)}
\`\`\`
`;
writeFileSync(`${ROOT}llms-full.txt`, llmsFull);
console.log("docs updated");
