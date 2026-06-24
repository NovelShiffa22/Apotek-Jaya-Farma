<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Product;

$products = Product::select('id', 'nama_obat', 'gambar')->get();
foreach ($products as $p) {
    echo "ID: {$p->id} | Name: {$p->nama_obat} | Gambar: " . ($p->gambar ?? 'NULL') . "\n";
}

