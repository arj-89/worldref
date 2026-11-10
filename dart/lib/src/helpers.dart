import 'models.dart';
import 'text.dart';

/// UI language for search and sorting.
enum Lang { ar, en }

final Map<String, RegExp> _cache = {};

bool _fullMatch(String? pattern, String s) {
  if (pattern == null || pattern.isEmpty) return false;
  return _cache
      .putIfAbsent('f$pattern', () => RegExp('^(?:$pattern)\$'))
      .hasMatch(s);
}

bool _prefixMatch(String pattern, String s) =>
    _cache.putIfAbsent('p$pattern', () => RegExp('^(?:$pattern)')).hasMatch(s);

final RegExp _dialShape = RegExp(r'^(\+|00)?\d{1,4}$');
final RegExp _dialPrefix = RegExp(r'^(\+|00)');
final RegExp _dialJunk = RegExp(r'[\s()-]');
final RegExp _notPhone = RegExp(r'[^\d+]');
final RegExp _allDigits = RegExp(r'^\d+$');
final RegExp _addressToken = RegExp('%([A-Z])');

String _compact(String s) => s.replaceAll(' ', '');

int _cmp(String a, String b) => a.compareTo(b);

/// Countries matching a query, best first. Matches names and aliases in both languages (ignoring "ال", tashkeel,
/// hamza forms, case, accents, spaces and punctuation), ISO codes, and dial codes with or without "+" or "00".
/// When nothing matches, a second pass forgives small typos ("Kuwiat"): 1 edit for 4 to 7 letters, 2 from 8.
List<Country> search(Iterable<Country> countries, String query,
    [Lang lang = Lang.en]) {
  final q = normalize(query);
  if (q.isEmpty) return [];
  final qc = _compact(q);
  final digits = westernDigits(query).replaceAll(_dialJunk, '');
  final dial =
      _dialShape.hasMatch(digits) ? digits.replaceFirst(_dialPrefix, '') : null;
  final upper = query.trim().toUpperCase();
  final scored = <({Country c, double score, int i})>[];
  var i = 0;
  for (final c in countries) {
    final index = i++;
    final own = normalize(lang == Lang.ar ? c.nameAr : c.nameEn);
    final other = normalize(lang == Lang.ar ? c.nameEn : c.nameAr);
    // Tiers: exact (50s), name starts with the query (40s), a word starts with it (30s), contains it (10s).
    // Within a tier: the UI-language name, then the other language, then aliases.
    double rank(String name, int place) {
      final nc = _compact(name);
      if (name == q || nc == qc) return 50.0 - place;
      if (name.startsWith(q) || (qc.length >= 3 && nc.startsWith(qc))) {
        return 40.0 - place;
      }
      if (name.split(' ').any((w) => w.startsWith(q))) return 30.0 - place;
      if (q.length >= 3 && name.contains(q)) return 10.0 - place;
      return 0;
    }

    var score = rank(own, 0) > rank(other, 1) ? rank(own, 0) : rank(other, 1);
    for (final a in [...c.aliasesAr, ...c.aliasesEn]) {
      final r = rank(normalize(a), 2);
      if (r > score) score = r;
    }
    if (upper == c.iso2 || upper == c.iso3) score = score > 49.5 ? score : 49.5;
    if (dial != null) {
      final codes = c.phone
          .map((p) => (cc: p.callingCode.substring(1), primary: p.primary))
          .toList();
      if (codes.any((p) => p.cc == dial)) {
        final s = codes.any((p) => p.cc == dial && p.primary) ? 46.0 : 45.0;
        score = score > s ? score : s;
      } else if (codes.any((p) => p.cc.startsWith(dial))) {
        score = score > 5 ? score : 5;
      }
    }
    if (score != 0) scored.add((c: c, score: score, i: index));
  }
  if (scored.isEmpty && qc.length >= 4 && !_allDigits.hasMatch(qc)) {
    // Typo pass: edit distance between the query and whole names, spaces ignored.
    final limit = qc.length >= 8 ? 2 : 1;
    var i = 0;
    for (final c in countries) {
      final index = i++;
      final all = [
        lang == Lang.ar ? c.nameAr : c.nameEn,
        lang == Lang.ar ? c.nameEn : c.nameAr,
        ...c.aliasesAr,
        ...c.aliasesEn,
      ].map((n) => _compact(normalize(n))).toList();
      var best = 0.0;
      for (var k = 0; k < all.length; k++) {
        final d = editDistance(qc, all[k], limit);
        if (d <= limit) {
          final s = 3 - d - (k < 2 ? k : 2) * 0.25;
          if (s > best) best = s;
        }
      }
      if (best != 0) scored.add((c: c, score: best, i: index));
    }
  }
  String key(Country c) => lang == Lang.ar ? c.sortAr : c.sortEn;
  scored.sort((a, b) {
    final d = b.score.compareTo(a.score);
    if (d != 0) return d;
    final k = _cmp(key(a.c), key(b.c));
    return k != 0 ? k : a.i.compareTo(b.i);
  });
  return [for (final s in scored) s.c];
}

/// Optimal string alignment distance (insertions, deletions, substitutions, adjacent swaps), compared by
/// UTF-16 code unit. Returns limit + 1 as soon as the distance must exceed [limit].
int editDistance(String a, String b, int limit) {
  if ((a.length - b.length).abs() > limit) return limit + 1;
  var prev2 = <int>[];
  var prev = List<int>.generate(b.length + 1, (j) => j);
  for (var i = 1; i <= a.length; i++) {
    final cur = List<int>.filled(b.length + 1, 0)..[0] = i;
    var low = i;
    for (var j = 1; j <= b.length; j++) {
      final cost = a.codeUnitAt(i - 1) == b.codeUnitAt(j - 1) ? 0 : 1;
      var v = prev[j] + 1;
      if (cur[j - 1] + 1 < v) v = cur[j - 1] + 1;
      if (prev[j - 1] + cost < v) v = prev[j - 1] + cost;
      if (i > 1 &&
          j > 1 &&
          a.codeUnitAt(i - 1) == b.codeUnitAt(j - 2) &&
          a.codeUnitAt(i - 2) == b.codeUnitAt(j - 1) &&
          prev2[j - 2] + 1 < v) {
        v = prev2[j - 2] + 1;
      }
      cur[j] = v;
      if (v < low) low = v;
    }
    if (low > limit) return limit + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

/// Alphabetical in the UI language (code point order), with the user's country (if given) first. Returns a new list.
List<Country> sortCountries(Iterable<Country> countries,
    [Lang lang = Lang.en, String? first]) {
  final pin = first?.toUpperCase();
  final indexed = countries.toList().asMap().entries.toList();
  indexed.sort((a, b) {
    if (a.value.iso2 == pin && b.value.iso2 != pin) return -1;
    if (b.value.iso2 == pin && a.value.iso2 != pin) return 1;
    final k = lang == Lang.ar
        ? _cmp(a.value.sortAr, b.value.sortAr)
        : _cmp(a.value.sortEn, b.value.sortEn);
    return k != 0 ? k : a.key.compareTo(b.key);
  });
  return [for (final e in indexed) e.value];
}

/// Reads what a user typed into a phone field. [country] is the one picked in the field; numbers typed with
/// "+" or "00" are matched against [all] (or [country] alone if [all] is not given).
ParsedPhone? parsePhone(String input, Country country,
    [Iterable<Country>? all]) {
  var s = westernDigits(input).replaceAll(_notPhone, '');
  if (s.isEmpty) return null;
  final plans = <({String iso2, PhonePlan plan, String rest, int i})>[];
  if (s.startsWith('+') || s.startsWith('00')) {
    s = s.replaceFirst(_dialPrefix, '');
    for (final c in all ?? [country]) {
      for (final plan in c.phone) {
        final cc = plan.callingCode.substring(1);
        if (!s.startsWith(cc)) continue;
        final rest = s.substring(cc.length);
        if (plan.leadingDigits != null &&
            !_prefixMatch(plan.leadingDigits!, rest)) continue;
        plans.add((iso2: c.iso2, plan: plan, rest: rest, i: plans.length));
      }
    }
    // Shared codes (+1, +7, +44...): the picked country first, then a plan whose leading digits matched,
    // then one whose mobile pattern fits, then a secondary plan whose own pattern fits, then the main country.
    int weight(({String iso2, PhonePlan plan, String rest, int i}) p) =>
        (p.iso2 == country.iso2 ? 16 : 0) +
        (p.plan.leadingDigits != null ? 8 : 0) +
        (_fullMatch(p.plan.mobilePattern, p.rest) ? 4 : 0) +
        (!p.plan.primary && _fullMatch(p.plan.pattern, p.rest) ? 2 : 0) +
        (p.plan.primary ? 1 : 0);
    plans.sort((a, b) {
      final d = weight(b).compareTo(weight(a));
      return d != 0 ? d : a.i.compareTo(b.i);
    });
  } else {
    for (final plan in country.phone) {
      final t = plan.trunkPrefix;
      final rest = t != null && s.startsWith(t) && !_fullMatch(plan.pattern, s)
          ? s.substring(t.length)
          : s;
      plans.add((iso2: country.iso2, plan: plan, rest: rest, i: plans.length));
    }
  }
  if (plans.isEmpty) return null;
  final pick = plans.firstWhere((p) => _fullMatch(p.plan.pattern, p.rest),
      orElse: () => plans.first);
  return ParsedPhone(
    e164: '${pick.plan.callingCode}${pick.rest}',
    iso2: pick.iso2,
    callingCode: pick.plan.callingCode,
    national: pick.rest,
    valid: _fullMatch(pick.plan.pattern, pick.rest),
    mobile: _fullMatch(pick.plan.mobilePattern, pick.rest),
  );
}

/// True when the input is a valid mobile number for the country.
bool isValidMobile(String input, Country country, [Iterable<Country>? all]) {
  final p = parsePhone(input, country, all);
  return p != null &&
      p.valid &&
      p.mobile &&
      (all == null || p.iso2 == country.iso2);
}

/// Groups national digits with the plan's mobileFormat mask (5 123 4567 style); returns the digits as-is when the mask does not fit.
String formatNational(String national, PhonePlan plan) {
  final mask = plan.mobileFormat;
  if (mask == null || '#'.allMatches(mask).length != national.length)
    return national;
  var i = 0;
  return mask.replaceAllMapped('#', (_) => national[i++]);
}

const Map<String, String> _addressTokens = {
  'N': 'name',
  'O': 'organization',
  'A': 'street',
  'D': 'sublocality',
  'C': 'city',
  'S': 'region',
  'Z': 'postal_code',
  'X': 'sorting_code',
};

const Map<String, ({String ar, String en})> _fixedLabels = {
  'name': (ar: 'الاسم', en: 'Name'),
  'organization': (ar: 'المنشأة', en: 'Organization'),
  'street': (ar: 'العنوان', en: 'Street address'),
  'sorting_code': (ar: 'رمز الفرز', en: 'Sorting code'),
};

/// The address form of a country: its fields line by line, in the country's order, with labels in [lang] and
/// whether the postal service requires each one. Tokens the format uses beyond Google's nine are skipped.
List<List<AddressFormField>> addressForm(Country country,
    [Lang lang = Lang.en]) {
  final a = country.address;
  String? pick(String? ar, String? en) => lang == Lang.ar ? ar : en;
  String? cap(String? s) => s != null && s.isNotEmpty && lang == Lang.en
      ? s[0].toUpperCase() + s.substring(1)
      : s;
  String? labelOf(String f) {
    final fixed = _fixedLabels[f];
    if (fixed != null) return lang == Lang.ar ? fixed.ar : fixed.en;
    if (f == 'city') return pick(a.localityLabelAr, a.localityLabelEn);
    if (f == 'sublocality') {
      return pick(a.sublocalityLabelAr, a.sublocalityLabelEn);
    }
    if (f == 'region') return cap(pick(a.regionLabelAr, a.regionLabelEn));
    return pick(a.postalCodeLabelAr, a.postalCodeLabelEn);
  }

  final seen = <String>{};
  final lines = <List<AddressFormField>>[];
  for (final line in (a.addressFormat ?? '%N%n%O%n%A%n%C').split('%n')) {
    final fields = <AddressFormField>[];
    for (final m in _addressToken.allMatches(line)) {
      final field = _addressTokens[m[1]];
      if (field == null || !seen.add(field)) continue;
      fields.add(AddressFormField(
          field: field,
          label: labelOf(field),
          required: a.requiredFields.contains(field)));
    }
    if (fields.isNotEmpty) lines.add(List.unmodifiable(fields));
  }
  return List.unmodifiable(lines);
}
