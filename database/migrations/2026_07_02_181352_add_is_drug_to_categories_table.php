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
        Schema::table('categories', function (Blueprint $table) {
            $table->boolean('is_drug')->default(false)->after('ikon');
        });

        // Update existing categories
        $drugCategories = [
            'Obat Batuk & Pilek', 
            'Analgesik & Antipiretik', 
            'Obat-Obatan', 
            'Obat Tradisional / Herbal', 
            'Hormon dan kontrasepsi', 
            'Nutrisi enteral dan parenteral', 
            'Kortikosteroid', 
            'Analgesik', 
            'Antipiretik', 
            'Antiemetik', 
            'Antiasma', 
            'Obat tetes mata', 
            'Antihistamin', 
            'Preparat dermatologi'
        ];

        \Illuminate\Support\Facades\DB::table('categories')
            ->whereIn('nama_kategori', $drugCategories)
            ->update(['is_drug' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('is_drug');
        });
    }
};
