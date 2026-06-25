<?php
$orderSearch = 'resep';
$ordersQuery = \App\Models\Order::query();

if ($orderSearch) {
    $lowerSearch = strtolower(trim($orderSearch));
    if ($lowerSearch === 'resep' || $lowerSearch === 'obat resep') {
        $ordersQuery->whereNotNull('prescription_id');
    }
}
echo "Orders: " . $ordersQuery->count() . "\n";
