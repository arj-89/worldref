#!/usr/bin/env node
// worldref command line and MCP server (stdio, JSON-RPC 2.0, no dependencies).
//
//   npx github:arj-89/worldref mcp        # MCP server for AI agents
//   npx github:arj-89/worldref sa         # print one country as JSON
//   npx github:arj-89/worldref search مصر # search in Arabic or English
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { countries, byIso2, search, parsePhone, localizeRecord } from "./lib.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const subdivisions = JSON.parse(readFileSync(new URL("../data/subdivisions.json", import.meta.url), "utf8"));
const LANG = { type: "string", enum: ["ar", "en", "both"], description: "Language of the returned fields. Default: both." };

const TOOLS = [
    {
        name: "get_country",
        description: "Everything worldref knows about one country or territory: names, official names, nationality, dial codes and phone rules, currencies, capital, population, time zones, languages, week and calendar, address format, emergency numbers, plugs, sports codes. Missing values are null: report them as unknown, never guess.",
        inputSchema: { type: "object", properties: { iso2: { type: "string", description: "ISO 3166-1 alpha-2 code, e.g. SA. XK for Kosovo." }, lang: LANG }, required: ["iso2"] },
    },
    {
        name: "search_countries",
        description: "Find countries by name or alias in Arabic or English (ignores «ال», tashkeel and hamza forms), by ISO code, or by dial code (+966, 00966, 966). Returns iso2, names and flag, best match first.",
        inputSchema: { type: "object", properties: { query: { type: "string" }, lang: { type: "string", enum: ["ar", "en"], description: "UI language for ranking. Default: en." }, limit: { type: "integer", minimum: 1, maximum: 50 } }, required: ["query"] },
    },
    {
        name: "validate_phone",
        description: "Parse a phone number as a user typed it (Arabic or Western digits, local or international form). Returns the international (E.164) form, the country it belongs to, and whether it is a valid number and a mobile number.",
        inputSchema: { type: "object", properties: { number: { type: "string" }, country: { type: "string", description: "iso2 of the country picked in the phone field; used for local numbers." } }, required: ["number", "country"] },
    },
    {
        name: "list_subdivisions",
        description: "ISO 3166-2 subdivisions (regions, provinces, states, emirates) of a country, with Arabic and English names.",
        inputSchema: { type: "object", properties: { iso2: { type: "string" } }, required: ["iso2"] },
    },
];

function call(name, a) {
    switch (name) {
        case "get_country": {
            const c = byIso2(String(a.iso2 ?? ""));
            if (!c) return { error: `No row for "${a.iso2}". Use search_countries to find the code.` };
            return a.lang && a.lang !== "both" ? localizeRecord(c, a.lang) : c;
        }
        case "search_countries":
            return search(countries, String(a.query ?? ""), a.lang === "ar" ? "ar" : "en")
                .slice(0, Math.min(Number(a.limit) || 10, 50))
                .map((c) => ({ iso2: c.iso2, name_ar: c.name_ar, name_en: c.name_en, flag: c.flag, kind: c.kind }));
        case "validate_phone": {
            const c = byIso2(String(a.country ?? ""));
            if (!c) return { error: `No row for "${a.country}".` };
            return parsePhone(String(a.number ?? ""), c, countries) ?? { error: "No digits to read." };
        }
        case "list_subdivisions":
            return subdivisions.filter((s) => s.iso2 === String(a.iso2 ?? "").toUpperCase());
        default:
            throw Object.assign(new Error(`Unknown tool ${name}`), { code: -32602 });
    }
}

function serve() {
    const send = (msg) => process.stdout.write(JSON.stringify({ jsonrpc: "2.0", ...msg }) + "\n");
    createInterface({ input: process.stdin }).on("line", (line) => {
        if (!line.trim()) return;
        let req;
        try {
            req = JSON.parse(line);
        } catch {
            return send({ id: null, error: { code: -32700, message: "Parse error" } });
        }
        const { id, method, params = {} } = req;
        if (id === undefined) return; // notifications need no reply
        try {
            if (method === "initialize")
                return send({ id, result: { protocolVersion: params.protocolVersion ?? "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "worldref", version: pkg.version }, instructions: "Country reference data in Arabic and English. Answer from tool results only; null means unknown." } });
            if (method === "ping") return send({ id, result: {} });
            if (method === "tools/list") return send({ id, result: { tools: TOOLS } });
            if (method === "tools/call") {
                const out = call(params.name, params.arguments ?? {});
                return send({ id, result: { content: [{ type: "text", text: JSON.stringify(out) }], isError: !!out?.error } });
            }
            send({ id, error: { code: -32601, message: `Method not found: ${method}` } });
        } catch (e) {
            send({ id, error: { code: e.code ?? -32603, message: e.message } });
        }
    });
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "mcp") serve();
else if (cmd === "search") console.log(JSON.stringify(call("search_countries", { query: rest.join(" "), lang: /[؀-ۿ]/.test(rest.join(" ")) ? "ar" : "en" }), null, 2));
else if (cmd && /^[a-z]{2}$/i.test(cmd)) console.log(JSON.stringify(call("get_country", { iso2: cmd }), null, 2));
else console.log(`worldref ${pkg.version}\n\n  worldref mcp            MCP server (stdio)\n  worldref <iso2>         one country as JSON\n  worldref search <text>  search in Arabic or English`);
