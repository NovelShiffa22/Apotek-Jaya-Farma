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
        Schema::table('product_stock_histories', function (Blueprint $table) {
            $table->string('supplier')->nullable()->after('quantity');
            $table->integer('buy_price')->nullable()->after('supplier');
        });
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE product_stock_histories MODIFY type VARCHAR(255) NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_stock_histories', function (Blueprint $table) {
            $table->dropColumn('supplier');
            $table->dropColumn('buy_price');
        });
    }
};
