<?php

declare(strict_types=1);

namespace WorldRef;

final class Address
{
    public function __construct(
        public readonly ?string $postal_code_format,
        public readonly ?string $postal_code_regex,
        public readonly ?string $postal_code_example,
        public readonly ?string $address_format,
        public readonly ?string $region_label_ar,
        public readonly ?string $region_label_en,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            $r['postal_code_format'] ?? null,
            $r['postal_code_regex'] ?? null,
            $r['postal_code_example'] ?? null,
            $r['address_format'] ?? null,
            $r['region_label_ar'] ?? null,
            $r['region_label_en'] ?? null,
        );
    }
}
