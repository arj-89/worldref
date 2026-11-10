import com.vanniktech.maven.publish.JavadocJar
import com.vanniktech.maven.publish.KotlinJvm
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    kotlin("jvm") version "2.2.21"
    kotlin("plugin.serialization") version "2.2.21"
    id("com.vanniktech.maven.publish") version "0.37.0"
}

// Maven Central: io.github.arj-89:worldref. JitPack builds the same sources under com.github.arj-89.
val onJitPack = System.getenv("JITPACK") == "true"
group = if (onJitPack) "com.github.arj-89" else "io.github.arj-89"
version = "1.2.1"

repositories { mavenCentral() }

dependencies {
    api("org.jetbrains.kotlinx:kotlinx-serialization-json:1.9.0")
    testImplementation(kotlin("test"))
    testImplementation(platform("org.junit:junit-bom:5.11.4"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
}

kotlin {
    compilerOptions { jvmTarget.set(JvmTarget.JVM_11) }
}

tasks.withType<JavaCompile> { options.release.set(11) }

tasks.test { useJUnitPlatform() }

mavenPublishing {
    configure(KotlinJvm(javadocJar = JavadocJar.Empty(), sourcesJar = true))
    coordinates(group.toString(), "worldref", version.toString())
    publishToMavenCentral(automaticRelease = true)
    // Signed only where the key is set (the publish workflow); local and JitPack builds stay unsigned.
    if (providers.gradleProperty("signingInMemoryKey").isPresent) signAllPublications()
    pom {
        name.set("worldref")
        description.set("Every country and territory in Arabic and English: names, nationalities, dial codes and phone validation, currencies, capitals, time zones, address formats and subdivisions.")
        url.set("https://github.com/arj-89/worldref")
        licenses { license { name.set("MIT"); url.set("https://github.com/arj-89/worldref/blob/main/LICENSE") } }
        developers { developer { id.set("arj-89"); name.set("arj-89"); url.set("https://github.com/arj-89") } }
        scm {
            url.set("https://github.com/arj-89/worldref")
            connection.set("scm:git:https://github.com/arj-89/worldref.git")
            developerConnection.set("scm:git:ssh://git@github.com/arj-89/worldref.git")
        }
    }
}
