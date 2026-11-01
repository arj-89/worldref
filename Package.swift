// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "WorldRef",
    platforms: [.iOS(.v15), .macOS(.v12)],
    products: [.library(name: "WorldRef", targets: ["WorldRef"])],
    targets: [
        .target(
            name: "WorldRef",
            exclude: ["README.md"],
            resources: [.copy("Resources/worldref.json"), .copy("Resources/subdivisions.json")]
        ),
        .testTarget(name: "WorldRefTests", dependencies: ["WorldRef"]),
    ]
)
