<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$baseAdminOrdersQuery = \App\Models\Order::query();
$baseAdminVtsQuery = \App\Models\VirtualTransaction::query();

$allOrdersForCounts = (clone $baseAdminOrdersQuery)->withoutEagerLoads()->get(['kode_pesanan', 'status'])->map(function($o) {
    return ['id' => $o->kode_pesanan, 'status' => $o->status];
});

$allVtsForCounts = (clone $baseAdminVtsQuery)->withoutEagerLoads()->get(['id', 'invoice_number', 'va_number', 'status'])->map(function($vt) {
    $statusMap = [
        'Pending' => 'menunggu_pembayaran',
        'Belum Bayar' => 'menunggu_pembayaran',
        'Lunas' => 'diproses',
        'Dikirim' => 'dikirim',
        'Selesai' => 'selesai',
        'Dibatalkan' => 'dibatalkan'
    ];
    return [
        'id' => $vt->invoice_number ?? $vt->va_number ?? 'VT-' . $vt->id,
        'status' => $statusMap[$vt->status] ?? strtolower($vt->status)
    ];
});

$mergedCounts = $allOrdersForCounts->concat($allVtsForCounts)->unique('id');

$orderCounts = [
    'all' => $mergedCounts->count(),
    'menunggu_pembayaran' => $mergedCounts->where('status', 'menunggu_pembayaran')->count(),
    'diproses' => $mergedCounts->where('status', 'diproses')->count(),
    'dikirim' => $mergedCounts->where('status', 'dikirim')->count(),
    'selesai' => $mergedCounts->where('status', 'selesai')->count(),
    'dibatalkan' => $mergedCounts->where('status', 'dibatalkan')->count(),
];

print_r($orderCounts);
