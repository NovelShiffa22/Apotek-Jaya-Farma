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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('kode_pesanan', 20)->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('address_id')->nullable()->constrained('addresses')->nullOnDelete();
            $table->foreignId('shipping_method_id')->constrained('shipping_methods')->restrictOnDelete();
            $table->foreignId('prescription_id')->nullable()->constrained('prescriptions')->nullOnDelete();
            $table->enum('status', ['menunggu_pembayaran', 'diproses', 'disiapkan', 'dikirim', 'selesai', 'dibatalkan'])->default('menunggu_pembayaran');
            $table->decimal('subtotal_produk', 12, 2);
            $table->decimal('biaya_pengiriman', 10, 2)->default(0);
            $table->decimal('biaya_layanan', 10, 2)->default(0);
            $table->decimal('total_biaya', 12, 2);
            $table->string('bukti_bayar', 255)->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
