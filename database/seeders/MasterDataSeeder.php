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
        DB::table('categories')->insert([
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
        $symptoms = ['Demam', 'Batuk Kering', 'Flu', 'Pusing', 'Nyeri Otot'];
        $symptomData = [];
        foreach ($symptoms as $symptom) {
            $symptomData[] = [
                'nama_gejala' => $symptom,
                'slug' => Str::slug($symptom),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('symptoms')->insert($symptomData);

        // 3. Seeding Data Products
        // Asumsi ID Kategori: 1 = Batuk/Pilek, 2 = Analgesik, 3 = Vitamin
        DB::table('products')->insert([
            [
                'category_id' => 2,
                'nama_obat' => 'Paracetamol 500mg',
                'slug' => Str::slug('Paracetamol 500mg'),
                'deskripsi' => 'Obat generik untuk menurunkan demam dan meredakan nyeri ringan hingga sedang.',
                'jenis_obat' => 'bebas',
                'indikasi' => 'Demam, sakit kepala, sakit gigi, dan nyeri ringan.',
                'aturan_pakai' => 'Dewasa: 1-2 kaplet, 3-4 kali sehari. Sesudah makan.',
                'efek_samping' => 'Penggunaan jangka panjang dan dosis besar dapat menyebabkan kerusakan hati.',
                'harga' => 5000.00,
                'stok' => 150,
                'stok_minimum' => 20,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => 2,
                'nama_obat' => 'Sanmol Tablet',
                'slug' => Str::slug('Sanmol Tablet'),
                'deskripsi' => 'Obat bermerek dengan kandungan Paracetamol untuk pereda nyeri dan penurun panas.',
                'jenis_obat' => 'bebas',
                'indikasi' => 'Meringankan rasa sakit pada keadaan sakit kepala, sakit gigi dan menurunkan demam.',
                'aturan_pakai' => 'Dewasa: 1 tablet, 3-4 kali sehari. Anak 6-12 tahun: 1/2 - 1 tablet, 3-4 kali sehari.',
                'efek_samping' => 'Reaksi hipersensitivitas.',
                'harga' => 12500.00,
                'stok' => 100,
                'stok_minimum' => 15,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => 1,
                'nama_obat' => 'Woods Peppermint Antitussive',
                'slug' => Str::slug('Woods Peppermint Antitussive'),
                'deskripsi' => 'Sirup obat batuk tidak berdahak (batuk kering) yang disertai alergi.',
                'jenis_obat' => 'terbatas',
                'indikasi' => 'Batuk tidak berdahak, batuk karena alergi.',
                'aturan_pakai' => 'Dewasa & anak >12 tahun: 10 ml, 3 kali sehari.',
                'efek_samping' => 'Mengantuk, pusing, mual.',
                'harga' => 28000.00,
                'stok' => 45,
                'stok_minimum' => 10,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => 3,
                'nama_obat' => 'Enervon-C Multivitamin',
                'slug' => Str::slug('Enervon C Multivitamin'),
                'deskripsi' => 'Suplemen multivitamin dengan kandungan Vitamin C dan Vitamin B Kompleks.',
                'jenis_obat' => 'bebas',
                'indikasi' => 'Membantu menjaga daya tahan tubuh, dan memulihkan kondisi setelah sakit.',
                'aturan_pakai' => '1 tablet sehari, diminum sesudah makan.',
                'efek_samping' => 'Gangguan lambung ringan jika diminum saat perut kosong.',
                'harga' => 45000.00,
                'stok' => 80,
                'stok_minimum' => 10,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => 2,
                'nama_obat' => 'Ibuprofen 400mg',
                'slug' => Str::slug('Ibuprofen 400mg'),
                'deskripsi' => 'Obat antiinflamasi nonsteroid (OAINS) untuk meredakan nyeri dan peradangan.',
                'jenis_obat' => 'keras',
                'indikasi' => 'Nyeri ringan sampai sedang, sakit gigi, nyeri pasca operasi.',
                'aturan_pakai' => 'Dewasa: 400 mg, 3-4 kali sehari. Harus dengan resep dokter atau apoteker.',
                'efek_samping' => 'Mual, muntah, nyeri lambung.',
                'harga' => 15000.00,
                'stok' => 50,
                'stok_minimum' => 10,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
