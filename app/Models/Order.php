<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Melindungi field 'id' agar tidak bisa diisi sembarangan melalui mass-assignment, sisanya aman
    protected $guarded = ['id'];

    protected $casts = [
        'shipping_address' => 'array',
    ];

    /**
     * Relasi Many-to-Many ke tabel products melalui tabel pivot order_items.
     * Merekam detail setiap produk di dalam pesanan ini beserta metrik transaksinya.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_items')
                    ->withPivot(['kuantitas', 'harga_satuan', 'subtotal'])
                    ->withTimestamps();
    }

    /**
     * Relasi Many-to-One ke tabel users (Pemilik Pesanan).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi Many-to-One ke tabel addresses (Alamat Pengiriman).
     */
    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    /**
     * Relasi Many-to-One ke tabel shipping_methods (Metode Pengiriman).
     */
    public function shippingMethod()
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    /**
     * Relasi Many-to-One ke tabel prescriptions (Resep Dokter - jika ada).
     */
    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    /**
     * Relasi One-to-Many ke tabel order_status_histories.
     */
    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class)->latest();
    }
}
