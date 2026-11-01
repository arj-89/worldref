using System.Globalization;
using System.Text;

namespace WorldRef;

/// <summary>Text folding shared by search and sorting.</summary>
public static class Text
{
    /// <summary>Arabic-Indic and Persian digits to Western (0-9). Nothing else changes.</summary>
    public static string WesternDigits(string text)
    {
        var sb = new StringBuilder(text.Length);
        foreach (var ch in text)
            sb.Append(ch is >= '٠' and <= '٩' ? (char)('0' + ch - '٠')
                    : ch is >= '۰' and <= '۹' ? (char)('0' + ch - '۰')
                    : ch);
        return sb.ToString();
    }

    static char Letter(char c) => c switch
    {
        'أ' or 'إ' or 'آ' or 'ٱ' => 'ا',
        'ة' => 'ه',
        'ى' => 'ي',
        'ؤ' => 'و',
        'ئ' => 'ي',
        _ => c,
    };

    /// <summary>Folds a name or a query for matching: case, accents, Arabic letter variants, tashkeel, tatweel, "ال", punctuation.</summary>
    public static string Normalize(string text)
    {
        var folded = WesternDigits(text).Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(folded.Length);
        var gap = false;
        foreach (var rune in folded.EnumerateRunes())
        {
            var v = rune.Value;
            if (v is >= 0x300 and <= 0x36F) continue;
            var lowered = Rune.ToLowerInvariant(rune);
            if (lowered.Value is >= 0x64B and <= 0x65F or 0x670 or 0x640) continue;
            var r = lowered.Value <= 0xFFFF ? new Rune(Letter((char)lowered.Value)) : lowered;
            var cat = Rune.GetUnicodeCategory(r);
            var keep = cat is UnicodeCategory.UppercaseLetter or UnicodeCategory.LowercaseLetter or UnicodeCategory.TitlecaseLetter
                or UnicodeCategory.ModifierLetter or UnicodeCategory.OtherLetter
                or UnicodeCategory.DecimalDigitNumber or UnicodeCategory.LetterNumber or UnicodeCategory.OtherNumber;
            if (keep)
            {
                if (gap && sb.Length > 0) sb.Append(' ');
                gap = false;
                sb.Append(r.ToString());
            }
            else gap = true;
        }
        var words = sb.ToString().Split(' ');
        for (var i = 0; i < words.Length; i++)
            if (words[i].StartsWith("ال", StringComparison.Ordinal) && words[i].Length > 3) words[i] = words[i][2..];
        return string.Join(' ', words);
    }
}
