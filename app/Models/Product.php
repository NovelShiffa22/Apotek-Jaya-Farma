<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    /**
     * Relasi Many-to-One ke tabel categories.
     * Sebuah produk dimiliki oleh satu kategori.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relasi Many-to-Many ke tabel symptoms melalui tabel pivot product_symptoms.
     * Sebuah produk bisa meredakan banyak gejala, disertai bobot_relevansi kecocokannya.
     */
    public function symptoms()
    {
        return $this->belongsToMany(Symptom::class, 'product_symptoms')
                    ->withPivot('bobot_relevansi')
                    ->withTimestamps();
    }

    public static function attachSoldCounts($products)
    {
        $productIds = $products->pluck('id')->toArray();
        if (empty($productIds)) {
            return $products;
        }

        $orderItemsSold = \Illuminate\Support\Facades\DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'dibatalkan')
            ->whereIn('order_items.product_id', $productIds)
            ->groupBy('order_items.product_id')
            ->select('order_items.product_id', \Illuminate\Support\Facades\DB::raw('SUM(order_items.kuantitas) as total_sold'))
            ->pluck('total_sold', 'product_id')
            ->toArray();

        $virtualTransactions = \App\Models\VirtualTransaction::whereNotIn('status', ['Pending', 'Dibatalkan', 'Belum Bayar'])->get();
        $virtualSold = [];
        foreach ($virtualTransactions as $vt) {
            if (is_array($vt->items)) {
                foreach ($vt->items as $item) {
                    $productId = $item['id'] ?? $item['product_id'] ?? null;
                    $qty = $item['quantity'] ?? $item['kuantitas'] ?? 1;
                    if ($productId && in_array($productId, $productIds)) {
                        if (!isset($virtualSold[$productId])) {
                            $virtualSold[$productId] = 0;
                        }
                        $virtualSold[$productId] += $qty;
                    }
                }
            }
        }

        foreach ($products as $product) {
            $sold1 = $orderItemsSold[$product->id] ?? 0;
            $sold2 = $virtualSold[$product->id] ?? 0;
            $product->terjual = (int)($sold1 + $sold2);
        }

        return $products;
    }
}
