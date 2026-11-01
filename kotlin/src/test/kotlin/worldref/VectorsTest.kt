package worldref

import java.io.File
import kotlinx.serialization.json.*
import kotlin.test.*

class VectorsTest {
    private val v: JsonObject = Json.parseToJsonElement(File("../tests/vectors.json").readText()).jsonObject
    private fun rows(key: String) = v.getValue(key).jsonArray
    private fun lang(s: String) = if (s == "ar") Lang.AR else Lang.EN

    @Test
    fun westernDigitsVectors() {
        for (r in rows("westernDigits")) assertEquals(r.jsonArray[1].jsonPrimitive.content, westernDigits(r.jsonArray[0].jsonPrimitive.content))
    }

    @Test
    fun normalizeVectors() {
        for (r in rows("normalize")) assertEquals(r.jsonArray[1].jsonPrimitive.content, normalize(r.jsonArray[0].jsonPrimitive.content), r.jsonArray[0].jsonPrimitive.content)
    }

    @Test
    fun searchVectors() {
        for (r in rows("search")) {
            val c = r.jsonObject
            val q = c.getValue("query").jsonPrimitive.content
            val hits = search(countries, q, lang(c.getValue("lang").jsonPrimitive.content))
            c["count"]?.let { assertEquals(it.jsonPrimitive.int, hits.size, q) }
            c["first"]?.takeIf { it !is JsonNull }?.let { assertEquals(it.jsonPrimitive.content, hits.firstOrNull()?.iso2, q) }
        }
    }

    @Test
    fun sortVectors() {
        for (r in rows("sort")) {
            val c = r.jsonObject
            val head = c.getValue("head").jsonArray.map { it.jsonPrimitive.content }
            val first = c["first"]?.takeIf { it !is JsonNull }?.jsonPrimitive?.content
            val got = sortCountries(countries, lang(c.getValue("lang").jsonPrimitive.content), first).take(head.size).map { it.iso2 }
            assertEquals(head, got)
        }
    }

    @Test
    fun phoneVectors() {
        for (r in rows("phone")) {
            val c = r.jsonObject
            val input = c.getValue("input").jsonPrimitive.content
            val p = assertNotNull(parsePhone(input, assertNotNull(byIso2(c.getValue("country").jsonPrimitive.content)), countries), input)
            assertEquals(c.getValue("e164").jsonPrimitive.content, p.e164, input)
            assertEquals(c.getValue("iso2").jsonPrimitive.content, p.iso2, input)
            assertEquals(c.getValue("valid").jsonPrimitive.boolean, p.valid, input)
            assertEquals(c.getValue("mobile").jsonPrimitive.boolean, p.mobile, input)
        }
    }

    @Test
    fun absentEntityIsNotInTheData() {
        for (a in rows("absent").map { it.jsonPrimitive.content }) {
            assertNull(byIso2(a), a)
            assertTrue(countries.none { it.iso3 == a })
        }
    }

    @Test
    fun dataLoads() {
        assertEquals(242, countries.size)
        assertEquals("SA", byIso2("sa")?.iso2)
        assertTrue(subdivisions.isNotEmpty())
        assertTrue(subdivisionsOf("ad").all { it.iso2 == "AD" } && subdivisionsOf("AD").isNotEmpty())
        val sa = assertNotNull(byIso2("SA"))
        assertTrue(isValidMobile("0501234567", sa))
        assertEquals("50 123 4567", formatNational("501234567", sa.phone[0]))
    }
}
