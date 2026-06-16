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
        Schema::table('virtual_transactions', function (Blueprint $table) {
            $table->string('bank_name')->nullable()->after('va_number');
            $table->string('va_number')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('virtual_transactions', function (Blueprint $table) {
            $table->dropColumn('bank_name');
            $table->string('va_number')->nullable(false)->change();
        });
    }
};
