<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$products = \DB::table('products')->orderBy('id')->get();
foreach ($products as $p) {
    echo "ID: {$p->id} | Name: {$p->nama_obat} | Gambar: {$p->gambar}\n";
}
