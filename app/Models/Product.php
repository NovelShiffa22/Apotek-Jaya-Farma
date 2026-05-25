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
}
