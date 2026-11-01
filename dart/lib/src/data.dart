import 'dart:convert';

import 'data.g.dart';
import 'models.dart';

List<Country>? _countries;
Map<String, Country>? _byIso2;
List<Subdivision>? _subdivisions;
Map<String, List<Subdivision>>? _subsByCountry;

/// All countries and territories, parsed on first use.
List<Country> get countries =>
    _countries ??= List.unmodifiable((jsonDecode(countriesJson) as List)
        .map((e) => Country.fromJson(e as Map<String, dynamic>)));

/// The country with this ISO 3166-1 alpha-2 code (case-insensitive), or null.
Country? byIso2(String iso2) =>
    (_byIso2 ??= {for (final c in countries) c.iso2: c})[iso2.toUpperCase()];

/// All ISO 3166-2 subdivisions, parsed on first use.
List<Subdivision> get subdivisions =>
    _subdivisions ??= List.unmodifiable((jsonDecode(subdivisionsJson) as List)
        .map((e) => Subdivision.fromJson(e as Map<String, dynamic>)));

/// Subdivisions of one country (case-insensitive ISO 3166-1 alpha-2 code); empty when it has none.
List<Subdivision> subdivisionsOf(String iso2) {
  final map = _subsByCountry ??= () {
    final m = <String, List<Subdivision>>{};
    for (final s in subdivisions) {
      (m[s.iso2] ??= []).add(s);
    }
    return m;
  }();
  return map[iso2.toUpperCase()] ?? const [];
}
