<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('apotek_settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Seed default data
        $defaults = [
            ['key' => 'deskripsi', 'value' => 'Apotek Jaya Farma adalah unit usaha pelayanan kefarmasian dan produk kesehatan swasta yang telah berdiri sejak tahun 1971 di Kota Bandung.', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'alamat', 'value' => 'Jl. Malabar No. 50, Kecamatan Lengkong, Kota Bandung', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'jam_operasional', 'value' => '08.00 - 18.00 WIB (Buka setiap hari, kecuali hari libur)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'kontak', 'value' => '+62 813-1532-4311', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('apotek_settings')->insertOrIgnore($defaults);
    }

    public function down(): void
    {
        Schema::dropIfExists('apotek_settings');
    }
};
