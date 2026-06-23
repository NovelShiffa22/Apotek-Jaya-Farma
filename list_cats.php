<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$cats = \App\Models\Category::all();
foreach ($cats as $c) {
    echo "ID: {$c->id} | Name: {$c->nama_kategori} | Slug: {$c->slug}\n";
}
