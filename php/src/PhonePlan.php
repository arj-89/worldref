<?php

declare(strict_types=1);

namespace WorldRef;

final class PhonePlan
{
    /**
     * @param list<int> $lengths
     * @param list<int> $mobile_lengths
     * @param list<string> $mobile_prefixes
     */
    public function __construct(
        public readonly string $calling_code,
        public readonly ?string $leading_digits,
        public readonly bool $primary,
        public readonly ?string $trunk_prefix,
        public readonly ?string $pattern,
        public readonly array $lengths,
        public readonly ?string $mobile_pattern,
        public readonly array $mobile_lengths,
        public readonly array $mobile_prefixes,
        public readonly bool $mobile_distinguishable,
        public readonly ?string $mobile_example,
        public readonly ?string $mobile_format,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            $r['calling_code'],
            $r['leading_digits'] ?? null,
            $r['primary'],
            $r['trunk_prefix'] ?? null,
            $r['pattern'] ?? null,
            $r['lengths'] ?? [],
            $r['mobile_pattern'] ?? null,
            $r['mobile_lengths'] ?? [],
            $r['mobile_prefixes'] ?? [],
            $r['mobile_distinguishable'],
            $r['mobile_example'] ?? null,
            $r['mobile_format'] ?? null,
        );
    }
}
