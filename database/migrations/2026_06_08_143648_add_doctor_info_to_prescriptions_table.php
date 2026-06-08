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
            $table->string('doctor_name')->nullable();
            $table->string('doctor_poli')->nullable();
            $table->string('doctor_ppk')->nullable();
            $table->text('doctor_alamat')->nullable();
            $table->decimal('total_biaya', 12, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prescriptions', function (Blueprint $table) {
            $table->dropColumn(['doctor_name', 'doctor_poli', 'doctor_ppk', 'doctor_alamat', 'total_biaya']);
        });
    }
};
