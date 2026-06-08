<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PrescriptionItem extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
