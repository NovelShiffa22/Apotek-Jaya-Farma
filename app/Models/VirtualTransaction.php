<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VirtualTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'prescription_id',
        'pharmacist_id',
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function pharmacist()
    {
        return $this->belongsTo(User::class, 'pharmacist_id');
    }
}
