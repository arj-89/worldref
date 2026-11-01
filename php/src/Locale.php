<?php

declare(strict_types=1);

namespace WorldRef;

final class Locale
{
    /**
     * @param list<Language> $languages
     * @param list<string> $weekend
     * @param list<string> $calendars
     */
    public function __construct(
        public readonly array $languages,
        public readonly string $week_start,
        public readonly array $weekend,
        public readonly array $calendars,
        public readonly string $measurement,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            array_map(Language::fromArray(...), $r['languages']),
            $r['week_start'],
            $r['weekend'] ?? [],
            $r['calendars'] ?? [],
            $r['measurement'],
        );
    }
}
