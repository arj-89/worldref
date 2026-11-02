// Site behaviour: theme and language memory, copy buttons, live search, countries filter, file builder,
// phone tester. Search and phone checks use the same helpers the package ships (assets/lib/).
import { search, sortCountries, parsePhone, formatNational } from "./lib/helpers.js";
import { normalize } from "./lib/text.js";

const BASE = document.body.dataset.base;
const LANG = document.body.dataset.lang;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const num = (n) => Number(n).toLocaleString("en-US");
const fill = (s, vars) => esc(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? `<bdi>${vars[k]}</bdi>` : m)).replace(/`([^`]+)`/g, '<code dir="ltr">$1</code>');
const words = (id) => JSON.parse($(`#${id}`)?.innerHTML || "{}");
const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

// ---------- theme and language ----------
function applyTheme(mode) {
    if (mode === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = mode;
    $$("[data-theme-set]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.themeSet === mode)));
}
applyTheme(store.get("wr-theme") || "system");
$$("[data-theme-set]").forEach((b) => b.addEventListener("click", () => { store.set("wr-theme", b.dataset.themeSet); applyTheme(b.dataset.themeSet); }));
$$("[data-lang-switch]").forEach((a) => a.addEventListener("click", () => store.set("wr-lang", a.dataset.langSwitch)));

// ---------- copy ----------
document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const label = b.innerHTML;
    try {
        await navigator.clipboard.writeText(b.dataset.copy);
        b.textContent = b.dataset.done;
        const first = b.closest(".stack")?.querySelector("details.first");
        if (first) first.open = true;
    } catch {
        b.textContent = b.dataset.fail;
        const code = b.previousElementSibling;
        if (code) getSelection().selectAllChildren(code);
    }
    setTimeout(() => (b.innerHTML = label), 2000);
});

// ---------- search data ----------
let searchData;
const loadSearch = () => (searchData ??= fetch(`${BASE}/assets/search.json`).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }));
const region = (navigator.languages?.[0] || navigator.language || "").split("-")[1]?.toUpperCase();
const nameOf = (c) => (LANG === "ar" ? c.name_ar : c.name_en);
const otherName = (c) => (LANG === "ar" ? c.name_en : c.name_ar);
const rowHtml = (c) => `<li><a href="${BASE}/${LANG}/countries/${c.iso2.toLowerCase()}/"><img class="flag" src="${BASE}/flags/${c.iso2.toLowerCase()}.svg" alt="" width="22" height="16"><span class="name">${esc(nameOf(c))}</span><span class="oth" lang="${LANG === "ar" ? "en" : "ar"}">${esc(otherName(c))}</span><span class="meta"><bdi dir="ltr">${c.phone[0]?.calling_code ?? ""}</bdi></span></a></li>`;

const box = $("[data-search]");
if (box) {
    const W = words("q-words");
    const input = $("#q", box);
    const out = $("#q-results", box);
    let showAll = false;
    const plural = (n) => (LANG === "en" ? (n === 1 ? "one" : "many") : n === 1 ? "one" : n === 2 ? "two" : n <= 10 ? "few" : "many");
    const draw = async () => {
        const q = input.value;
        const timer = setTimeout(() => (out.innerHTML = `<p class="hint">${esc(W["search.loading.label"])}</p><ul class="rows skeleton">${"<li></li>".repeat(5)}</ul>`), 300);
        let data;
        try {
            data = await loadSearch();
        } catch {
            clearTimeout(timer);
            searchData = undefined;
            out.innerHTML = `<p>${esc(W["search.error.body"])}</p><button type="button" class="btn" data-retry>${esc(W["action.retry"])}</button>`;
            return;
        }
        clearTimeout(timer);
        out.classList.remove("fresh");
        void out.offsetWidth;
        out.classList.add("fresh");
        if (!q.trim()) {
            const list = sortCountries(data, LANG, region).slice(0, 5);
            out.innerHTML = `<ul class="rows">${list.map(rowHtml).join("")}</ul><p><a href="${BASE}/${LANG}/countries/">${fill(W["search.list.all"], { count: num(data.length) })}</a></p>`;
            return;
        }
        const hits = search(data, q, LANG);
        if (!hits.length) {
            out.innerHTML = `<p>${fill(W["search.empty.body"], { q: esc(q) })}</p><button type="button" class="btn" data-clear>${esc(W["search.empty.action"])}</button>`;
            return;
        }
        const shown = showAll ? hits : hits.slice(0, 8);
        out.innerHTML = `<p class="count">${fill(W[`search.results.count.${plural(hits.length)}`], { n: num(hits.length) })}</p><ul class="rows">${shown.map(rowHtml).join("")}</ul>${hits.length > shown.length ? `<button type="button" class="link" data-more>${fill(W["search.results.more"], { n: num(hits.length) })}</button>` : ""}<p class="fine">${fill(W["search.results.source"], {})}</p>`;
    };
    input.addEventListener("input", () => { showAll = false; draw(); });
    input.addEventListener("focus", draw, { once: true });
    box.addEventListener("click", (e) => {
        const chip = e.target.closest("[data-chip]");
        if (chip) { input.value = chip.dataset.chip; showAll = false; draw(); }
        if (e.target.closest("[data-more]")) { showAll = true; draw(); }
        if (e.target.closest("[data-clear]")) { input.value = ""; input.focus(); draw(); }
        if (e.target.closest("[data-retry]")) draw();
    });
    if (input.value) draw();
}

// ---------- countries index filter ----------
const filter = $("[data-filter]");
if (filter) {
    const input = $("#f", filter);
    const rows = $$("li[data-iso]");
    input.addEventListener("input", async () => {
        const q = input.value.trim();
        if (!q) return rows.forEach((r) => (r.hidden = false)), $$("main section").forEach((s) => (s.hidden = false));
        let data;
        try { data = await loadSearch(); } catch { return; }
        const keep = new Set(search(data, q, LANG).map((c) => c.iso2));
        rows.forEach((r) => (r.hidden = !keep.has(r.dataset.iso)));
        $$("main section").forEach((s) => { const lis = $$("li[data-iso]", s); if (lis.length) s.hidden = lis.every((l) => l.hidden); });
    });
}

// ---------- phone tester ----------
const tryForm = $("[data-try]");
if (tryForm) {
    const W = JSON.parse($("template", tryForm).innerHTML);
    const out = $("#tel-out", tryForm);
    const input = $("#tel", tryForm);
    let all;
    tryForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!input.value.trim()) { out.innerHTML = `<p class="error">${esc(W["country.try.empty"])}</p>`; input.focus(); return; }
        try { all ??= await fetch(`${BASE}/data/modules/phone.json`).then((r) => r.json()).then((p) => fetch(`${BASE}/data/modules/core.json`).then((r) => r.json()).then((core) => p.map((x, i) => ({ ...x, name_ar: core[i].name_ar, name_en: core[i].name_en })))); }
        catch { out.innerHTML = `<p class="error">${esc(W["country.try.error"])}</p>`; return; }
        const here = all.find((c) => c.iso2 === tryForm.dataset.try);
        const p = parsePhone(input.value, here, all);
        const name = (iso) => { const c = all.find((x) => x.iso2 === iso); return esc(LANG === "ar" ? c.name_ar : c.name_en); };
        if (!p) { out.innerHTML = `<p class="error">${esc(W["country.try.empty"])}</p>`; return; }
        const plan = all.find((c) => c.iso2 === p.iso2).phone.find((x) => x.calling_code === p.calling_code);
        let verdict;
        if (p.iso2 !== here.iso2) verdict = fill(W["country.try.other"], { country: `<a href="${BASE}/${LANG}/countries/${p.iso2.toLowerCase()}/">${name(p.iso2)}</a>`, here: name(here.iso2) });
        else if (!p.valid) verdict = plan.lengths.includes(p.national.length) ? fill(W["country.try.bad-pattern"], { country: name(p.iso2) }) : fill(W["country.try.bad-length"], { n: num(p.national.length), lengths: plan.lengths.join(", ") });
        else if (!plan.mobile_distinguishable) verdict = fill(W["country.try.valid-indistinct"], { country: name(p.iso2) });
        else verdict = fill(W[p.mobile ? "country.try.valid-mobile" : "country.try.valid-fixed"], { country: name(p.iso2) });
        out.innerHTML = `<p class="${p.valid ? "ok" : "error"}">${verdict}</p><dl><div><dt>${esc(W["country.try.e164"])}</dt><dd><bdi dir="ltr">${esc(p.e164)}</bdi></dd></div><div><dt>${esc(W["country.try.national"])}</dt><dd><bdi dir="ltr">${esc(formatNational(p.national, plan))}</bdi></dd></div></dl><p class="fine">${esc(W["country.try.from"])} <code dir="ltr">parsePhone()</code></p>`;
    });
}

// ---------- file builder ----------
const form = $("[data-builder]");
if (form) {
    const W = words("b-words");
    const sizes = words("b-sizes");
    const MODS = $$('input[name="m"]', form).map((i) => i.value);
    const state = () => {
        const fd = new FormData(form);
        const picked = fd.getAll("m");
        return { b: fd.get("b"), mods: picked.length ? picked : MODS, all: !picked.length || picked.length === MODS.length, subs: fd.get("s"), fmt: fd.get("f") };
    };
    // A selection that equals a published file is served as that file; anything else is merged here.
    const shipped = (s) => {
        if (s.subs === "only") return s.fmt === "json" ? `subdivisions${s.b}.json` : `csv/subdivisions${s.b}.csv`;
        if (s.subs === "inside") return null;
        if (s.all) return s.fmt === "json" ? `worldref${s.b}.json` : `csv/worldref${s.b}.csv`;
        if (s.mods.length === 1 && s.fmt === "json") return `modules/${s.mods[0]}${s.b}.json`;
        return null;
    };
    const sizeLine = (bytes) => fill(bytes > 1e6 ? W["build.size.mb"] : W["build.size"], { kb: num(Math.round(bytes / 1024)), mb: (bytes / 1048576).toFixed(1), bytes: num(bytes) });
    const cache = {};
    const get = (f) => (cache[f] ??= fetch(`${BASE}/data/${f}`).then((r) => { if (!r.ok) throw new Error(f); return f.endsWith(".json") ? r.json() : r.text(); }));
    const flatten = (rec, prefix = "", out = {}) => {
        for (const [k, v] of Object.entries(rec)) {
            if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, `${prefix}${k}.`, out);
            else out[prefix + k] = Array.isArray(v) ? (v.length && typeof v[0] === "object" ? JSON.stringify(v) : v.join("|")) : v;
        }
        return out;
    };
    const toCsv = (rows) => {
        const flat = rows.map((r) => flatten(r));
        const cols = Object.keys(flat[0] ?? {});
        const cell = (v) => (v == null ? "" : /[",\n|]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
        return "﻿" + [cols.join(","), ...flat.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n") + "\n";
    };
    async function make(s) {
        const file = shipped(s);
        if (file) return { name: file.split("/").pop(), blob: await (await fetch(`${BASE}/data/${file}`)).blob() };
        const parts = await Promise.all(s.mods.map((m) => get(`modules/${m}${s.b}.json`)));
        let rows = parts[0].map((r, i) => Object.assign({}, ...parts.map((p) => p[i])));
        if (s.subs === "inside") {
            const subs = await get(`subdivisions${s.b}.json`);
            rows = rows.map((r) => ({ ...r, subdivisions: subs.filter((x) => x.iso2 === r.iso2) }));
        }
        const name = `worldref-${s.mods.join("-")}${s.subs === "inside" ? "-subdivisions" : ""}${s.b}.${s.fmt}`;
        const body = s.fmt === "json" ? `[\n${rows.map((r) => JSON.stringify(r)).join(",\n")}\n]\n` : toCsv(rows);
        return { name, blob: new Blob([body], { type: s.fmt === "json" ? "application/json" : "text/csv" }) };
    }
    async function update() {
        const s = state();
        $("[data-mod-status]", form).innerHTML = s.all ? `${esc(W["build.modules.all"])}. ${esc(W["build.modules.hint"])}` : fill(W["build.modules.some"], { n: s.mods.length, list: s.mods.map((m) => esc(W[`module.${m}`])).join("، ") });
        const file = shipped(s);
        const est = file ? sizes[file] : s.mods.reduce((a, m) => a + (sizes[`modules/${m}${s.b}.json`] ?? 0), 0) + (s.subs === "inside" ? sizes[`subdivisions${s.b}.json`] : 0);
        $("[data-size]", form).innerHTML = `${sizeLine(est)}${file ? ` <span class="tag">${esc(W["build.shipped.tag"])}</span>` : ""}`;
        try {
            const { blob } = await make(s);
            const text = await blob.text();
            const lines = text.replace(/^﻿/, "").split("\n");
            $("[data-preview]", form).textContent = lines.slice(0, 6).map((l) => (l.length > 160 ? l.slice(0, 157) + "..." : l)).join("\n");
            const rows = s.fmt === "csv" ? lines.filter(Boolean).length - 1 : (text.match(/\n\{/g) || []).length;
            $("[data-preview-end]", form).innerHTML = fill(W["build.preview.end"], { rows: fill(W["build.rows"], { n: num(rows) }) });
            $("[data-size]", form).innerHTML = `${sizeLine(blob.size)}${file ? ` <span class="tag">${esc(W["build.shipped.tag"])}</span>` : ""}`;
        } catch (e) {
            $("[data-preview-end]", form).innerHTML = fill(W["build.error"], { file: esc(e.message) });
        }
    }
    form.addEventListener("change", update);
    $("[data-mod-clear]", form).addEventListener("click", () => { $$('input[name="m"]', form).forEach((i) => (i.checked = false)); update(); });
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const status = $("[data-status]", form);
        try {
            const { name, blob } = await make(state());
            const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: name });
            a.click();
            URL.revokeObjectURL(a.href);
            status.innerHTML = fill(W["build.success"], { file: name });
        } catch (err) {
            status.innerHTML = fill(W["build.error"], { file: esc(err.message) });
        }
    });
    update();
}

export { normalize };
