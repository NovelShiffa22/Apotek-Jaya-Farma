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
        Schema::table('prescriptions', function (Blueprint $table) {
            $table->string('nama_pasien')->nullable()->after('status_validasi');
            $table->string('nama_dokter')->nullable()->after('nama_pasien');
            $table->text('catatan')->nullable()->after('nama_dokter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prescriptions', function (Blueprint $table) {
            $table->dropColumn(['nama_pasien', 'nama_dokter', 'catatan']);
        });
    }
};
