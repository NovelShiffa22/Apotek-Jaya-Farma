<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('prescription_items', function (Blueprint $table) {
            $table->foreignId('product_id')->nullable()->change();
            $table->string('product_name')->nullable();
            $table->boolean('is_racikan')->default(false);
            $table->integer('kuantitas_resep')->default(0);
            $table->integer('kuantitas_ambil')->default(0);
            $table->string('satuan')->nullable();
            $table->string('signa')->nullable();
            $table->decimal('harga_satuan', 12, 2)->default(0);
            $table->decimal('subtotal', 12, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prescription_items', function (Blueprint $table) {
            $table->foreignId('product_id')->nullable(false)->change();
            $table->dropColumn([
                'product_name',
                'is_racikan',
                'kuantitas_resep',
                'kuantitas_ambil',
                'satuan',
                'signa',
                'harga_satuan',
                'subtotal'
            ]);
        });
    }
};
