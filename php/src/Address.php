<?php

declare(strict_types=1);

namespace WorldRef;

final class Address
{
    /**
     * @param list<string> $required_fields Field keys the postal service requires (name, organization, street, sublocality, city, region, postal_code, sorting_code).
     */
    public function __construct(
        public readonly ?string $postal_code_format,
        public readonly ?string $postal_code_regex,
        public readonly ?string $postal_code_example,
        public readonly ?string $address_format,
        public readonly ?string $region_label_ar,
        public readonly ?string $region_label_en,
        public readonly ?string $locality_label_ar = null,
        public readonly ?string $locality_label_en = null,
        public readonly ?string $sublocality_label_ar = null,
        public readonly ?string $sublocality_label_en = null,
        public readonly ?string $postal_code_label_ar = null,
        public readonly ?string $postal_code_label_en = null,
        public readonly array $required_fields = [],
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
            $r['locality_label_ar'] ?? null,
            $r['locality_label_en'] ?? null,
            $r['sublocality_label_ar'] ?? null,
            $r['sublocality_label_en'] ?? null,
            $r['postal_code_label_ar'] ?? null,
            $r['postal_code_label_en'] ?? null,
            $r['required_fields'] ?? [],
        );
    }
}
