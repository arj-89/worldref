<?php

declare(strict_types=1);

namespace WorldRef;

final class ParsedPhone
{
    /**
     * @param string $e164 International format, e.g. +966512345678. Store it together with `iso2`.
     */
    public function __construct(
        public readonly string $e164,
        public readonly string $iso2,
        public readonly string $calling_code,
        public readonly string $national,
        public readonly bool $valid,
        public readonly bool $mobile,
    ) {
    }
}
