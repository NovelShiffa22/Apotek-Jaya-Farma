<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $p = \App\Models\Product::select('products.*')
        ->selectRaw('(SELECT COALESCE(SUM(order_items.kuantitas), 0) FROM order_items JOIN orders ON orders.id = order_items.order_id WHERE order_items.product_id = products.id AND orders.status IN ("diproses", "disiapkan", "dikirim", "selesai")) as total_sold')
        ->orderBy('total_sold', 'desc')
        ->take(6)
        ->get();
    echo "SUCCESS\n";
    print_r($p->pluck('total_sold', 'id')->toArray());
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
