import 'dart:convert';
import 'dart:io';

import 'package:test/test.dart';
import 'package:worldref/worldref.dart';

void main() {
  final v = jsonDecode(File('../tests/vectors.json').readAsStringSync())
      as Map<String, dynamic>;
  Lang lang(String s) => s == 'ar' ? Lang.ar : Lang.en;

  test('dataset loads', () {
    expect(countries.length, 242);
    expect(byIso2('sa')!.nameEn, 'Saudi Arabia');
    expect(byIso2('zz'), isNull);
    expect(subdivisions, isNotEmpty);
    expect(subdivisionsOf('ad').every((s) => s.iso2 == 'AD'), isTrue);
    expect(subdivisionsOf('ad'), isNotEmpty);
  });

  test('westernDigits', () {
    for (final c in v['westernDigits'] as List) {
      expect(westernDigits(c[0] as String), c[1], reason: c[0] as String);
    }
  });

  test('normalize', () {
    for (final c in v['normalize'] as List) {
      expect(normalize(c[0] as String), c[1], reason: c[0] as String);
    }
  });

  test('search', () {
    for (final c in v['search'] as List) {
      final hits =
          search(countries, c['query'] as String, lang(c['lang'] as String));
      if (c.containsKey('count'))
        expect(hits.length, c['count'], reason: c['query'] as String);
      if (c['first'] != null) {
        expect(hits.isEmpty ? null : hits.first.iso2, c['first'],
            reason: c['query'] as String);
      }
    }
  });

  test('sort', () {
    for (final c in v['sort'] as List) {
      final head = c['head'] as List;
      final got = sortCountries(
              countries, lang(c['lang'] as String), c['first'] as String?)
          .take(head.length)
          .map((x) => x.iso2)
          .toList();
      expect(got, head, reason: '${c['lang']} ${c['first']}');
    }
  });

  test('phone', () {
    for (final c in v['phone'] as List) {
      final p = parsePhone(
          c['input'] as String, byIso2(c['country'] as String)!, countries);
      expect(p, isNotNull, reason: c['input'] as String);
      expect([
        p!.e164,
        p.iso2,
        p.valid,
        p.mobile
      ], [
        c['e164'],
        c['iso2'],
        c['valid'],
        c['mobile']
      ], reason: c['input'] as String);
    }
  });

  test('absent entities', () {
    for (final a in v['absent'] as List) {
      expect(countries.any((c) => c.iso2 == a || c.iso3 == a), isFalse);
      final n = normalize(a as String);
      expect(
          search(countries, a).where(
              (c) => normalize(c.nameEn) == n || normalize(c.nameAr) == n),
          isEmpty);
    }
  });

  test('helpers', () {
    final sa = byIso2('SA')!;
    expect(isValidMobile('0501234567', sa), isTrue);
    expect(isValidMobile('0112345678', sa), isFalse);
    final plan = sa.phone.first;
    expect(formatNational('501234567', plan), isNotEmpty);
    expect(formatNational('1', plan), '1');
  });
}
