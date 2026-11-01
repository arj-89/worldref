using System.Collections.Concurrent;
using System.Text.RegularExpressions;

namespace WorldRef;

/// <summary>Search, sorting and phone parsing over the dataset.</summary>
public static class Lookup
{
    static readonly ConcurrentDictionary<string, Regex> Cache = new();

    static bool FullMatch(string? pattern, string s) =>
        !string.IsNullOrEmpty(pattern) && Cache.GetOrAdd($"^(?:{pattern})$", p => new Regex(p, RegexOptions.CultureInvariant)).IsMatch(s);

    static bool PrefixMatch(string pattern, string s) =>
        Cache.GetOrAdd($"^(?:{pattern})", p => new Regex(p, RegexOptions.CultureInvariant)).IsMatch(s);

    static readonly Regex DialShape = new("^(\\+|00)?[0-9]{1,4}$", RegexOptions.CultureInvariant);
    static readonly Regex DialPrefix = new("^(\\+|00)", RegexOptions.CultureInvariant);

    static string SortKey(Country c, Lang lang) => lang == Lang.Ar ? c.SortAr : c.SortEn;

    /// <summary>
    /// Countries matching a query, best first. Matches names and aliases in both languages, ISO codes,
    /// and dial codes with or without "+" or "00".
    /// </summary>
    public static List<Country> Search(IEnumerable<Country> countries, string query, Lang lang = Lang.En)
    {
        var q = Text.Normalize(query);
        if (q.Length == 0) return [];
        var digits = Regex.Replace(Text.WesternDigits(query), @"[\s()-]", "");
        var dial = DialShape.IsMatch(digits) ? DialPrefix.Replace(digits, "") : null;
        var upper = query.Trim().ToUpperInvariant();
        var scored = new List<(Country c, double score)>();

        double Rank(string name, int place)
        {
            if (name == q) return 50 - place;
            if (name.StartsWith(q, StringComparison.Ordinal)) return 40 - place;
            if (name.Split(' ').Any(w => w.StartsWith(q, StringComparison.Ordinal))) return 30 - place;
            if (q.Length >= 3 && name.Contains(q, StringComparison.Ordinal)) return 10 - place;
            return 0;
        }

        foreach (var c in countries)
        {
            var own = Text.Normalize(lang == Lang.Ar ? c.NameAr : c.NameEn);
            var other = Text.Normalize(lang == Lang.Ar ? c.NameEn : c.NameAr);
            var score = Math.Max(Rank(own, 0), Rank(other, 1));
            foreach (var a in c.AliasesAr.Concat(c.AliasesEn)) score = Math.Max(score, Rank(Text.Normalize(a), 2));
            if (upper == c.Iso2 || upper == c.Iso3) score = Math.Max(score, 49.5);
            if (dial != null)
            {
                var codes = c.Phone.Select(p => (cc: p.CallingCode[1..], p.Primary)).ToList();
                if (codes.Any(p => p.cc == dial)) score = Math.Max(score, codes.Any(p => p.cc == dial && p.Primary) ? 46 : 45);
                else if (codes.Any(p => p.cc.StartsWith(dial, StringComparison.Ordinal))) score = Math.Max(score, 5);
            }
            if (score > 0) scored.Add((c, score));
        }
        return scored.OrderByDescending(s => s.score)
            .ThenBy(s => SortKey(s.c, lang), StringComparer.Ordinal)
            .Select(s => s.c).ToList();
    }

    /// <summary>Alphabetical in the UI language (ordinal order), with the user's country (if given) first. Returns a new list.</summary>
    public static List<Country> SortCountries(IEnumerable<Country> countries, Lang lang = Lang.En, string? first = null)
    {
        var pin = first?.ToUpperInvariant();
        var list = countries.ToList();
        list.Sort((a, b) => a.Iso2 == pin ? (b.Iso2 == pin ? 0 : -1) : b.Iso2 == pin ? 1 : string.CompareOrdinal(SortKey(a, lang), SortKey(b, lang)));
        return list;
    }

    record Candidate(string Iso2, PhonePlan Plan, string Rest);

    /// <summary>
    /// Reads what a user typed into a phone field. <paramref name="country"/> is the one picked in the field; numbers
    /// typed with "+" or "00" are matched against <paramref name="all"/> (or the country alone if not given).
    /// </summary>
    public static ParsedPhone? ParsePhone(string input, Country country, IEnumerable<Country>? all = null)
    {
        var s = Regex.Replace(Text.WesternDigits(input), @"[^0-9+]", "");
        if (s.Length == 0) return null;
        var plans = new List<Candidate>();
        if (s.StartsWith('+') || s.StartsWith("00", StringComparison.Ordinal))
        {
            s = DialPrefix.Replace(s, "");
            foreach (var c in all ?? [country])
                foreach (var plan in c.Phone)
                {
                    var cc = plan.CallingCode[1..];
                    if (!s.StartsWith(cc, StringComparison.Ordinal)) continue;
                    var rest = s[cc.Length..];
                    if (!string.IsNullOrEmpty(plan.LeadingDigits) && !PrefixMatch(plan.LeadingDigits, rest)) continue;
                    plans.Add(new Candidate(c.Iso2, plan, rest));
                }
            // Shared codes: picked country first, then leading-digit match, mobile fit, secondary plan fit, main country.
            int Weight(Candidate p) =>
                (p.Iso2 == country.Iso2 ? 16 : 0) +
                (!string.IsNullOrEmpty(p.Plan.LeadingDigits) ? 8 : 0) +
                (FullMatch(p.Plan.MobilePattern, p.Rest) ? 4 : 0) +
                (!p.Plan.Primary && FullMatch(p.Plan.Pattern, p.Rest) ? 2 : 0) +
                (p.Plan.Primary ? 1 : 0);
            plans = plans.OrderByDescending(Weight).ToList();
        }
        else
        {
            foreach (var plan in country.Phone)
            {
                var trunk = plan.TrunkPrefix;
                var rest = !string.IsNullOrEmpty(trunk) && s.StartsWith(trunk, StringComparison.Ordinal) && !FullMatch(plan.Pattern, s) ? s[trunk.Length..] : s;
                plans.Add(new Candidate(country.Iso2, plan, rest));
            }
        }
        if (plans.Count == 0) return null;
        var pick = plans.FirstOrDefault(p => FullMatch(p.Plan.Pattern, p.Rest)) ?? plans[0];
        return new ParsedPhone(
            pick.Plan.CallingCode + pick.Rest,
            pick.Iso2,
            pick.Plan.CallingCode,
            pick.Rest,
            FullMatch(pick.Plan.Pattern, pick.Rest),
            FullMatch(pick.Plan.MobilePattern, pick.Rest));
    }

    /// <summary>True when the input is a valid mobile number for the country.</summary>
    public static bool IsValidMobile(string input, Country country, IEnumerable<Country>? all = null)
    {
        var p = ParsePhone(input, country, all);
        return p is { Valid: true, Mobile: true } && (all == null || p.Iso2 == country.Iso2);
    }

    /// <summary>Groups national digits with the plan's mobile_format mask; returns the digits as-is when the mask does not fit.</summary>
    public static string FormatNational(string national, PhonePlan plan)
    {
        var mask = plan.MobileFormat;
        if (mask == null || mask.Count(c => c == '#') != national.Length) return national;
        var i = 0;
        return string.Concat(mask.Select(c => c == '#' ? national[i++] : c));
    }
}
