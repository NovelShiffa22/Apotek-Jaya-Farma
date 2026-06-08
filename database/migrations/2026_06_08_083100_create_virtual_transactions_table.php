<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('virtual_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('va_number');
            $table->string('payment_method');
            $table->decimal('total_amount', 15, 2);
            $table->string('status')->default('Pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('virtual_transactions');
    }
};
