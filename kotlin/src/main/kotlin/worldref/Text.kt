package worldref

private val DIGITS = Regex("[٠-٩۰-۹]")
private val ACCENTS = Regex("[̀-ͯ]")
private val MARKS = Regex("[ً-ٰٟـ]")
private val NON_WORD = Regex("[^\\p{L}\\p{N}]+")
private val LETTERS = mapOf(
    'أ' to 'ا', 'إ' to 'ا', 'آ' to 'ا', 'ٱ' to 'ا',
    'ة' to 'ه', 'ى' to 'ي', 'ؤ' to 'و', 'ئ' to 'ي',
)

/** Arabic-Indic and Persian digits to Western (0-9). Nothing else changes. */
fun westernDigits(text: String): String = DIGITS.replace(text) { (it.value[0].code and 0xf).toString() }

/** Folds a name or a query for matching: case, accents, Arabic letter variants, tashkeel, tatweel, "al" prefix, punctuation. */
fun normalize(text: String): String {
    val folded = java.text.Normalizer.normalize(westernDigits(text), java.text.Normalizer.Form.NFD)
    val s = MARKS.replace(ACCENTS.replace(folded, "").lowercase(java.util.Locale.ROOT), "")
        .map { LETTERS[it] ?: it }.joinToString("")
    return NON_WORD.replace(s, " ").trim().split(" ")
        .joinToString(" ") { if (it.startsWith("ال") && it.length > 3) it.substring(2) else it }
}
