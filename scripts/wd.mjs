// Wikidata SPARQL helper (CC0 data). Used by fetch.mjs only.
const UA = "worldref-build/1.0 (https://github.com/arj-89/worldref)";
export async function sparql(query) {
    for (let attempt = 0; attempt < 4; attempt++) {
        const res = await fetch("https://query.wikidata.org/sparql", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/sparql-results+json", "User-Agent": UA },
            body: new URLSearchParams({ query }),
        });
        if (res.ok) return (await res.json()).results.bindings;
        await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
    }
    throw new Error("Wikidata query failed");
}
// Current (not dissolved) entities carrying an ISO 3166-1 alpha-2 code.
export const ENTITY = `?c wdt:P297 ?iso . FILTER NOT EXISTS { ?c wdt:P576 ?end }`;
