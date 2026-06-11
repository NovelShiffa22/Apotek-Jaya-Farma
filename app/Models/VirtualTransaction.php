<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VirtualTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'va_number',
        'payment_method',
        'total_amount',
        'status',
        'snap_token',
        'items',
    ];

    protected $casts = [
        'items' => 'array',
    ];
}
