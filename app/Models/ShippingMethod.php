<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_metode',
        'tipe',
        'biaya',
        'estimasi_waktu',
        'is_active',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
