// Builds the GitHub Pages site into site/_out: the bilingual pages (home, install, file builder, countries,
// one page per country, agents, 404), plus the static API, data files, schemas, flags and agent files.
//   node site/build.mjs
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { loadWording, render, esc, num, pluralKey } from "./lib/wording.mjs";

const ROOT = new URL("../", import.meta.url).pathname;
const OUT = `${ROOT}site/_out/`;
const BASE = "/worldref";
const ORIGIN = "https://arj-89.github.io";
const LANGS = ["ar", "en"];
const W = loadWording();
const read = (p) => readFileSync(`${ROOT}${p}`, "utf8");
const json = (p) => JSON.parse(read(p));

const countries = json("data/worldref.json");
const subdivisions = json("data/subdivisions.json");
const meta = json("data/meta.json");
const sources = json("data/sources.json");
const pkg = json("package.json");
const by = Object.fromEntries(countries.map((c) => [c.iso2, c]));
const MAP = json("upstream/snapshot/world-map.json");
const subsBy = {};
for (const s of subdivisions) (subsBy[s.iso2] ??= []).push(s);

const missing = new Set();
const t = (key, lang, vars) => {
    const e = W[key];
    if (!e) {
        missing.add(key);
        return key;
    }
    const out = render(e[lang], vars);
    return lang === "ar" ? out.replace(/لـ /g, "لـ\u00a0") : out;
};
const tl = (key, lang, vars) => (lang === "ar" ? isoLatin(t(key, lang, vars)) : t(key, lang, vars));
const sep = (lang) => (lang === "ar" ? "، " : ", ");
// In Arabic text, isolate Latin runs (C#, .NET, iOS) so they keep their order, and keep «لـ» with the next word.
const isoLatin = (html) => html.replace(/(^|[\s(«،\u0600-\u06FF])((?:[A-Za-z.#+][A-Za-z0-9.#+/-]*)(?: [A-Z][A-Za-z0-9.#+/-]*)*)(?![^<]*>)/g, (m, pre, run) => `${pre}<bdi dir="ltr">${run}</bdi>`);
const plain = (key, lang) => (W[key]?.[lang] ?? key).replace(/`/g, "");
const tp = (base, n, lang, vars = {}) => t(pluralKey(base, n, lang), lang, { n: num(n), ...vars });
const ltr = (s) => `<bdi dir="ltr">${esc(s)}</bdi>`;
const code = (s) => `<code dir="ltr">${esc(s)}</code>`;
const nameOf = (c, lang) => (lang === "ar" ? c.name_ar : c.name_en);
const href = (lang, path = "") => `${BASE}/${lang}/${path}`;

// ---------- page shell ----------
const assetHash = {};
function asset(p) {
    assetHash[p] ??= createHash("sha256").update(readFileSync(`${ROOT}site/assets/${p}`)).digest("hex").slice(0, 8);
    return `${BASE}/assets/${p}?v=${assetHash[p]}`;
}

function page({ lang, path, title, description, body, jsonld = [], noindex = false, alternates = true }) {
    const dir = lang === "ar" ? "rtl" : "ltr";
    const other = lang === "ar" ? "en" : "ar";
    const url = `${ORIGIN}${href(lang, path)}`;
    const alt = alternates
        ? LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${href(l, path)}">`).join("") + `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${BASE}/">`
        : "";
    return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
${alt}
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:locale" content="${lang === "ar" ? "ar_SA" : "en_US"}">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${BASE}/assets/icon.svg" type="image/svg+xml">
<link rel="preload" href="${BASE}/assets/fonts/plex-arabic-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset("site.css")}">
<script>try{var t=localStorage.getItem("wr-theme");if(t&&t!=="system")document.documentElement.dataset.theme=t}catch(e){}</script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head>
<body data-base="${BASE}" data-lang="${lang}" id="top">
<a class="skip" href="#main">${t("chrome.skip-link", lang)}</a>
${header(lang, path, other)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(lang, path, other)}
<a class="to-top" href="#top" data-to-top hidden>${t("chrome.top", lang)}</a>
<script type="module" src="${asset("app.js")}"></script>
</body>
</html>
`;
}

const NAV = [
    ["chrome.nav.install", "install/"],
    ["chrome.nav.build", "build/"],
    ["chrome.nav.countries", "countries/"],
    ["chrome.nav.agents", "agents/"],
];
function switches(lang, path, other) {
    return `<div class="switches">
<nav class="seg" aria-label="${plain("switch.language.label", lang)}"><a href="${href("ar", path)}" lang="ar" ${lang === "ar" ? 'aria-current="true"' : ""} data-lang-switch="ar">${t("switch.language.ar", lang)}</a><a href="${href("en", path)}" lang="en" ${lang === "en" ? 'aria-current="true"' : ""} data-lang-switch="en">${t("switch.language.en", lang)}</a></nav>
<div class="seg" role="group" aria-label="${plain("switch.theme.label", lang)}">${["system", "light", "dark"].map((m) => `<button type="button" aria-pressed="${m === "system"}" data-theme-set="${m}">${t(`switch.theme.${m}`, lang)}</button>`).join("")}</div>
</div>`;
}
function header(lang, path, other) {
    return `<header class="site-header">
<a class="wordmark" href="${href(lang)}" dir="ltr" translate="no">worldref</a>
<span class="prefs"><a class="lang" href="${href(other, path)}" lang="${other}" data-lang-switch="${other}">${t(`switch.language.${other}`, lang)}</a><button type="button" class="theme" data-theme-cycle data-labels="${esc(JSON.stringify(Object.fromEntries(["system", "light", "dark"].map((m) => [m, `${plain("switch.theme.label", lang)}: ${plain(`switch.theme.${m}`, lang)}`]))))}" aria-label="${esc(`${plain("switch.theme.label", lang)}: ${plain("switch.theme.system", lang)}`)}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" class="half"/></svg></button></span>
<nav class="nav" aria-label="${plain("chrome.menu.open", lang)}">${NAV.map(([k, p]) => `<a href="${href(lang, p)}" ${path === p || (p !== "" && path.startsWith(p)) ? 'aria-current="page"' : ""}>${t(k, lang)}</a>`).join("")}</nav>
</header>`;
}
function footer(lang, path, other) {
    const gh = "https://github.com/arj-89/worldref";
    return `<footer class="site-footer">
<nav aria-label="${plain("footer.site", lang)}"><a href="${href(lang)}">${t("chrome.nav.home", lang)}</a>${NAV.map(([k, p]) => `<a href="${href(lang, p)}">${t(k, lang)}</a>`).join("")}<a href="${href(lang)}#faq">${t("chrome.nav.faq", lang)}</a><a href="${href(lang)}#policy">${t("chrome.nav.policy", lang)}</a></nav>
<nav aria-label="GitHub"><a href="${gh}">${t("footer.repo", lang)}</a><a href="${gh}/issues/new/choose">${t("footer.issues", lang)}</a><a href="${gh}/tree/main/LICENSES">${t("footer.licences", lang)}</a><a href="${gh}/blob/main/CITATION.cff">${t("footer.cite", lang)}</a></nav>
<p class="fine">${t("footer.privacy", lang)} ${t("footer.licence-line", lang)} ${ltr(`v${pkg.version}`)}</p>
</footer>`;
}
const copyBtn = (text, lang, kind = "command") => `<button type="button" class="copy" data-copy="${esc(text)}" data-done="${esc(plain(`action.copied-${kind}`, lang))}" data-fail="${esc(plain("action.copy.error", lang))}">${t(`action.copy-${kind}`, lang)}</button>`;

// ---------- JSON-LD ----------
const datasetLd = (lang) => ({
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "worldref",
    description: plain("root.line", lang),
    url: `${ORIGIN}${href(lang)}`,
    inLanguage: ["ar", "en"],
    version: pkg.version,
    license: "https://github.com/arj-89/worldref/blob/main/LICENSE",
    isAccessibleForFree: true,
    keywords: pkg.keywords,
    creator: { "@type": "Organization", name: "worldref contributors", url: "https://github.com/arj-89/worldref" },
    distribution: [
        { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${ORIGIN}${BASE}/data/worldref.json` },
        { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${ORIGIN}${BASE}/data/csv/worldref.csv` },
    ],
});

// ---------- home ----------
const INSTALL_ROWS = installRows();
function home(lang) {
    const kinds = { country: countries.filter((c) => c.kind === "country").length, territory: countries.filter((c) => c.kind === "territory").length };
    const sa = by.SA;
    const apiUrl = `${ORIGIN}${BASE}/api/v1/sa.json`;
    const facts = [
        [num(meta.countries), t("home.facts.rows", lang), t("home.facts.rows.split", lang, { countries: num(kinds.country), territories: num(kinds.territory) })],
        [num(meta.subdivisions), t("home.facts.subdivisions", lang), ""],
        [num(meta.modules.length), t("home.facts.modules", lang), ""],
        ["3", t("home.facts.builds", lang), ""],
        ["8", t("home.facts.languages", lang), ""],
    ];
    const chips = ["الاردن", "00962", "KSA", "+1"];
    const faq = [1, 2, 3, 4, 5, 6].map((i) => `<details><summary><span>${t(`faq.q${i}`, lang)}</span></summary><div>${t(`faq.a${i}`, lang)}</div></details>`).join("");
    const body = `
<section class="hero">
<h1>${t("home.hero.title", lang)}</h1>
<p class="lede">${t("home.hero.body", lang, { count: num(meta.countries) })}</p>
<p class="actions"><a class="btn primary" href="${href(lang, "install/")}">${t("home.hero.install", lang)}</a><a class="btn" href="${href(lang, "build/")}">${t("home.hero.build", lang)}</a></p>
<div class="search" data-search>
<label for="q">${t("search.label", lang)}<sup class="fn"><a href="#note-1" aria-label="${plain("country.fn", lang).replace("{n}", "1")}">1</a></sup></label>
<input id="q" dir="auto" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search" aria-describedby="q-hint" aria-controls="q-results">
<p id="q-hint" class="hint">${t("search.hint", lang)}</p>
<p class="chips"><span>${t("search.try", lang)}</span>${chips.map((c) => `<button type="button" class="chip" data-chip="${esc(c)}"><bdi ${/[A-Za-z\u0621-\u064A]/.test(c) ? "" : 'dir="ltr"'}>${esc(c)}</bdi></button>`).join("")}</p>
<div id="q-results" class="results" role="region" aria-live="polite" aria-label="${plain("search.results.label", lang)}"></div>
<noscript><p><a href="${href(lang, "countries/")}">${t("search.list.all", lang, { count: num(meta.countries) })}</a></p></noscript>
<template id="q-words">${JSON.stringify(Object.fromEntries(["search.results.count.one", "search.results.count.two", "search.results.count.few", "search.results.count.many", "search.results.more", "search.results.source", "search.empty.body", "search.empty.action", "search.loading.label", "search.error.body", "search.offline.body", "search.list.all", "search.clear", "action.retry", "search.region"].map((k) => [k, W[k]?.[lang] ?? k]))).replace(/</g, "\\u003c")}</template>
</div>
</section>
<section class="facts" aria-labelledby="facts-h">
<h2 id="facts-h">${t("home.facts.title", lang)}<sup class="fn"><a href="#note-2" aria-label="${plain("country.fn", lang).replace("{n}", "2")}">2</a></sup></h2>
<dl>${facts.map(([n, label, sub]) => `<div><dt>${n}</dt><dd>${label}${sub ? `<span>${sub}</span>` : ""}</dd></div>`).join("")}</dl>
</section>
<section class="ways" aria-labelledby="ways-h">
<h2 id="ways-h">${t("home.ways.title", lang)}</h2>
<ul>
<li><a href="${href(lang, "install/")}"><strong>${t("home.ways.install.title", lang)}</strong><span>${t("home.ways.install.body", lang, { count: num(INSTALL_ROWS.length) })}</span></a></li>
<li><a href="${href(lang, "build/")}"><strong>${t("home.ways.build.title", lang)}</strong><span>${t("home.ways.build.body", lang)}</span></a></li>
<li><div><strong>${t("home.ways.api.title", lang)}</strong><span>${t("home.ways.api.body", lang)}</span><code dir="ltr" class="url">${esc(apiUrl)}</code>${copyBtn(apiUrl, lang, "url")}</div></li>
<li><a href="${href(lang, "agents/")}"><strong>${t("home.ways.agents.title", lang)}</strong><span>${t("home.ways.agents.body", lang)}</span></a></li>
</ul>
</section>
<section class="native" aria-labelledby="native-h">
<h2 id="native-h">${t("home.native.title", lang)}</h2>
<p>${t("home.native.body", lang)}</p>
<dl>
<div><dt>${t("home.native.search", lang)}</dt><dd>«الاردن» ← ${esc(by.JO.name_ar)}، «مصـر» ← ${esc(by.EG.name_ar)}</dd></div>
<div><dt>${t("home.native.nationality", lang)}</dt><dd>${esc(sa.nationality.nationality_ar_m)} / ${esc(sa.nationality.nationality_ar_f)}، ${esc(by.EG.nationality.nationality_ar_m)} / ${esc(by.EG.nationality.nationality_ar_f)}</dd></div>
<div><dt>${t("home.native.digits", lang)}</dt><dd>${t("home.native.digits.body", lang)}<br>${t("home.native.digits.result", lang, { number: ltr("0501234567") })} ${code("+966501234567")}</dd></div>
<div><dt>${t("home.native.sort", lang)}</dt><dd>${t("home.native.sort.value", lang)}</dd></div>
</dl>
<p><a href="https://github.com/arj-89/worldref/blob/main/${lang === "ar" ? "README.ar.md#أفضل-الممارسات" : "README.md#best-practices"}">${lang === "ar" ? "أفضل الممارسات كاملة" : "All best practices"}</a></p>
</section>
<section class="policy" id="policy" aria-labelledby="policy-h">
<h2 id="policy-h">${t("policy.title", lang)}</h2>
<ul><li>${t("policy.palestine", lang)}</li><li>${t("policy.disputed", lang)}</li><li>${t("policy.requests", lang)}</li></ul>
<p><a href="https://github.com/arj-89/worldref/blob/main/${lang === "ar" ? "README.ar.md#سياسة-البيانات" : "README.md#data-policy"}">${t("policy.full", lang)}</a></p>
</section>
<section class="faq" id="faq" aria-labelledby="faq-h">
<h2 id="faq-h">${t("faq.title", lang)}</h2>
${faq}
</section>
<aside class="notes wrap" aria-label="${plain("country.sec.sources", lang)}"><ol><li id="note-1">${t("search.results.source", lang)}</li><li id="note-2">${t("home.facts.version", lang, { version: esc(pkg.version), cldr: esc(meta.sources.cldr), phone: esc(meta.sources.libphonenumber) })}</li></ol></aside>`;
    const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: lang, mainEntity: [1, 2, 3, 4, 5, 6].map((i) => ({ "@type": "Question", name: plain(`faq.q${i}`, lang), acceptedAnswer: { "@type": "Answer", text: plain(`faq.a${i}`, lang) } })) };
    return page({ lang, path: "", title: plain("home.title", lang), description: plain("root.line", lang), body, jsonld: [datasetLd(lang), faqLd] });
}

// ---------- install ----------
function usageBlock(readmePath) {
    const md = read(readmePath);
    const m = md.match(/## Usage[\s\S]*?```\w*\n([\s\S]*?)```/);
    return m ? m[1].trim() : null;
}
function installRows() {
    const fetchLine = (url) => `const sa = await fetch("${url}").then((r) => r.json());\nconsole.log(sa.name_ar, sa.phone[0].calling_code); // السعودية +966`;
    return [
        { id: "js", registry: ["https://www.npmjs.com/package/worldref", "npm"], blocks: [["terminal", "npm i worldref"]], first: 'import { countries, byIso2, search, parsePhone } from "worldref";\n\nbyIso2("SA").name_ar;                        // "السعودية"\nsearch(countries, "الاردن", "ar")[0].iso2;   // "JO"\nparsePhone("0501234567", byIso2("SA")).e164; // "+966501234567"', guide: "README.md#install" },
        { id: "cdn", blocks: [["url", `https://cdn.jsdelivr.net/npm/worldref@${pkg.version}/data/worldref.json`]], first: fetchLine(`https://cdn.jsdelivr.net/npm/worldref@${pkg.version}/data/worldref.json`).replace('const sa = await fetch', "const all = await fetch").replace("console.log(sa.name_ar, sa.phone[0].calling_code); // السعودية +966", 'console.log(all.find((c) => c.iso2 === "SA").name_ar); // السعودية'), guide: "README.md#install" },
        { id: "swift", blocks: [["Package.swift", `.package(url: "https://github.com/arj-89/worldref.git", from: "${pkg.version}")`]], first: usageBlock("Sources/WorldRef/README.md"), guide: "Sources/WorldRef/README.md" },
        { id: "kotlin", registry: ["https://jitpack.io/#arj-89/worldref", "JitPack"], blocks: [["settings.gradle.kts", 'maven("https://jitpack.io")'], ["build.gradle.kts", `implementation("com.github.arj-89:worldref:v${pkg.version}")`]], first: usageBlock("kotlin/README.md"), guide: "kotlin/README.md" },
        { id: "python", registry: ["https://pypi.org/project/worldref/", "PyPI"], blocks: [["terminal", "pip install worldref"]], first: usageBlock("python/README.md"), guide: "python/README.md" },
        { id: "dart", registry: ["https://pub.dev/packages/worldref", "pub.dev"], blocks: [["terminal", "dart pub add worldref"]], first: usageBlock("dart/README.md"), guide: "dart/README.md" },
        { id: "php", registry: ["https://packagist.org/packages/arj-89/worldref", "Packagist"], blocks: [["terminal", "composer require arj-89/worldref"]], first: usageBlock("php/README.md"), guide: "php/README.md" },
        { id: "go", registry: ["https://pkg.go.dev/github.com/arj-89/worldref/go", "pkg.go.dev"], blocks: [["terminal", `go get github.com/arj-89/worldref/go@v${pkg.version}`]], first: usageBlock("go/README.md"), guide: "go/README.md" },
        { id: "csharp", registry: ["https://www.nuget.org/packages/WorldRef/", "NuGet"], blocks: [["terminal", "dotnet add package WorldRef"]], first: usageBlock("csharp/README.md"), guide: "csharp/README.md" },
        { id: "files", blocks: [], first: null, guide: "README.md#install" },
        { id: "mcp", registry: ["https://registry.modelcontextprotocol.io/?q=worldref", "MCP Registry"], blocks: [["terminal", "npx -y worldref mcp"]], first: null, guide: "README.md#for-ai-agents" },
        { id: "api", blocks: [["url", `${ORIGIN}${BASE}/api/v1/sa.json`]], first: fetchLine(`${ORIGIN}${BASE}/api/v1/sa.json`), guide: "README.md#install" },
    ];
}
function install(lang) {
    const where = (w) => (w === "terminal" ? t("install.where.terminal", lang) : w === "url" ? t("install.where.url", lang) : code(w));
    const rows = INSTALL_ROWS.map((r) => {
        const blocks = r.blocks
            .map(([w, line], i) => `<div class="cmd">${r.blocks.length > 1 ? `<p class="step">${t("install.step", lang, { n: num(i + 1), total: num(r.blocks.length) })}</p>` : ""}<p class="where">${where(w)}</p><pre dir="ltr"><code>${esc(line)}</code></pre>${copyBtn(line, lang, w === "url" ? "url" : "command")}</div>`)
            .join("");
        const extra = r.id === "files"
            ? `<p class="actions"><a class="btn primary" href="${href(lang, "build/")}">${t("chrome.nav.build", lang)}</a><a class="btn" href="https://github.com/arj-89/worldref/releases">${t("install.files.releases", lang)}</a></p>`
            : r.id === "mcp"
              ? `<p><a href="${href(lang, "agents/")}">${t("install.mcp.more", lang)}</a></p>`
              : "";
        const first = r.first ? `<details class="first"><summary>${t("install.first.show", lang)}</summary><p class="where">${t("install.first.title", lang)}</p><pre dir="ltr"><code>${esc(r.first)}</code></pre></details>` : "";
        return `<section class="stack" id="${r.id}" aria-labelledby="${r.id}-h"><h2 id="${r.id}-h">${tl(`install.stack.${r.id}`, lang)} <span>${tl(`install.stack.${r.id}.on`, lang)}</span></h2>${r.id === "files" ? `<p>${t("install.files.body", lang)}</p>` : ""}${blocks}${extra}${first}<p class="guide actions">${r.registry ? `<a class="btn" href="${r.registry[0]}" rel="external">${t("install.registry", lang, { name: esc(r.registry[1]) })}</a>` : ""}<a class="btn" href="https://github.com/arj-89/worldref/blob/main/${r.guide}">${t("install.guide", lang)}</a></p></section>`;
    }).join("");
    const jump = `<nav class="jump" aria-label="${plain("install.jump", lang)}">${INSTALL_ROWS.map((r) => `<a href="#${r.id}"><span>${tl(`install.stack.${r.id}`, lang)}</span></a>`).join("")}</nav>`;
    const body = `<section class="intro"><h1>${t("install.title", lang)}</h1><p class="lede">${t("install.body", lang)}</p>${jump}</section>${rows}
<section class="modules" aria-labelledby="mods-h"><h2 id="mods-h">${t("install.modules.title", lang)}</h2><p>${t("install.modules.body", lang)}</p><pre dir="ltr"><code>${esc('import phone from "worldref/data/modules/phone.json" with { type: "json" };\nimport { parsePhone } from "worldref/helpers";')}</code></pre><p>${t("install.modules.other", lang)}</p><div class="cmd"><pre dir="ltr"><code>${esc(`https://cdn.jsdelivr.net/gh/arj-89/worldref@${pkg.version}/data/modules/phone${lang === "ar" ? ".ar" : ".en"}.json`)}</code></pre>${copyBtn(`https://cdn.jsdelivr.net/gh/arj-89/worldref@${pkg.version}/data/modules/phone${lang === "ar" ? ".ar" : ".en"}.json`, lang, "url")}</div><p>${t("install.null", lang)}</p><p><a class="btn" href="${href(lang, "build/")}">${t("install.modules.build", lang)}</a></p></section>`;
    return page({ lang, path: "install/", title: `${plain("install.title", lang)} | worldref`, description: plain("install.body", lang), body, jsonld: [datasetLd(lang)] });
}

// ---------- builder ----------
const MODULES = meta.modules;
function builder(lang) {
    const sizes = {};
    for (const f of readdirSync(`${ROOT}data/modules`)) sizes[`modules/${f}`] = statSync(`${ROOT}data/modules/${f}`).size;
    for (const f of readdirSync(`${ROOT}data`)) if (f.endsWith(".json")) sizes[f] = statSync(`${ROOT}data/${f}`).size;
    for (const f of readdirSync(`${ROOT}data/csv`)) sizes[`csv/${f}`] = statSync(`${ROOT}data/csv/${f}`).size;
    const words = Object.fromEntries(Object.keys(W).filter((k) => k.startsWith("build.") || k.startsWith("module.") || k === "action.retry").map((k) => [k, W[k][lang]]));
    const radio = (name, value, label, checked) => `<label><input type="radio" name="${name}" value="${value}" ${checked ? "checked" : ""}>${label}</label>`;
    const body = `<section class="intro"><h1>${t("build.title", lang)}</h1><p class="lede">${t("build.body", lang)}</p></section>
<form class="builder" data-builder>
<fieldset class="seg-field"><legend>${t("build.lang.label", lang)}</legend>${radio("b", "", t("build.bilingual", lang), true)}${radio("b", ".ar", t("build.ar", lang))}${radio("b", ".en", t("build.en", lang))}</fieldset>
<fieldset><legend>${t("build.modules.label", lang)}</legend><p class="hint" data-mod-status>${t("build.modules.all", lang)}. ${t("build.modules.hint", lang)}</p>${MODULES.map((m) => `<label class="check"><input type="checkbox" name="m" value="${m}">${lang === "en" ? t(`module.${m}`, lang).replace(/^./, (c) => c.toUpperCase()) : t(`module.${m}`, lang)}</label>`).join("")}<button type="button" class="link" data-mod-clear>${t("build.modules.clear", lang)}</button></fieldset>
<fieldset class="seg-field"><legend>${t("build.subs.label", lang, { n: num(meta.subdivisions) })}</legend>${radio("s", "none", t("build.subs.none", lang), true)}${radio("s", "inside", t("build.subs.inside", lang))}${radio("s", "only", t("build.subs.only", lang))}</fieldset>
<fieldset class="seg-field"><legend>${t("build.format.label", lang)}</legend>${radio("f", "json", "JSON", true)}${radio("f", "csv", "CSV")}</fieldset>
<div class="bar"><p data-size aria-live="polite"></p><button type="submit" class="btn primary">${t("build.download", lang)}</button><p data-status class="hint" aria-live="polite"></p></div>
<section class="preview" aria-labelledby="pv-h"><h2 id="pv-h">${t("build.preview.title", lang)}</h2><pre dir="ltr" data-preview></pre><p class="hint" data-preview-end></p></section>
<template id="b-words">${JSON.stringify(words).replace(/</g, "\\u003c")}</template>
<template id="b-sizes">${JSON.stringify(sizes)}</template>
</form>`;
    return page({ lang, path: "build/", title: `${plain("build.title", lang)} | worldref`, description: plain("build.body", lang), body });
}

// ---------- countries index ----------
const CONTINENTS = ["asia", "africa", "europe", "americas", "oceania"];
function index(lang) {
    const kinds = { countries: countries.filter((c) => c.kind === "country").length, territories: countries.filter((c) => c.kind === "territory").length };
    const key = lang === "ar" ? "sort_ar" : "sort_en";
    const order = [...CONTINENTS].sort((a, b) => (W[`continent.${a}`][lang].replace(/^ال/, "") < W[`continent.${b}`][lang].replace(/^ال/, "") ? -1 : 1));
    const groups = order.map((ct) => {
        const rows = countries.filter((c) => c.continent === ct).sort((a, b) => (a[key] < b[key] ? -1 : 1));
        return `<section aria-labelledby="ct-${ct}"><h2 id="ct-${ct}">${t(`continent.${ct}`, lang)} (${ltr(num(rows.length))})</h2><ul class="rows">${rows.map((c) => `<li data-iso="${c.iso2}"><a href="${href(lang, `countries/${c.iso2.toLowerCase()}/`)}"><img class="flag" src="${BASE}/flags/${c.iso2.toLowerCase()}.svg" alt="" width="22" height="16" loading="lazy"><span class="name">${esc(nameOf(c, lang))}</span><span class="oth" lang="${lang === "ar" ? "en" : "ar"}">(${esc(nameOf(c, lang === "ar" ? "en" : "ar"))})</span><span class="meta">${c.phone[0] ? ltr(c.phone[0].calling_code) : ""}</span></a></li>`).join("")}</ul></section>`;
    }).join("");
    const body = `<section class="intro"><h1>${t("index.title", lang)}</h1><p class="lede">${t("index.body", lang, { count: num(countries.length), countries: num(kinds.countries), territories: num(kinds.territories) })}</p>
<div class="search" data-filter data-error="${esc(plain("index.error", lang))}"><label for="f">${t("search.label", lang)}</label><input id="f" dir="auto" type="search" autocomplete="off" spellcheck="false"><p class="hint">${t("search.hint", lang)}</p></div>
<p class="fine"><a href="${href(lang)}#policy">${t("index.policy", lang)}</a></p></section>
<figure class="map" dir="ltr" data-map><svg viewBox="${MAP.viewBox}" role="img" aria-label="${esc(plain("index.title", lang))}">${Object.entries(MAP.paths).filter(([iso]) => by[iso]).map(([iso, d]) => `<a href="${href(lang, `countries/${iso.toLowerCase()}/`)}" tabindex="-1" data-iso="${iso}"><path d="${d}"><title>${esc(nameOf(by[iso], lang))}</title></path></a>`).join("")}</svg><div class="map-tools" dir="${lang === "ar" ? "rtl" : "ltr"}"><button type="button" data-zoom="in" aria-label="${plain("index.map.zoom-in", lang)}">+</button><button type="button" data-zoom="out" aria-label="${plain("index.map.zoom-out", lang)}">−</button><button type="button" data-zoom="reset" aria-label="${plain("index.map.reset", lang)}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2"/></svg></button></div><figcaption dir="${lang === "ar" ? "rtl" : "ltr"}" data-map-name aria-hidden="true">&nbsp;</figcaption></figure>
${groups}`;
    return page({ lang, path: "countries/", title: `${plain("index.title", lang)} | worldref`, description: plain("index.title", lang), body, jsonld: [datasetLd(lang)] });
}

// ---------- country page ----------
const SRC_KEY = { iso: "source.iso", cldr: "source.cldr", cldrSub: "source.cldr-sub", wikidata: "source.wikidata", factbook: "source.factbook", worldbank: "source.worldbank", libphonenumber: "source.libphonenumber", iana_tz: "source.iana-tz", iana_root: "source.iana-root", google_address: "source.google-address", ecw: "source.ecw", emergency: "source.emergency", official_lists: "source.official-lists", icao: "source.icao", flag_icons: "source.flag-icons", editorial: "source.editorial", generated: "country.src.generated" };
const DAYS = (d, lang) => t(`day.${d}`, lang);
function countryPage(c, lang) {
    const n = nameOf(c, lang);
    const v = (x) => (x == null || (Array.isArray(x) && !x.length) ? `<span class="null">${t("country.null", lang)}</span>` : x);
    const row = (label, value) => `<div><dt>${t(label, lang)}</dt><dd>${v(value)}</dd></div>`;
    const sec = (id, title, rows, extra = "") => `<section id="${id}" aria-labelledby="${id}-h"><h2 id="${id}-h">${title}</h2><dl>${rows.join("")}</dl>${extra}</section>`;
    const L = (ar, en) => (lang === "ar" ? ar : en);
    const nat = c.nationality;
    const geo = c.geo;
    const loc = c.locale;
    const em = c.travel.emergency;
    const emv = (k) => (em?.[k] ? ltr(em[k]) : em?.general ? t("country.v.call-general", lang, { general: ltr(em.general) }) : null);
    const phones = c.phone.map((p) => [
        row("country.f.calling", ltr(p.calling_code) + (c.phone.length > 1 && p.primary ? "" : "")),
        row("country.f.leading", p.leading_digits ? code(p.leading_digits) : null),
        row("country.f.trunk", p.trunk_prefix ? ltr(p.trunk_prefix) : null),
        row("country.f.lengths", p.lengths.length ? p.lengths.map((x) => ltr(x)).join(sep(lang)) : null),
        row("country.f.mobile-lengths", p.mobile_lengths.length ? p.mobile_lengths.map((x) => ltr(x)).join(sep(lang)) : null),
        row("country.f.prefixes", p.mobile_prefixes.length ? p.mobile_prefixes.map((x) => ltr(x)).join(sep(lang)) : null),
        row("country.f.example", p.mobile_example ? ltr(p.mobile_example) : null),
        row("country.f.mobile-pattern", p.mobile_pattern ? code(p.mobile_pattern) : null),
        row("country.f.distinct", t(p.mobile_distinguishable ? "country.yes" : "country.no", lang)),
    ].join("")).join('<hr>');
    const subs = subsBy[c.iso2] ?? [];
    const overrides = sources.overrides.filter((o) => o.iso2 === c.iso2);
    const used = new Set();
    const srcFor = (col) => {
        const k = Object.entries(sources.columns).find(([keys]) => keys.split(",").includes(col))?.[1];
        if (k) used.add(k);
        return k;
    };
    ["name_ar", "nationality.nationality_ar_m", "nationality.nationality_en", "phone", "currencies", "geo.capital_ar", "geo.population", "geo.timezones", "locale", "address", "travel.emergency", "travel.plug_types", "travel.frequency_hz", "sports.fifa", "flag_svg", "iso2"].forEach(srcFor);
    const srcList = [...used].map((k) => {
        const s = sources.sources[k];
        let ver = /^\d|^v\d|release/.test(s.version) ? t("country.src.version", lang, { v: esc(s.version) }) : s.version === "snapshot" ? t("country.src.snapshot", lang) : "";
        if (lang === "en") ver = ver.replace(/^./, (x) => x.toLowerCase());
        const name = t(SRC_KEY[k] ?? "source.editorial", lang);
        const lic = s.licence ? t("country.src.licence", lang, { l: esc(s.licence.replace(/ \(.*\)$/, "")) }) : "";
        return `<li>${s.url.startsWith("http") ? `<a href="${esc(s.url)}" rel="external">${name}</a>` : name}${ver ? `${sep(lang)}${ver}` : ""}${lic ? `${sep(lang)}${lic}` : ""}</li>`;
    }).join("");
    const emSources = sources.emergency_sources.find((e) => e.iso2 === c.iso2);
    const body = `<article class="country">
<header class="c-head"><p class="flag" aria-hidden="true"><img src="${BASE}/flags/${c.iso2.toLowerCase()}.svg" alt="" width="64" height="48"></p><h1>${esc(n)}</h1><p class="lede">${ltr(c.iso2)} ${ltr(c.iso3 ?? "")} ${c.phone[0] ? ltr(c.phone[0].calling_code) : ""} ${t(`kind.${c.kind}`, lang)}</p>
<p class="actions"><a class="btn" href="${BASE}/api/v1/${c.iso2.toLowerCase()}.json">${t("country.json.open", lang)}</a></p><div class="cmd"><code class="url" dir="ltr">${ORIGIN}${BASE}/api/v1/${c.iso2.toLowerCase()}.json</code>${copyBtn(`${ORIGIN}${BASE}/api/v1/${c.iso2.toLowerCase()}.json`, lang, "url")}</div></header>
${sec("names", t("country.sec.names", lang), [
    row("country.f.name", `${esc(c.name_ar)} / ${esc(c.name_en)}`),
    row("country.f.official", c.official_name_ar || c.official_name_en ? [c.official_name_ar, c.official_name_en].filter(Boolean).map(esc).join(" / ") : null),
    row("country.f.aliases", [...c.aliases_ar, ...c.aliases_en].length ? `<details><summary><span>${t("country.v.aliases", lang, { ar: num(c.aliases_ar.length), en: num(c.aliases_en.length) })}</span></summary>${[...c.aliases_ar, ...c.aliases_en].map(esc).join(sep(lang))}</details>` : null),
    row("country.f.flag-emoji", `<span class="emoji" role="img" aria-label="${esc(n)}">${c.flag}</span> <img src="${BASE}/${c.flag_svg}" alt="" width="28" height="21" class="inline-flag"> ${code(c.flag_svg)}`),
    row("country.f.codes", `${ltr(c.iso2)} ${ltr(c.iso3 ?? "")} ${ltr(c.iso_numeric ?? "")}`),
    row("country.f.kind", t(`kind.${c.kind}`, lang)),
    row("country.f.continent", c.continent ? t(`continent.${c.continent}`, lang) : null),
    row("country.f.groups", c.groups.length ? c.groups.map((g) => t(`group.${g.replace("_", "-")}`, lang)).join(sep(lang)) : null),
    row("country.f.un", t(c.un_member ? "country.yes" : "country.no", lang)),
    row("country.f.tld", c.tld ? ltr(c.tld) : null),
])}
${sec("nationality", t("country.sec.nationality", lang), [
    row("country.f.nat-m", nat.nationality_ar_m ? esc(nat.nationality_ar_m) : null),
    row("country.f.nat-f", nat.nationality_ar_f ? esc(nat.nationality_ar_f) : null),
    row("country.f.nat-en", nat.nationality_en ? `<span lang="en">${esc(nat.nationality_en)}</span>` : null),
    row("country.f.icao", nat.icao_code ? ltr(nat.icao_code) : null),
])}
<section id="phone" aria-labelledby="phone-h"><h2 id="phone-h">${t("country.sec.phone", lang)}</h2><dl>${phones || `<div><dd>${v(null)}</dd></div>`}</dl>
${c.phone.length ? `<form class="try" data-try="${c.iso2}"><label for="tel">${t("country.try.label", lang)}</label><input id="tel" type="tel" inputmode="tel" autocomplete="off" dir="ltr" aria-describedby="tel-hint tel-out"><p id="tel-hint" class="hint">${t("country.try.hint", lang)}</p><button type="submit" class="btn">${t("country.try.action", lang)}</button><div id="tel-out" aria-live="polite"></div><template>${JSON.stringify(Object.fromEntries(Object.keys(W).filter((k) => k.startsWith("country.try.")).map((k) => [k, W[k][lang]]))).replace(/</g, "\\u003c")}</template></form>` : ""}
</section>
${sec("currency", t("country.sec.currency", lang), c.currencies.length ? c.currencies.map((cu) => row("country.f.cur-code", `${ltr(cu.code)} ${esc(lang === "ar" ? cu.name_ar ?? "" : cu.name_en ?? "")} ${cu.symbol ? `<bdi>${esc(cu.symbol)}</bdi>` : ""}${cu.symbol_fallback ? ` (${esc(cu.symbol_fallback)})` : ""}`)) : [row("country.f.cur-code", null)])}
${sec("geo", t("country.sec.geo", lang), [
    row("country.f.capital", lang === "ar" ? (geo.capital_ar ? esc(geo.capital_ar) : null) : geo.capital_en ? esc(geo.capital_en) : null),
    row("country.f.area", geo.area_km2 != null ? t("country.v.area", lang, { n: num(geo.area_km2) }) : null),
    row("country.f.population", geo.population != null ? t("country.v.population", lang, { n: num(geo.population), year: ltr(String(geo.population_year ?? "")) }) : null),
    row("country.f.centre", geo.lat != null ? ltr(`${geo.lat}, ${geo.lng}`) : null),
    row("country.f.timezones", geo.timezones.length ? geo.timezones.map(code).join(" ") : null),
    row("country.f.driving", geo.driving_side ? t(`driving.${geo.driving_side}`, lang) : null),
])}
${sec("locale", t("country.sec.locale", lang), [
    row("country.f.languages", loc.languages.length ? loc.languages.map((l) => esc((lang === "ar" ? l.name_ar : l.name_en) ?? l.code)).join(sep(lang)) : null),
    row("country.f.week-start", DAYS(loc.week_start, lang)),
    row("country.f.weekend", loc.weekend.map((d) => DAYS(d, lang)).join(sep(lang))),
    row("country.f.calendars", loc.calendars.map((k) => (W[`cal.${k}`] ? t(`cal.${k}`, lang) : code(k))).join(sep(lang))),
    row("country.f.measurement", t(`measurement.${loc.measurement}`, lang)),
])}
${sec("address", t("country.sec.address", lang), [
    row("country.f.postal-format", c.address.postal_code_format ? `${ltr(c.address.postal_code_format)} <span class="hint">${t("country.v.postal-legend", lang)}</span>` : null),
    row("country.f.postal-example", c.address.postal_code_example ? ltr(c.address.postal_code_example) : null),
    row("country.f.postal-regex", c.address.postal_code_regex ? code(c.address.postal_code_regex) : null),
    row("country.f.address", c.address.address_format ? code(c.address.address_format) : null),
    row("country.f.region-label", (lang === "ar" ? c.address.region_label_ar : c.address.region_label_en) ? esc(lang === "ar" ? c.address.region_label_ar : c.address.region_label_en) : null),
])}
${sec("travel", t("country.sec.travel", lang), [
    row("country.f.police", emv("police")),
    row("country.f.ambulance", emv("ambulance")),
    row("country.f.fire", emv("fire")),
    row("country.f.general", em?.general ? ltr(em.general) : null),
    row("country.f.plugs", c.travel.plug_types.length ? c.travel.plug_types.map((x) => ltr(x)).join(sep(lang)) : null),
    row("country.f.voltage", c.travel.voltage.length ? c.travel.voltage.map((x) => t("country.v.volts", lang, { v: num(x) })).join(sep(lang)) : null),
    row("country.f.frequency", c.travel.frequency_hz?.length ? c.travel.frequency_hz.map((x) => t("country.v.hertz", lang, { v: num(x) })).join(sep(lang)) : null),
], emSources ? `<p class="fine">${t("country.src.links", lang, { name: esc(n) })} ${emSources.sources.map((u) => `<a href="${esc(u)}" rel="external">${ltr(new URL(u).hostname.replace(/^www\./, ""))}</a>`).join(sep(lang))}</p>` : "")}
${sec("sports", t("country.sec.sports", lang), [row("country.f.fifa", c.sports.fifa ? ltr(c.sports.fifa) : null), row("country.f.ioc", c.sports.ioc ? ltr(c.sports.ioc) : null)])}
<section id="subdivisions" aria-labelledby="subs-h"><h2 id="subs-h">${t("country.sec.subdivisions", lang, { n: num(subs.length) })}</h2>${subs.length ? `<ul class="rows subs">${subs.map((s) => `<li><span class="name">${esc((lang === "ar" ? s.name_ar : s.name_en) ?? s.name_en ?? s.name_ar ?? "")}</span><span class="meta">${ltr(s.code)}</span></li>`).join("")}</ul>` : `<p>${t("country.subs.empty", lang, { name: esc(n) })}</p>`}</section>
${overrides.length ? `<section id="overrides" aria-labelledby="ovr-h"><h2 id="ovr-h">${t("country.sec.overrides", lang)}</h2><ul>${overrides.map((o) => { const k = `ovr.${o.iso2.toLowerCase()}.${o.field}`; return `<li>${code(o.field)}: ${W[k] ? t(k, lang) : lang === "en" ? esc(o.why) : `<a href="https://github.com/arj-89/worldref/blob/main/data/sources.json">${t("country.sec.sources", lang)}</a>`}</li>`; }).join("")}</ul></section>` : ""}
<section id="sources" aria-labelledby="src-h"><h2 id="src-h">${t("country.sec.sources", lang)}</h2><ul class="fine">${srcList}</ul><p class="fine"><a href="https://github.com/arj-89/worldref/blob/main/data/sources.json">sources.json</a></p></section>
</article>`;
    const ld = {
        "@context": "https://schema.org",
        "@type": "Country",
        name: n,
        alternateName: [lang === "ar" ? c.name_en : c.name_ar, c.official_name_ar, c.official_name_en, ...c.aliases_en].filter(Boolean),
        identifier: [c.iso2, c.iso3].filter(Boolean),
        url: `${ORIGIN}${href(lang, `countries/${c.iso2.toLowerCase()}/`)}`,
        ...(geo.lat != null ? { geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng } } : {}),
        isPartOf: { "@type": "Dataset", name: "worldref", url: `${ORIGIN}${href(lang)}` },
    };
    const desc = [n, c.phone[0]?.calling_code, lang === "ar" ? nat.nationality_ar_m : nat.nationality_en, lang === "ar" ? geo.capital_ar : geo.capital_en].filter(Boolean).join(sep(lang));
    return page({ lang, path: `countries/${c.iso2.toLowerCase()}/`, title: plain("country.title", lang).replace("{name}", n), description: desc, body, jsonld: [ld] });
}

// ---------- agents ----------
function agents(lang) {
    const files = [
        ["llms.txt", "agents.file.llms"],
        ["llms-full.txt", "agents.file.llms-full"],
        ["AGENTS.md", "agents.file.agents-md"],
        ["openapi.json", "agents.file.openapi"],
        ["schema/worldref.schema.json", "agents.file.schema"],
        ["api/v1/sa.json", "agents.file.country"],
    ];
    const mcp = "npx -y worldref mcp";
    const body = `<section class="intro"><h1>${t("agents.title", lang)}</h1><p class="lede">${t("agents.body", lang)}</p></section>
<section aria-labelledby="mcp-h"><h2 id="mcp-h">${t("agents.mcp.title", lang)}</h2><pre dir="ltr"><code>${esc(mcp)}</code></pre>${copyBtn(mcp, lang)}<p>${t("agents.mcp.tools", lang, { tools: ["get_country", "search_countries", "validate_phone", "list_subdivisions"].map(code).join(" ") })}</p></section>
<section aria-labelledby="files-h"><h2 id="files-h">${t("agents.files.title", lang)}</h2><ul class="rows">${files.map(([f, k]) => `<li><a href="${BASE}/${f}"><span class="name">${code(f)}</span><span class="meta">${t(k, lang)}</span></a></li>`).join("")}</ul></section>
<section aria-labelledby="rules-h"><h2 id="rules-h">${t("agents.rules.title", lang)}</h2><ul><li>${t("agents.rules.null", lang)}</li><li>${t("agents.rules.phone", lang)}</li><li>${t("agents.rules.emergency", lang)}</li></ul></section>`;
    return page({ lang, path: "agents/", title: `${plain("agents.title", lang)} | worldref`, description: plain("agents.body", lang), body, jsonld: [datasetLd(lang)] });
}

// ---------- root and 404 ----------
function root() {
    return `<!doctype html>
<html lang="ar" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>worldref</title><meta name="description" content="${esc(plain("root.line", "en"))}">
<link rel="canonical" href="${ORIGIN}${BASE}/">${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${href(l)}">`).join("")}<link rel="alternate" hreflang="x-default" href="${ORIGIN}${BASE}/">
<meta name="color-scheme" content="light dark"><link rel="icon" href="${BASE}/assets/icon.svg" type="image/svg+xml"><link rel="stylesheet" href="${asset("site.css")}">
<script>(function(){try{var s=localStorage.getItem("wr-lang")}catch(e){}var l=s||((navigator.languages&&navigator.languages[0])||navigator.language||"en").toLowerCase().indexOf("ar")===0?"ar":"en";if(s)l=s;location.replace("${BASE}/"+l+"/")})()</script>
<script type="application/ld+json">${JSON.stringify(datasetLd("en"))}</script>
</head>
<body class="root"><main id="main">
<p class="wordmark" dir="ltr">worldref</p>
<div lang="ar" dir="rtl"><p>${t("root.line", "ar")}</p><p><a class="btn primary" href="${href("ar")}">${t("root.enter", "ar")}</a></p></div>
<div lang="en" dir="ltr"><p>${t("root.line", "en")}</p><p><a class="btn primary" href="${href("en")}">${t("root.enter", "en")}</a></p></div>
</main></body></html>
`;
}
function notFound() {
    const block = (lang) => `<div lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}" class="nf" data-nf="${lang}"><h2>${t("notfound.title", lang)}</h2><p>${t("notfound.body", lang)}</p><p class="actions"><a class="btn primary" href="${href(lang)}">${t("notfound.home", lang)}</a><a class="btn" href="${href(lang, "countries/")}">${t("chrome.nav.countries", lang)}</a></p></div>`;
    return `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>404 | worldref</title><meta name="color-scheme" content="light dark"><link rel="icon" href="${BASE}/assets/icon.svg" type="image/svg+xml"><link rel="stylesheet" href="${asset("site.css")}">
<script>try{var t=localStorage.getItem("wr-theme");if(t&&t!=="system")document.documentElement.dataset.theme=t}catch(e){}</script>
</head><body class="root"><main id="main"><h1 class="wordmark" dir="ltr"><a href="${BASE}/" translate="no">worldref</a> <bdi>404</bdi></h1>${block("ar")}${block("en")}
<script>(function(){var l;try{l=localStorage.getItem("wr-lang")}catch(e){}var m=location.pathname.match(/\\/(ar|en)\\//);if(m)l=m[1];if(!l)l=(navigator.language||"").toLowerCase().indexOf("ar")===0?"ar":"en";var c=location.pathname.match(/^(.*\\/countries\\/)([A-Z]{2})\\/?$/);if(c){location.replace(c[1]+c[2].toLowerCase()+"/");return}var o=document.querySelector('[data-nf="'+(l==="ar"?"en":"ar")+'"]');if(o){o.classList.add("secondary");o.querySelectorAll(".primary").forEach(function(b){b.classList.remove("primary")})}document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr"})()</script>
</main><footer class="site-footer"><p class="fine" lang="ar" dir="rtl">${t("footer.privacy", "ar")}</p><p class="fine" lang="en" dir="ltr">${t("footer.privacy", "en")}</p></footer></body></html>
`;
}

// ---------- write ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const write = (p, s) => {
    mkdirSync(`${OUT}${p}`.replace(/[^/]*$/, ""), { recursive: true });
    writeFileSync(`${OUT}${p}`, s);
};
const urls = [];
for (const lang of LANGS) {
    write(`${lang}/index.html`, home(lang));
    write(`${lang}/install/index.html`, install(lang));
    write(`${lang}/build/index.html`, builder(lang));
    write(`${lang}/countries/index.html`, index(lang));
    write(`${lang}/agents/index.html`, agents(lang));
    for (const c of countries) write(`${lang}/countries/${c.iso2.toLowerCase()}/index.html`, countryPage(c, lang));
    urls.push("", "install/", "build/", "countries/", "agents/", ...countries.map((c) => `countries/${c.iso2.toLowerCase()}/`));
}
write("index.html", root());
write("404.html", notFound());

// Static files at their published paths (never moved): API, schemas, flags, agent files, OpenAPI.
cpSync(`${ROOT}data/api`, `${OUT}api`, { recursive: true });
cpSync(`${ROOT}schema`, `${OUT}schema`, { recursive: true });
cpSync(`${ROOT}flags`, `${OUT}flags`, { recursive: true });
for (const f of ["llms.txt", "llms-full.txt", "AGENTS.md"]) cpSync(`${ROOT}${f}`, `${OUT}${f}`);
cpSync(`${ROOT}site/openapi.json`, `${OUT}openapi.json`);
// Data files for the file builder (same origin). No SQL.
mkdirSync(`${OUT}data`, { recursive: true });
for (const f of readdirSync(`${ROOT}data`)) if (f.endsWith(".json")) cpSync(`${ROOT}data/${f}`, `${OUT}data/${f}`);
cpSync(`${ROOT}data/modules`, `${OUT}data/modules`, { recursive: true });
cpSync(`${ROOT}data/csv`, `${OUT}data/csv`, { recursive: true });
// Site assets, with the shipped helpers (the same search and phone code developers install).
cpSync(`${ROOT}site/assets`, `${OUT}assets`, { recursive: true });
for (const f of ["helpers.js", "text.js"]) cpSync(`${ROOT}dist/${f}`, `${OUT}assets/lib/${f}`);
// Search file: the fields search() and sortCountries() read, plus what a result row shows.
write("assets/search.json", JSON.stringify(countries.map((c) => ({ iso2: c.iso2, iso3: c.iso3, name_ar: c.name_ar, name_en: c.name_en, aliases_ar: c.aliases_ar, aliases_en: c.aliases_en, sort_ar: c.sort_ar, sort_en: c.sort_en, flag: c.flag, phone: c.phone.map((p) => ({ calling_code: p.calling_code, primary: p.primary })) }))));

write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}${BASE}/sitemap.xml\n`);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${[...new Set(urls)].flatMap((p) => LANGS.map((l) => `<url><loc>${ORIGIN}${href(l, p)}</loc>${LANGS.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${ORIGIN}${href(a, p)}"/>`).join("")}</url>`)).join("\n")}\n</urlset>\n`);
write(".nojekyll", "");

if (missing.size) throw new Error(`missing wording keys: ${[...missing].join(", ")}`);
console.log(`site/_out: ${urls.length + 2} pages, ${countries.length} countries x ${LANGS.length} languages`);
