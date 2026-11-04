// Bumps the version in every package manifest and doc, rebuilds, and prints the tags to create.
//   node scripts/release.mjs patch|minor|major|<x.y.z>
// The upkeep workflow runs this, commits, and pushes the tags vX.Y.Z and go/vX.Y.Z.
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const ROOT = new URL("../", import.meta.url).pathname;
const pkg = JSON.parse(readFileSync(`${ROOT}package.json`, "utf8"));
const old = pkg.version;
const arg = process.argv[2] ?? "patch";
const [ma, mi, pa] = old.split(".").map(Number);
const next = /^\d+\.\d+\.\d+$/.test(arg) ? arg : { major: `${ma + 1}.0.0`, minor: `${ma}.${mi + 1}.0`, patch: `${ma}.${mi}.${pa + 1}` }[arg];
if (!next) throw new Error(`usage: release.mjs patch|minor|major|x.y.z`);

const edit = (file, pairs) => {
    let s = readFileSync(`${ROOT}${file}`, "utf8");
    for (const [re, to] of pairs) s = s.replace(re, to);
    writeFileSync(`${ROOT}${file}`, s);
};
const esc = old.replace(/\./g, "\\.");
edit("package.json", [[`"version": "${old}"`, `"version": "${next}"`]]);
edit("python/pyproject.toml", [[new RegExp(`version = "${esc}"`), `version = "${next}"`]]);
edit("dart/pubspec.yaml", [[new RegExp(`version: ${esc}`), `version: ${next}`]]);
edit("kotlin/build.gradle.kts", [[new RegExp(`version = "${esc}"`), `version = "${next}"`]]);
edit("csharp/WorldRef/WorldRef.csproj", [[new RegExp(`<Version>${esc}</Version>`), `<Version>${next}</Version>`]]);
edit("server.json", [[new RegExp(`"version": "${esc}"`, "g"), `"version": "${next}"`]]);
edit("CITATION.cff", [[new RegExp(`version: ${esc}`), `version: ${next}`], [/date-released: .*/, `date-released: ${new Date().toISOString().slice(0, 10)}`]]);
// Install lines in every README: v1.0.0, @1.0.0, from: "1.0.0", ^1.0 stays valid within a major.
for (const f of ["README.md", "README.ar.md", "python/README.md", "Sources/WorldRef/README.md", "kotlin/README.md", "dart/README.md", "php/README.md", "go/README.md", "csharp/README.md"])
    edit(f, [[new RegExp(esc, "g"), next]]);

// Automated data releases have no hand-written entry; give them one (pub.dev rejects a version without it).
edit("CHANGELOG.md", [[/\n## /, (m) => (readFileSync(`${ROOT}CHANGELOG.md`, "utf8").includes(`## ${next} `) ? m
    : `\n## ${next} (${new Date().toISOString().slice(0, 10)})\n\n- Data refresh from the upstream sources; versions in \`data/meta.json\`.\n\n## `)]]);

execFileSync("npm", ["install", "--package-lock-only", "--no-audit", "--no-fund"], { cwd: ROOT, stdio: "inherit" });
execFileSync("npm", ["run", "build"], { cwd: ROOT, stdio: "inherit" });
execFileSync("node", ["scripts/docs.mjs"], { cwd: ROOT, stdio: "inherit" });
console.log(`\n${old} -> ${next}\ntags: v${next} go/v${next}`);
