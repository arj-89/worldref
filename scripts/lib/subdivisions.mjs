// ISO 3166-2 subdivisions from CLDR: codes from the validity file, names from the ar/en subdivision files,
// parents from the containment file. Rows outside the dataset (including the excluded one) never appear.

const expand = (token) => {
    // "ad02~8" means ad02, ad03 ... ad08 (the last character runs).
    const m = token.match(/^(.*)(.)~(.)$/);
    if (!m) return [token];
    const out = [];
    const [, head, from, to] = m;
    for (let c = from.charCodeAt(0); c <= to.charCodeAt(0); c++) out.push(head + String.fromCharCode(c));
    return out;
};

export function buildSubdivisions(snap, rows) {
    const keep = new Set(rows.map((r) => r.toLowerCase()));
    const validity = snap("cldr-subdivision-validity.xml");
    const regular = validity.match(/<id type=['"]subdivision['"] idStatus=['"]regular['"]>([\s\S]*?)<\/id>/)[1];
    const codes = regular.replace(/<!--[\s\S]*?-->/g, "").trim().split(/\s+/).flatMap(expand);
    const namesOf = (xml) => Object.fromEntries([...xml.matchAll(/<subdivision type="([a-z0-9]+)"[^>]*>([^<]*)<\/subdivision>/g)].map((m) => [m[1], m[2]]));
    const ar = namesOf(snap("cldr-subdivisions-ar.xml"));
    const en = namesOf(snap("cldr-subdivisions-en.xml"));
    const parent = {};
    for (const m of snap("cldr-subdivisions-supplemental.xml").matchAll(/<subgroup type="([a-z0-9]+)" contains="([^"]+)"/g))
        for (const child of m[2].split(/\s+/)) if (!/^[A-Z]{2}$/.test(m[1])) parent[child] = m[1];
    const iso = (c) => `${c.slice(0, 2).toUpperCase()}-${c.slice(2).toUpperCase()}`;
    return codes
        .filter((c) => keep.has(c.slice(0, 2)))
        .map((c) => ({
            iso2: c.slice(0, 2).toUpperCase(),
            code: iso(c),
            name_ar: ar[c] ?? null,
            name_en: en[c] ?? null,
            parent: parent[c] && parent[c].length > 2 ? iso(parent[c]) : null,
        }))
        .sort((a, b) => a.code.localeCompare(b.code));
}
