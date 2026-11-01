package worldref

import kotlinx.serialization.json.Json

private val json = Json { ignoreUnknownKeys = true }

private fun resource(name: String): String =
    (object {}.javaClass.getResourceAsStream("/worldref/$name") ?: error("missing resource $name"))
        .use { it.readBytes().toString(Charsets.UTF_8) }

/** All 242 countries and territories, in data order (by ISO 3166-1 alpha-2 code). */
val countries: List<Country> by lazy { json.decodeFromString<List<Country>>(resource("worldref.json")) }

/** All subdivisions of all countries. */
val subdivisions: List<Subdivision> by lazy { json.decodeFromString<List<Subdivision>>(resource("subdivisions.json")) }

private val byIso2: Map<String, Country> by lazy { countries.associateBy { it.iso2 } }

/** Country by ISO alpha-2 code (case-insensitive), or null. */
fun byIso2(iso2: String): Country? = byIso2[iso2.uppercase(java.util.Locale.ROOT)]

/** Subdivisions of one country, by ISO alpha-2 code (case-insensitive). */
fun subdivisionsOf(iso2: String): List<Subdivision> =
    subdivisions.filter { it.iso2 == iso2.uppercase(java.util.Locale.ROOT) }
