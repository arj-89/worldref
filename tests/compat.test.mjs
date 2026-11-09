// No field that shipped may disappear (see tests/compat.mjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { current } from "./compat.mjs";

test("every shipped field path is still present", () => {
    const base = JSON.parse(readFileSync(new URL("compat-baseline.json", import.meta.url), "utf8"));
    const now = current();
    for (const [file, list] of Object.entries(base)) {
        const missing = list.filter((p) => !now[file].includes(p));
        assert.deepEqual(missing, [], `${file} lost fields (breaking change)`);
    }
});

test("every package manifest carries the same version", () => {
    const root = new URL("../", import.meta.url).pathname;
    const read = (f) => readFileSync(`${root}${f}`, "utf8");
    const want = JSON.parse(read("package.json")).version;
    const found = {
        "python/pyproject.toml": read("python/pyproject.toml").match(/^version = "([^"]+)"/m)?.[1],
        "python/worldref/__init__.py": read("python/worldref/__init__.py").match(/__version__ = "([^"]+)"/)?.[1],
        "dart/pubspec.yaml": read("dart/pubspec.yaml").match(/^version: (\S+)/m)?.[1],
        "kotlin/build.gradle.kts": read("kotlin/build.gradle.kts").match(/^version = "([^"]+)"/m)?.[1],
        "csharp/WorldRef/WorldRef.csproj": read("csharp/WorldRef/WorldRef.csproj").match(/<Version>([^<]+)<\/Version>/)?.[1],
        "server.json": JSON.parse(read("server.json")).version,
        "CITATION.cff": read("CITATION.cff").match(/^version: (\S+)/m)?.[1],
    };
    for (const [file, v] of Object.entries(found)) assert.equal(v, want, `${file} says ${v}, package.json says ${want}`);
});
