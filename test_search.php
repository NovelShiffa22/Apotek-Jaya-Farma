<?php
$orderSearch = 'ambil di apotek';
$o = \App\Models\Order::with(['user', 'shippingMethod', 'statusHistories.changedByUser', 'prescription'])->where('kode_pesanan', 'INV-20260623-0001')->first();

if ($o) {
    echo "User name: " . $o->user->name . "\n";
    echo "User email: " . $o->user->email . "\n";
    echo "User phone: " . $o->user->phone . "\n";
    echo "Kode pesanan: " . $o->kode_pesanan . "\n";
    echo "Shipping method: " . ($o->shippingMethod ? $o->shippingMethod->nama_metode : 'none') . "\n";
    echo "Prescription: " . ($o->prescription ? $o->prescription->kode_resep : 'none') . "\n";
    foreach ($o->statusHistories as $sh) {
        echo "Status history changed by user: " . ($sh->changedByUser ? $sh->changedByUser->name : 'none') . "\n";
    }
} else {
    echo "INV-20260623-0001 not found\n";
}
