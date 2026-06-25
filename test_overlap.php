<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$orderCount = \App\Models\Order::whereHas('prescription', function($q) {
    $q->where('kode_resep', 'RSP-20260409-0001');
})->count();

$vtCount = \App\Models\VirtualTransaction::whereHas('prescription', function($q) {
    $q->where('kode_resep', 'RSP-20260409-0001');
})->count();

echo "Orders: " . $orderCount . "\n";
echo "Virtual Transactions: " . $vtCount . "\n";
