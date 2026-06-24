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
        // 1. Get or create the main target category "Suplemen & Vitamin"
        $targetCategory = Illuminate\Support\Facades\DB::table('categories')
            ->where('nama_kategori', 'Suplemen & Vitamin')
            ->orWhere('slug', 'suplemen-vitamin')
            ->first();

        if (!$targetCategory) {
            $targetId = Illuminate\Support\Facades\DB::table('categories')->insertGetId([
                'nama_kategori' => 'Suplemen & Vitamin',
                'slug' => 'suplemen-vitamin',
                'deskripsi' => 'Kumpulan vitamin dan suplemen untuk menjaga daya tahan tubuh.',
                'ikon' => 'fa-apple-alt',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $targetId = $targetCategory->id;
            
            // Ensure the name is exactly "Suplemen & Vitamin" and slug is "suplemen-vitamin"
            Illuminate\Support\Facades\DB::table('categories')
                ->where('id', $targetId)
                ->update([
                    'nama_kategori' => 'Suplemen & Vitamin',
                    'slug' => 'suplemen-vitamin',
                ]);
        }

        // 2. Identify duplicates to merge: "Vitamin & Suplement" or "Vitamin & Suplemen"
        $duplicateCategories = Illuminate\Support\Facades\DB::table('categories')
            ->whereIn('nama_kategori', ['Vitamin & Suplement', 'Vitamin & Suplemen', 'Vitamin dan Suplemen'])
            ->orWhereIn('slug', ['vitamin-suplement', 'vitamin-suplemen'])
            ->get();

        foreach ($duplicateCategories as $duplicate) {
            if ($duplicate->id == $targetId) {
                continue;
            }

            // Move products to the target category
            Illuminate\Support\Facades\DB::table('products')
                ->where('category_id', $duplicate->id)
                ->update(['category_id' => $targetId]);

            // Delete the duplicate category
            Illuminate\Support\Facades\DB::table('categories')
                ->where('id', $duplicate->id)
                ->delete();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op or we can restore if necessary, but this is a normalization migration.
    }
};
