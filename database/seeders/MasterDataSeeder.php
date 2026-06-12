<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        // 1. Seeding Data Categories
        DB::table('categories')->insertOrIgnore([
            [
                'nama_kategori' => 'Obat Batuk & Pilek',
                'slug' => Str::slug('Obat Batuk & Pilek'),
                'deskripsi' => 'Berbagai macam obat untuk mengatasi batuk kering, berdahak, dan gejala pilek/flu.',
                'ikon' => 'fa-pills',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nama_kategori' => 'Analgesik & Antipiretik',
                'slug' => Str::slug('Analgesik & Antipiretik'),
                'deskripsi' => 'Obat pereda nyeri dan penurun demam.',
                'ikon' => 'fa-temperature-low',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nama_kategori' => 'Suplemen & Vitamin',
                'slug' => Str::slug('Suplemen & Vitamin'),
                'deskripsi' => 'Kumpulan vitamin dan suplemen untuk menjaga daya tahan tubuh.',
                'ikon' => 'fa-apple-alt',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        // 2. Seeding Data Symptoms
        $symptoms = ['Demam', 'Batuk Kering', 'Flu', 'Pusing', 'Nyeri Otot', 'Lemas', 'Sesak Napas', 'Mual'];
        $symptomData = [];
        foreach ($symptoms as $symptom) {
            $symptomData[] = [
                'nama_gejala' => $symptom,
                'slug' => Str::slug($symptom),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('symptoms')->insertOrIgnore($symptomData);

        // 3. Seeding Data Products
        // (Produk dummy lama telah dihapus, beralih ke ProductSeeder)

        // 4. Seeding Data Relasi Medis (Product - Symptoms Pivot)
        // (Relasi dummy lama telah dihapus, beralih ke ProductSeeder)
    }
}
