<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$p11 = \App\Models\Product::find(11);
$p13 = \App\Models\Product::find(13);

echo "ID 11: " . ($p11 ? $p11->nama_obat : "NOT FOUND") . "\n";
echo "ID 13: " . ($p13 ? $p13->nama_obat : "NOT FOUND") . "\n";
