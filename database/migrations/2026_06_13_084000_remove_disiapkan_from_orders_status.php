<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Hapus status 'disiapkan' dari enum orders dan order_status_histories.
     * Pesanan yang sebelumnya berstatus 'disiapkan' akan diubah ke 'diproses'.
     */
    public function up(): void
    {
        // 1. Migrasi data: pindahkan status 'disiapkan' → 'diproses'
        DB::table('orders')
            ->where('status', 'disiapkan')
            ->update(['status' => 'diproses']);

        DB::table('order_status_histories')
            ->where('status_sebelum', 'disiapkan')
            ->update(['status_sebelum' => 'diproses']);

        DB::table('order_status_histories')
            ->where('status_sesudah', 'disiapkan')
            ->update(['status_sesudah' => 'diproses']);

        // 2. Ubah definisi enum pada tabel orders
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('menunggu_pembayaran','diproses','dikirim','selesai','dibatalkan') DEFAULT 'menunggu_pembayaran'");

        // 3. Ubah definisi enum pada tabel order_status_histories
        DB::statement("ALTER TABLE order_status_histories MODIFY COLUMN status_sebelum ENUM('menunggu_pembayaran','diproses','dikirim','selesai','dibatalkan') NULL");
        DB::statement("ALTER TABLE order_status_histories MODIFY COLUMN status_sesudah ENUM('menunggu_pembayaran','diproses','dikirim','selesai','dibatalkan') NOT NULL");
    }

    /**
     * Kembalikan enum dengan 'disiapkan' jika rollback.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('menunggu_pembayaran','diproses','disiapkan','dikirim','selesai','dibatalkan') DEFAULT 'menunggu_pembayaran'");
        DB::statement("ALTER TABLE order_status_histories MODIFY COLUMN status_sebelum ENUM('menunggu_pembayaran','diproses','disiapkan','dikirim','selesai','dibatalkan') NULL");
        DB::statement("ALTER TABLE order_status_histories MODIFY COLUMN status_sesudah ENUM('menunggu_pembayaran','diproses','disiapkan','dikirim','selesai','dibatalkan') NOT NULL");
    }
};
