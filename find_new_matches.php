<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$keywords = [
    'prothyra', 'paracetamol', 'imboost', 'hepa', 'kifamed', 'kursi roda',
    'marvee', 'molacort', 'celebon', 'wetkins', 'cussons', 'haemoven',
    'leukotape', 'nutribaby', 'cimantin', 'peepis', 'minosep', 'therasorb',
    'appeton', 'dettol', 'nutrimax', 'uricare'
];

foreach ($keywords as $kw) {
    echo "--- Matches for '$kw' ---\n";
    $products = \App\Models\Product::where('nama_obat', 'like', "%$kw%")->get(['id', 'nama_obat', 'gambar']);
    foreach ($products as $p) {
        echo "ID: {$p->id} | Name: {$p->nama_obat} | Gambar: {$p->gambar}\n";
    }
}
