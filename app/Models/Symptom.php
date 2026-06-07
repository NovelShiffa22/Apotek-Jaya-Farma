<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Symptom extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    /**
     * Relasi Many-to-Many ke tabel products melalui tabel pivot product_symptoms.
     * Sebuah gejala bisa diatasi oleh banyak produk obat.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_symptoms')
                    ->withPivot('bobot_relevansi')
                    ->withTimestamps();
    }
}
