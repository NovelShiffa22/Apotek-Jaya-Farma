<?php
DB::enableQueryLog();
$orderSearch = 'farida';
$ordersQuery = \App\Models\Order::query();

$ordersQuery->where(function($q) use ($orderSearch) {
    $q->whereHas('user', function($uq) use ($orderSearch) {
        $uq->where('name', 'like', "%{$orderSearch}%")
           ->orWhere('email', 'like', "%{$orderSearch}%")
           ->orWhere('phone', 'like', "%{$orderSearch}%");
    })->orWhere('kode_pesanan', 'like', "%{$orderSearch}%")
      ->orWhereHas('prescription', function($pq) use ($orderSearch) {
          $pq->where('kode_resep', 'like', "%{$orderSearch}%");
      })
      ->orWhereHas('shippingMethod', function($sq) use ($orderSearch) {
          $sq->where('nama_metode', 'like', "%{$orderSearch}%");
      })
      ->orWhereHas('statusHistories', function($hq) use ($orderSearch) {
          $hq->whereHas('changedByUser', function($cuq) use ($orderSearch) {
              $cuq->where('name', 'like', "%{$orderSearch}%");
          });
      });
});

try {
    $ordersQuery->get();
    echo "OrdersQuery OK!\n";
} catch (\Exception $e) {
    echo "OrdersQuery Error: " . $e->getMessage() . "\n";
}

$vtsQuery = \App\Models\VirtualTransaction::query();
$vtsQuery->where(function($q) use ($orderSearch) {
    $q->whereHas('user', function($uq) use ($orderSearch) {
        $uq->where('name', 'like', "%{$orderSearch}%")
           ->orWhere('email', 'like', "%{$orderSearch}%")
           ->orWhere('phone', 'like', "%{$orderSearch}%");
    })->orWhere('va_number', 'like', "%{$orderSearch}%")
      ->orWhere('invoice_number', 'like', "%{$orderSearch}%")
      ->orWhereHas('prescription', function($pq) use ($orderSearch) {
          $pq->where('kode_resep', 'like', "%{$orderSearch}%");
      })
      ->orWhere('shipping_method', 'like', "%{$orderSearch}%")
      ->orWhereHas('pharmacist', function($pq) use ($orderSearch) {
          $pq->where('name', 'like', "%{$orderSearch}%");
      });
});

try {
    $vtsQuery->get();
    echo "VtsQuery OK!\n";
} catch (\Exception $e) {
    echo "VtsQuery Error: " . $e->getMessage() . "\n";
}
