<?php
declare(strict_types=1);
$root = dirname(__DIR__);
$tools = require $root . '/config/tools.php';
$sitemap = file_get_contents($root . '/sitemap.xml');
if ($sitemap === false) {
    throw new RuntimeException('Cannot read sitemap.xml');
}
$static = ['about', 'contact', 'privacy', 'terms', 'disclaimer'];
$locations = [];
preg_match_all('~<loc>https://unicodefix\.com/([^<]*)</loc>~', $sitemap, $matches);
foreach ($matches[1] as $path) {
    $slug = trim($path, '/');
    $locations[$slug] = true;
}
$errors = [];
foreach ($tools as $slug => $tool) {
    if (($tool['status'] ?? '') === 'ready' && !isset($locations[$slug])) {
        $errors[] = "Ready tool missing from sitemap: {$slug}";
    }
    if (($tool['status'] ?? '') !== 'ready' && isset($locations[$slug])) {
        $errors[] = "Non-ready tool must not be indexed in sitemap: {$slug}";
    }
}
foreach ($static as $slug) {
    if (!isset($locations[$slug])) {
        $errors[] = "Information page missing from sitemap: {$slug}";
    }
}
foreach (array_keys($locations) as $slug) {
    if ($slug !== '' && !isset($tools[$slug]) && !in_array($slug, $static, true)) {
        $errors[] = "Unknown sitemap route: {$slug}";
    }
}
if ($errors) {
    fwrite(STDERR, implode(PHP_EOL, $errors) . PHP_EOL);
    exit(1);
}
echo 'Sitemap audit passed: all ready tools and information pages are listed; non-ready tools are excluded.' . PHP_EOL;
