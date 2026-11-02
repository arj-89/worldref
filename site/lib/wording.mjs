// Reads the approved WORDING.md tables (key | Arabic | English | note) into one dictionary.
import { readFileSync, readdirSync } from "node:fs";

const FLOWS = new URL("../../docs/design/flows/", import.meta.url).pathname;

export function loadWording() {
    const dict = {};
    for (const flow of readdirSync(FLOWS)) {
        let md;
        try {
            md = readFileSync(`${FLOWS}${flow}/WORDING.md`, "utf8");
        } catch {
            continue;
        }
        for (const line of md.split("\n")) {
            if (!line.startsWith("| ") || line.startsWith("| key") || line.startsWith("| ---")) continue;
            const cells = line.split("|").slice(1, -1).map((c) => c.trim());
            if (cells.length < 3) continue;
            const [key, ar, en] = cells;
            if (key && !dict[key]) dict[key] = { ar, en };
        }
    }
    return dict;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export { esc };

/** Wording markdown to HTML: `code` becomes isolated code, **bold** strong, {var} replaced (values are escaped). */
export function render(text, vars = {}) {
    let out = esc(text).replace(/\{(\w[\w-]*)\}/g, (m, k) => (k in vars ? `<bdi>${vars[k]}</bdi>` : m));
    out = out.replace(/`([^`]+)`/g, '<code dir="ltr"><bdi>$1</bdi></code>');
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return out;
}

/** Western digits with thousands separators, in both languages. */
export const num = (n) => (n == null ? "" : Number(n).toLocaleString("en-US"));

/** Arabic number agreement for the plural keys: one, two, few (3 to 10), many (11+). */
export const pluralKey = (base, n, lang) => {
    if (lang === "en") return n === 1 ? `${base}.one` : `${base}.many`;
    return n === 1 ? `${base}.one` : n === 2 ? `${base}.two` : n <= 10 ? `${base}.few` : `${base}.many`;
};
