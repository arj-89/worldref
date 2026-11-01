// Reduces a libphonenumber national-number regex to the digit prefixes it can start with.
// The patterns only use digits, \d, [..] classes, (?:..) groups, | and the quantifiers {n}, {n,m}, ?, *, +,
// so a small parser is enough; anything else throws, so a new construct upstream fails the build loudly.

function parse(src) {
    let i = 0;
    const alt = () => {
        const options = [seq()];
        while (src[i] === "|") {
            i++;
            options.push(seq());
        }
        return { t: "alt", options };
    };
    const seq = () => {
        const items = [];
        while (i < src.length && src[i] !== "|" && src[i] !== ")") items.push(quant(atom()));
        return { t: "seq", items };
    };
    const atom = () => {
        const c = src[i];
        if (c === "(") {
            if (src.startsWith("(?:", i)) i += 3;
            else i++;
            const node = alt();
            if (src[i++] !== ")") throw new Error(`unbalanced group in ${src}`);
            return node;
        }
        if (c === "[") {
            const end = src.indexOf("]", i);
            const body = src.slice(i + 1, end);
            i = end + 1;
            const set = new Set();
            for (let j = 0; j < body.length; j++) {
                if (body[j + 1] === "-") {
                    for (let d = Number(body[j]); d <= Number(body[j + 2]); d++) set.add(String(d));
                    j += 2;
                } else if (body.startsWith("\\d", j)) {
                    "0123456789".split("").forEach((d) => set.add(d));
                    j++;
                } else set.add(body[j]);
            }
            return { t: "set", chars: [...set] };
        }
        if (src.startsWith("\\d", i)) {
            i += 2;
            return { t: "set", chars: "0123456789".split("") };
        }
        if (/\d/.test(c)) {
            i++;
            return { t: "set", chars: [c] };
        }
        throw new Error(`unsupported regex construct "${c}" in ${src}`);
    };
    const quant = (node) => {
        const c = src[i];
        if (c === "?") return i++, { t: "rep", node, min: 0, max: 1 };
        if (c === "*") return i++, { t: "rep", node, min: 0, max: 20 };
        if (c === "+") return i++, { t: "rep", node, min: 1, max: 20 };
        if (c === "{") {
            const end = src.indexOf("}", i);
            const [a, b] = src.slice(i + 1, end).split(",");
            i = end + 1;
            return { t: "rep", node, min: Number(a), max: b === undefined ? Number(a) : b === "" ? 20 : Number(b) };
        }
        return node;
    };
    const tree = alt();
    if (i !== src.length) throw new Error(`trailing input in ${src}`);
    return tree;
}

// Strings of up to k characters: [text, done]. `done` means the match can end here (shorter than k).
function starts(node, k) {
    const key = (s, done) => `${done ? 1 : 0}${s}`;
    const join = (left, right) => {
        const out = new Map();
        for (const [s, done] of left.values()) {
            if (s.length === k || !done) out.set(key(s, done), [s, done]);
            if (s.length < k && done) for (const [r, rd] of right.values()) {
                const t = (s + r).slice(0, k);
                const d = rd && (s + r).length <= k;
                out.set(key(t, d), [t, d]);
            }
        }
        return out;
    };
    const unit = () => new Map([[key("", true), ["", true]]]);
    switch (node.t) {
        case "set":
            return new Map(node.chars.map((c) => [key(c, true), [c, true]]));
        case "seq":
            return node.items.reduce((acc, item) => join(acc, starts(item, k)), unit());
        case "alt": {
            const out = new Map();
            for (const o of node.options) for (const [kk, v] of starts(o, k)) out.set(kk, v);
            return out;
        }
        case "rep": {
            const one = starts(node.node, k);
            let acc = unit();
            const out = new Map();
            for (let n = 0; n <= Math.min(node.max, k); n++) {
                if (n >= node.min) for (const [kk, v] of acc) out.set(kk, v);
                acc = join(acc, one);
            }
            // Repetitions beyond k cannot add new k-prefixes; but if min > k, the loop above emitted nothing.
            if (node.min > k) for (const [kk, v] of acc) out.set(kk, v);
            return out;
        }
    }
}

/** The smallest set of leading-digit prefixes (at most `depth` digits) that covers exactly what the pattern allows. */
export function leadingPrefixes(pattern, depth = 3) {
    const tree = parse(pattern.replace(/\s+/g, ""));
    const full = new Set([...starts(tree, depth).values()].map(([s]) => s));
    const covered = (p) => {
        if (p.length === depth) return full.has(p);
        return "0123456789".split("").every((d) => covered(p + d));
    };
    const out = [];
    const walk = (p) => {
        if (p && covered(p)) return out.push(p);
        if (p.length === depth) return;
        for (const d of "0123456789") if ([...full].some((s) => s.startsWith(p + d))) walk(p + d);
    };
    walk("");
    return out;
}
