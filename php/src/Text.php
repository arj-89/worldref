<?php

declare(strict_types=1);

namespace WorldRef;

/** Text folding shared by search and sorting. */
final class Text
{
    private const LETTERS = ['أ' => 'ا', 'إ' => 'ا', 'آ' => 'ا', 'ٱ' => 'ا', 'ة' => 'ه', 'ى' => 'ي', 'ؤ' => 'و', 'ئ' => 'ي'];

    /** Arabic-Indic and Persian digits to Western (0-9). Nothing else changes. */
    public static function westernDigits(string $text): string
    {
        return preg_replace_callback(
            '/[\x{0660}-\x{0669}\x{06F0}-\x{06F9}]/u',
            static fn (array $m): string => (string) (mb_ord($m[0], 'UTF-8') & 0xF),
            $text,
        ) ?? $text;
    }

    /** Folds a name or a query for matching: case, accents, Arabic letter variants, tashkeel, tatweel, "ال", punctuation. */
    public static function normalize(string $text): string
    {
        $s = self::westernDigits($text);
        $s = \Normalizer::normalize($s, \Normalizer::FORM_D) ?: $s;
        $s = preg_replace('/[\x{0300}-\x{036F}]/u', '', $s);
        $s = mb_strtolower($s, 'UTF-8');
        $s = preg_replace('/[\x{064B}-\x{065F}\x{0670}\x{0640}]/u', '', $s);
        $s = strtr($s, self::LETTERS);
        $s = preg_replace('/[^\p{L}\p{N}]+/u', ' ', $s);
        $words = explode(' ', trim($s, ' '));
        foreach ($words as &$w) {
            if (str_starts_with($w, 'ال') && mb_strlen($w, 'UTF-8') > 3) {
                $w = mb_substr($w, 2, null, 'UTF-8');
            }
        }
        return implode(' ', $words);
    }
}
