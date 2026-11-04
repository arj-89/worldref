// World map for the countries page: Natural Earth admin-0 (public domain), Saudi Arabia point-of-view edition,
// so boundaries follow the official Saudi positions (Western Sahara within Morocco, Northern Cyprus within
// Cyprus). The excluded state's polygon is merged into Palestine, as its numbers are in the data.
//   node scripts/map.mjs   (after `node scripts/fetch.mjs map`)
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { EXCLUDED, ABSENT } from "./config.mjs";

const ROOT = new URL("../", import.meta.url).pathname;
const src = `${ROOT}upstream/.cache/ne_10m_admin_0_countries_sau.geojson`;
const tmp = `${ROOT}upstream/.cache/world.svg`;
const drop = [...EXCLUDED].filter((c) => c !== ABSENT).map((c) => `iso2 !== "${c}"`).join(" && ");
execFileSync("npx", ["-y", "mapshaper@0.6.121", src, "-each", `iso2 = ISO_A2_EH === "${ABSENT}" ? "PS" : ISO_A2_EH`, "-filter", `iso2 !== "-99" && ${drop}`, "-dissolve", "iso2", "-simplify", "1.5%", "keep-shapes", "-proj", "robinson", "-o", tmp, "format=svg", "id-field=iso2", "precision=0.1"], { stdio: "inherit", cwd: ROOT });
const svg = readFileSync(tmp, "utf8");
const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
const paths = Object.fromEntries([...svg.matchAll(/<path d="([^"]+)"(?: fill-rule="evenodd")? id="([A-Z]{2})"\/?>/g)].map((m) => [m[2], m[1]]));
if (ABSENT in paths) throw new Error("the excluded state survived the merge");
writeFileSync(`${ROOT}upstream/snapshot/world-map.json`, JSON.stringify({ source: "Natural Earth 10m admin-0, Saudi Arabia point of view (public domain)", viewBox, paths }) + "\n");
console.log(`world-map.json: ${Object.keys(paths).length} shapes`);
