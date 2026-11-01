<?php

declare(strict_types=1);

// Plain runner for the shared vectors. Usage: php php/tests/run.php (from the repo root)

require __DIR__ . '/../src/Text.php';
spl_autoload_register(static function (string $class): void {
    $file = __DIR__ . '/../src/' . substr($class, strlen('WorldRef\\')) . '.php';
    if (str_starts_with($class, 'WorldRef\\') && is_file($file)) {
        require $file;
    }
});

use WorldRef\WorldRef;

$V = json_decode(file_get_contents(__DIR__ . '/../../tests/vectors.json'), true, 512, JSON_THROW_ON_ERROR);
$countries = WorldRef::countries();
$fails = [];
$total = 0;
$check = static function (bool $ok, string $msg) use (&$fails, &$total): void {
    $total++;
    if (!$ok) {
        $fails[] = $msg;
    }
};

foreach ($V['westernDigits'] as [$i, $o]) {
    $check(WorldRef::westernDigits($i) === $o, "westernDigits: $i");
}
foreach ($V['normalize'] as [$i, $o]) {
    $got = WorldRef::normalize($i);
    $check($got === $o, "normalize: '$i' => '$got', want '$o'");
}
foreach ($V['search'] as $c) {
    $hits = WorldRef::search($countries, $c['query'], $c['lang']);
    if (array_key_exists('count', $c)) {
        $check(count($hits) === $c['count'], "search count: {$c['query']} => " . count($hits) . ", want {$c['count']}");
    }
    if (!empty($c['first'])) {
        $got = $hits[0]->iso2 ?? null;
        $check($got === $c['first'], "search first: {$c['query']} => " . var_export($got, true) . ", want {$c['first']}");
    }
}
foreach ($V['sort'] as $c) {
    $head = array_map(static fn ($x) => $x->iso2, array_slice(WorldRef::sortCountries($countries, $c['lang'], $c['first']), 0, count($c['head'])));
    $check($head === $c['head'], "sort {$c['lang']} " . var_export($c['first'], true) . ': ' . implode(',', $head));
}
foreach ($V['phone'] as $c) {
    $p = WorldRef::parsePhone($c['input'], WorldRef::byIso2($c['country']), $countries);
    $ok = $p !== null && $p->e164 === $c['e164'] && $p->iso2 === $c['iso2'] && $p->valid === $c['valid'] && $p->mobile === $c['mobile'];
    $check($ok, "phone: {$c['input']} => " . ($p ? "{$p->e164} {$p->iso2}" : 'null'));
}
foreach ($V['absent'] as $w) {
    $check(WorldRef::byIso2($w) === null, "absent byIso2: $w");
    foreach (WorldRef::search($countries, $w) as $hit) {
        $check(!in_array($hit->iso2, ['IL'], true), "absent search: $w");
    }
}

// API sanity
$check(count($countries) === 242, 'country count');
$check(WorldRef::byIso2('sa')?->name_en === 'Saudi Arabia', 'byIso2 case-insensitive');
$check(count(WorldRef::subdivisions('SA')) > 0, 'subdivisions by country');
$check(count(WorldRef::subdivisions()) === 5012, 'subdivisions all');
$sa = WorldRef::byIso2('SA');
$check(WorldRef::isValidMobile('0501234567', $sa) === true, 'isValidMobile SA');
$check(WorldRef::formatNational('501234567', $sa->phone[0]) !== '', 'formatNational');

foreach ($fails as $f) {
    fwrite(STDERR, "FAIL $f\n");
}
printf("%d checks, %d failed\n", $total, count($fails));
exit($fails ? 1 : 0);
