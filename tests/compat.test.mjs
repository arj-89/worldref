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
