// Gate: rebuilding from the committed snapshot changes nothing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";

const ROOT = new URL("../", import.meta.url).pathname;
function digest() {
    const h = createHash("sha256");
    const walk = (d) => {
        for (const f of readdirSync(d).sort()) {
            const p = `${d}/${f}`;
            if (statSync(p).isDirectory()) walk(p);
            else h.update(p).update(readFileSync(p));
        }
    };
    for (const d of ["data", "schema", "flags"]) walk(`${ROOT}${d}`);
    return h.digest("hex");
}

test("regenerating produces no diff", () => {
    const before = digest();
    execFileSync("node", ["scripts/build.mjs"], { cwd: ROOT, stdio: "ignore" });
    assert.equal(digest(), before);
});
