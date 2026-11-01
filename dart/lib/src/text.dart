import 'fold.dart';

final RegExp _digits = RegExp('[٠-٩۰-۹]');
final RegExp _marks = RegExp('[ً-ٰٟـ]');
final RegExp _nonWord = RegExp(r'[^\p{L}\p{N}]+', unicode: true);
final RegExp _arLetters = RegExp('[أإآٱةىؤئ]');
const Map<String, String> _letters = {
  'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ة': 'ه', 'ى': 'ي', 'ؤ': 'و',
  'ئ': 'ي', //
};

Map<int, String>? _fold;

Map<int, String> _foldTable() => _fold ??= {
      for (final p in foldPairs.split('|'))
        p.runes.first: String.fromCharCodes(p.runes.skip(1)),
    };

/// Arabic-Indic and Persian digits to Western (0-9). Nothing else changes.
String westernDigits(String text) => text.replaceAllMapped(
    _digits, (m) => (m[0]!.codeUnitAt(0) & 0xf).toString());

/// Folds a name or a query for matching: case, accents, Arabic letter variants, tashkeel, tatweel, "ال", punctuation.
String normalize(String text) {
  final table = _foldTable();
  final stripped = StringBuffer();
  for (final r in westernDigits(text).runes) {
    final f = table[r];
    if (f != null) {
      stripped.write(f);
    } else if (r < 0x300 || r > 0x36F) {
      stripped.writeCharCode(r);
    }
  }
  return stripped
      .toString()
      .toLowerCase()
      .replaceAll(_marks, '')
      .replaceAllMapped(_arLetters, (m) => _letters[m[0]]!)
      .replaceAll(_nonWord, ' ')
      .trim()
      .split(' ')
      .map((w) => w.startsWith('ال') && w.length > 3 ? w.substring(2) : w)
      .join(' ');
}
