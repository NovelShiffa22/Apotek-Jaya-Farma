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
            if (!Schema::hasColumn('product_stock_histories', 'supplier')) {
                $table->string('supplier')->nullable()->after('quantity');
            }
            if (!Schema::hasColumn('product_stock_histories', 'buy_price')) {
                $table->integer('buy_price')->nullable()->after('supplier');
            }
        });
        if (\Illuminate\Support\Facades\DB::connection()->getDriverName() !== 'sqlite') {
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE product_stock_histories MODIFY type VARCHAR(255) NOT NULL");
        }
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
