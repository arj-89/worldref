<?php

declare(strict_types=1);

namespace WorldRef;

final class Subdivision
{
    public function __construct(
        public readonly string $iso2,
        public readonly string $code,
        public readonly ?string $name_ar,
        public readonly ?string $name_en,
        public readonly ?string $parent,
        public readonly ?string $type_ar = null,
        public readonly ?string $type_en = null,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            $r['iso2'],
            $r['code'],
            $r['name_ar'] ?? null,
            $r['name_en'] ?? null,
            $r['parent'] ?? null,
            $r['type_ar'] ?? null,
            $r['type_en'] ?? null,
        );
    }
}
