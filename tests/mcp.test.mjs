// MCP server over stdio: the happy path, then bad input. Every line on stdout must be one JSON-RPC message.
//   node --test tests/mcp.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const CLI = new URL("../mcp/cli.js", import.meta.url).pathname;

/** Sends the lines in one session; returns the replies keyed by id. */
function session(...lines) {
    const input = lines.map((l) => (typeof l === "string" ? l : JSON.stringify({ jsonrpc: "2.0", ...l }))).join("\n") + "\n";
    const out = execFileSync(process.execPath, [CLI, "mcp"], { input }).toString();
    const replies = out.split("\n").filter(Boolean).map((l) => JSON.parse(l)); // throws on any non-JSON line
    for (const r of replies) assert.equal(r.jsonrpc, "2.0");
    return { replies, byId: Object.fromEntries(replies.map((r) => [r.id, r])) };
}
const tool = (id, name, args) => ({ id, method: "tools/call", params: { name, arguments: args } });
const body = (reply) => JSON.parse(reply.result.content[0].text);

test("initialize echoes the client's protocol version", () => {
    const { byId } = session({ id: 1, method: "initialize", params: { protocolVersion: "2025-03-26" } });
    assert.equal(byId[1].result.protocolVersion, "2025-03-26");
    assert.equal(byId[1].result.serverInfo.name, "worldref");
});

test("many requests in one session, notifications get no reply", () => {
    const { replies, byId } = session(
        { id: 1, method: "initialize", params: {} },
        { method: "notifications/initialized" },
        { id: 2, method: "tools/list" },
        tool(3, "get_country", { iso2: "sa" }),
        tool(4, "search_countries", { query: "الاردن", lang: "ar" }),
        tool(5, "validate_phone", { number: "٠٥٠١٢٣٤٥٦٧", country: "SA" }),
        tool(6, "list_subdivisions", { iso2: "GB" }),
        { id: 7, method: "ping" },
    );
    assert.equal(replies.length, 7);
    assert.deepEqual(byId[2].result.tools.map((t) => t.name), ["get_country", "search_countries", "validate_phone", "list_subdivisions"]);
    assert.equal(body(byId[3]).name_ar, "السعودية");
    assert.equal(body(byId[4])[0].iso2, "JO");
    assert.equal(body(byId[5]).e164, "+966501234567");
    assert.ok(body(byId[6]).length > 100, "large subdivision list");
    assert.deepEqual(byId[7].result, {});
});

test("protocol errors", () => {
    const { byId, replies } = session(
        "{not json",
        "[1,2]",
        { id: 2, method: "nope" },
        tool(3, "no_such_tool", {}),
    );
    assert.equal(replies.find((r) => r.id === null && r.error.code === -32700)?.error.message, "Parse error");
    assert.ok(replies.some((r) => r.id === null && r.error.code === -32600), "invalid request");
    assert.equal(byId[2].error.code, -32601);
    assert.equal(byId[3].error.code, -32602);
});

test("bad arguments are tool errors the agent can read", () => {
    const cases = [
        [tool(1, "get_country", {}), /Missing argument: iso2/],
        [{ id: 2, method: "tools/call", params: { name: "get_country" } }, /Missing argument: iso2/],
        [tool(3, "get_country", { iso2: 966 }), /iso2 must be a string/],
        [tool(4, "get_country", { iso2: "SA", lang: "fr" }), /lang must be one of/],
        [tool(5, "get_country", { iso2: "SA", extra: 1 }), /Unknown argument: extra/],
        [tool(6, "get_country", { iso2: "ZZ" }), /No row for "ZZ"/],
        [tool(7, "search_countries", { query: "x", limit: "5" }), /limit must be an integer/],
        [tool(8, "validate_phone", { number: "0501234567" }), /Missing argument: country/],
        [tool(9, "get_country", ["SA"]), /must be an object/],
    ];
    const { byId } = session(...cases.map(([req]) => req));
    for (const [req, re] of cases) {
        const r = byId[req.id];
        assert.equal(r.result?.isError, true, `id ${req.id} is a tool error`);
        assert.match(body(r).error, re);
    }
});
