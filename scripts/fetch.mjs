// Refreshes upstream/snapshot/ from the upstream sources. The generator reads only the snapshot (plus the
// pinned CLDR and flag-icons packages), so a build is reproducible offline and every upstream change shows
// up as a reviewable diff.
//
//   node scripts/fetch.mjs            # everything
//   node scripts/fetch.mjs population # one source
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { sparql, ENTITY } from "./wd.mjs";
import { ROWS, PINS } from "./config.mjs";

const OUT = new URL("../upstream/snapshot/", import.meta.url);
mkdirSync(OUT, { recursive: true });
const save = (name, data) => {
    const body = typeof data === "string" ? data : JSON.stringify(data, null, 1) + "\n";
    writeFileSync(new URL(name, OUT), body);
    console.log(`saved ${name}`);
};
const get = async (url, as = "text") => {
    for (let attempt = 0; attempt < 4; attempt++) {
        const res = await fetch(url, { headers: { "User-Agent": "worldref-build/1.0 (https://github.com/arj-89/worldref)" } });
        if (res.ok) return as === "json" ? res.json() : res.text();
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
    throw new Error(`GET failed: ${url}`);
};
const isoValues = `VALUES ?iso { ${ROWS.map((i) => `"${i}"`).join(" ")} }`;
// AQ and CY each have a second, minor entity with the same code; keep the main one (most sitelinks).
const MAIN = `${isoValues} ${ENTITY} ?c wdt:P298 ?a3 .`;
const qid = (uri) => uri.split("/").pop();

const jobs = {
    async wikidata() {
        const ents = await sparql(`SELECT ?iso ?c ?sl WHERE { ${MAIN} ?c wikibase:sitelinks ?sl }`);
        const best = {};
        for (const r of ents) {
            const sl = Number(r.sl.value);
            if (!best[r.iso.value] || sl > best[r.iso.value].sl) best[r.iso.value] = { q: qid(r.c.value), sl };
        }
        const byQ = Object.fromEntries(Object.entries(best).map(([iso, v]) => [v.q, iso]));
        const values = `VALUES ?c { ${Object.values(best).map((v) => `wd:${v.q}`).join(" ")} }`;
        const rows = (q) => sparql(q).then((rs) => rs.map((r) => ({ ...r, iso: byQ[qid(r.c.value)] })));
        const pick = (r, k) => r[k]?.value ?? null;

        const out = Object.fromEntries(ROWS.map((iso) => [iso, { qid: best[iso]?.q ?? null }]));
        const push = (iso, key, val) => {
            if (!out[iso] || val == null) return;
            (out[iso][key] ??= []).includes(val) || out[iso][key].push(val);
        };

        for (const r of await rows(`SELECT ?c ?l ?lang WHERE { ${values} ?c rdfs:label ?l . BIND(LANG(?l) AS ?lang) FILTER(?lang IN ("ar","en")) }`))
            push(r.iso, `label_${pick(r, "lang")}`, pick(r, "l"));
        for (const r of await rows(`SELECT ?c ?l ?lang WHERE { ${values} ?c skos:altLabel ?l . BIND(LANG(?l) AS ?lang) FILTER(?lang IN ("ar","en")) }`))
            push(r.iso, `alias_${pick(r, "lang")}`, pick(r, "l"));
        for (const r of await rows(`SELECT ?c ?l ?lang WHERE { ${values} ?c wdt:P1448 ?l . BIND(LANG(?l) AS ?lang) FILTER(?lang IN ("ar","en")) }`))
            push(r.iso, `official_${pick(r, "lang")}`, pick(r, "l"));
        for (const r of await rows(`SELECT ?c ?l ?lang WHERE { ${values} ?c wdt:P1549 ?l . BIND(LANG(?l) AS ?lang) FILTER(?lang IN ("ar","en")) }`))
            push(r.iso, `demonym_${pick(r, "lang")}`, pick(r, "l"));
        for (const r of await rows(`SELECT ?c ?cap ?ar ?en WHERE { ${values} ?c wdt:P36 ?cap .
                OPTIONAL { ?cap rdfs:label ?ar FILTER(LANG(?ar)="ar") } OPTIONAL { ?cap rdfs:label ?en FILTER(LANG(?en)="en") } }`))
            push(r.iso, "capitals", { qid: qid(r.cap.value), ar: pick(r, "ar"), en: pick(r, "en") });
        for (const r of await rows(`SELECT ?c ?lat ?lng WHERE { ${values} ?c p:P625/psv:P625 ?v . ?v wikibase:geoLatitude ?lat ; wikibase:geoLongitude ?lng }`))
            push(r.iso, "coords", [Number(r.lat.value), Number(r.lng.value)]);
        for (const r of await rows(`SELECT ?c ?a WHERE { ${values} ?c p:P2046 ?s . ?s a wikibase:BestRank ; psn:P2046/wikibase:quantityAmount ?a }`))
            push(r.iso, "area_m2", Number(r.a.value));
        for (const r of await rows(`SELECT ?c ?d WHERE { ${values} ?c wdt:P1622 ?d }`))
            push(r.iso, "driving_side", { Q14565199: "right", Q11920728: "left" }[qid(r.d.value)] ?? null);
        for (const r of await rows(`SELECT ?c ?pl WHERE { ${values} ?c wdt:P2853 ?p . ?p rdfs:label ?pl FILTER(LANG(?pl)="en") }`))
            push(r.iso, "plugs", pick(r, "pl"));
        for (const r of await rows(`SELECT ?c ?v WHERE { ${values} ?c p:P2884 ?s . ?s a wikibase:BestRank ; psn:P2884/wikibase:quantityAmount ?v }`))
            push(r.iso, "voltage", Number(r.v.value));
        for (const r of await rows(`SELECT ?c ?x WHERE { ${values} ?c wdt:P984 ?x }`)) push(r.iso, "ioc", pick(r, "x"));
        for (const r of await rows(`SELECT ?c ?x WHERE { ${values} ?c wdt:P901 ?x }`)) push(r.iso, "fips", pick(r, "x"));
        for (const r of await rows(`SELECT ?c ?x WHERE { ${values} ?t wdt:P31 wd:Q6979593 ; wdt:P3441 ?x ; wdt:P1532 ?c }`)) push(r.iso, "fifa", pick(r, "x"));
        for (const r of await rows(`SELECT ?c WHERE { ${values} ?c p:P463 ?s . ?s ps:P463 wd:Q1065 . FILTER NOT EXISTS { ?s pq:P582 ?end } }`)) push(r.iso, "un_member", true);
        for (const r of await rows(`SELECT ?c ?p ?t WHERE { ${values} ?c p:P1082 ?s . ?s a wikibase:BestRank ; ps:P1082 ?p . OPTIONAL { ?s pq:P585 ?t } }`))
            push(r.iso, "population", { value: Number(r.p.value), date: pick(r, "t") });
        save("wikidata.json", out);
    },

    async population() {
        const fetchIndicator = async (code) => {
            const [, rows] = await get(`https://api.worldbank.org/v2/country/all/indicator/${code}?format=json&mrnev=1&per_page=500`, "json");
            return Object.fromEntries(rows.filter((r) => r.value != null).map((r) => [r.countryiso3code, { value: r.value, year: Number(r.date) }]));
        };
        save("worldbank.json", { population: await fetchIndicator("SP.POP.TOTL"), area_km2: await fetchIndicator("AG.SRF.TOTL.K2") });
    },

    async phone() {
        save("PhoneNumberMetadata.xml", await get(`https://raw.githubusercontent.com/google/libphonenumber/${PINS.libphonenumber}/resources/PhoneNumberMetadata.xml`));
    },

    async timezones() {
        const tmp = new URL("../upstream/.tz/", import.meta.url).pathname;
        mkdirSync(tmp, { recursive: true });
        const tgz = `${tmp}tzdata.tar.gz`;
        writeFileSync(tgz, Buffer.from(await (await fetch(`https://data.iana.org/time-zones/releases/tzdata${PINS.tzdata}.tar.gz`)).arrayBuffer()));
        execFileSync("tar", ["-xzf", tgz, "-C", tmp, "zone.tab", "backward"]);
        save("zone.tab", execFileSync("cat", [`${tmp}zone.tab`]).toString());
        save("tz-backward", execFileSync("cat", [`${tmp}backward`]).toString());
    },

    async address() {
        const out = { ZZ: JSON.parse(await get("https://chromium-i18n.appspot.com/ssl-address/data/ZZ")) };
        for (const iso of ROWS) {
            const d = JSON.parse(await get(`https://chromium-i18n.appspot.com/ssl-address/data/${iso}`));
            out[iso] = Object.fromEntries(["fmt", "require", "zip", "zipex", "zip_name_type", "state_name_type", "sublocality_name_type", "locality_name_type"].filter((k) => d[k] != null).map((k) => [k, d[k]]));
        }
        save("address.json", out);
    },

    async subdivisions() {
        const base = `https://raw.githubusercontent.com/unicode-org/cldr/${PINS.cldrTag}/common`;
        save("cldr-subdivisions-ar.xml", await get(`${base}/subdivisions/ar.xml`));
        save("cldr-subdivisions-en.xml", await get(`${base}/subdivisions/en.xml`));
        save("cldr-subdivision-validity.xml", await get(`${base}/validity/subdivision.xml`));
        save("cldr-subdivisions-supplemental.xml", await get(`${base}/supplemental/subdivisions.xml`));
    },

    async factbook() {
        // CIA World Factbook, final edition (discontinued 02/2026), public domain, via the CC0 factbook.json mirror.
        const tree = await get(`https://api.github.com/repos/factbook/factbook.json/git/trees/master?recursive=1`, "json");
        const files = tree.tree.map((t) => t.path).filter((p) => /^[a-z-]+\/[a-z]{2}\.json$/.test(p));
        const out = {};
        for (const path of files) {
            const d = JSON.parse(await get(`https://raw.githubusercontent.com/factbook/factbook.json/master/${path}`));
            const nat = d["People and Society"]?.Nationality;
            out[path.split("/")[1].slice(0, 2).toUpperCase()] = {
                name: d.Government?.["Country name"]?.["conventional short form"]?.text ?? null,
                long_name: d.Government?.["Country name"]?.["conventional long form"]?.text ?? null,
                nationality_adjective: nat?.adjective?.text ?? null,
                nationality_noun: nat?.noun?.text ?? null,
            };
        }
        save("factbook.json", out);
    },

    async power() {
        // U.S. Department of Commerce "Electric Current Worldwide" (public domain), via the Internet Archive.
        save("electric-current-worldwide.html", await get(PINS.ecwArchive));
    },
};

const only = process.argv.slice(2);
for (const [name, job] of Object.entries(jobs)) if (!only.length || only.includes(name)) await job();
