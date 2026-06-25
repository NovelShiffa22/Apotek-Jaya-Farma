<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$orders = \App\Models\Order::whereHas('prescription', function($q) {
    $q->where('kode_resep', 'RSP-20260409-0001');
})->get();

$vts = \App\Models\VirtualTransaction::whereHas('prescription', function($q) {
    $q->where('kode_resep', 'RSP-20260409-0001');
})->get();

foreach ($orders as $order) {
    echo "Order kode_pesanan: " . $order->kode_pesanan . "\n";
}
foreach ($vts as $vt) {
    echo "VT invoice: " . $vt->invoice_number . " va: " . $vt->va_number . "\n";
}
