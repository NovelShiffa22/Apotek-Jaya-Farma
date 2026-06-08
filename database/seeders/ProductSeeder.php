<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan ada setidaknya 1 kategori
        $category = Category::firstOrCreate(
            ['slug' => 'obat-umum'],
            [
                'nama_kategori' => 'Obat Umum',
                'deskripsi' => 'Kategori untuk obat-obatan umum sehari-hari.'
            ]
        );

        $products = [
            [
                'category_id' => $category->id,
                'nama_obat' => 'Paracetamol 500mg',
                'slug' => Str::slug('Paracetamol 500mg') . '-' . time(),
                'deskripsi' => 'Obat penurun panas dan pereda nyeri ringan hingga sedang.',
                'jenis_obat' => 'bebas',
                'indikasi' => 'Meredakan sakit kepala, sakit gigi, nyeri otot, dan menurunkan demam.',
                'aturan_pakai' => 'Dewasa: 1-2 tablet 3-4 kali sehari. Anak-anak: 1/2 tablet 3-4 kali sehari. Diminum sesudah makan.',
                'efek_samping' => 'Jarang terjadi. Penggunaan jangka panjang atau dosis besar dapat menyebabkan kerusakan hati.',
                'harga' => 15000,
                'stok' => 100,
                'stok_minimum' => 15,
                'is_active' => true,
            ],
            [
                'category_id' => $category->id,
                'nama_obat' => 'Amoxicillin 500mg',
                'slug' => Str::slug('Amoxicillin 500mg') . '-' . time(),
                'deskripsi' => 'Antibiotik spektrum luas untuk mengatasi berbagai infeksi bakteri.',
                'jenis_obat' => 'keras',
                'indikasi' => 'Infeksi saluran pernapasan, infeksi saluran kemih, infeksi kulit, dan infeksi gigi.',
                'aturan_pakai' => 'Dewasa: 1 kapsul 3 kali sehari (tiap 8 jam). Obat ini HARUS dihabiskan sesuai resep dokter.',
                'efek_samping' => 'Mual, muntah, diare, ruam kulit, atau reaksi alergi pada pasien sensitif penisilin.',
                'harga' => 35000,
                'stok' => 50,
                'stok_minimum' => 10,
                'is_active' => true,
            ],
            [
                'category_id' => $category->id,
                'nama_obat' => 'Vitamin C 1000mg',
                'slug' => Str::slug('Vitamin C 1000mg') . '-' . time(),
                'deskripsi' => 'Suplemen vitamin C dosis tinggi untuk menjaga sistem kekebalan tubuh.',
                'jenis_obat' => 'bebas',
                'indikasi' => 'Membantu memelihara daya tahan tubuh dan mempercepat masa pemulihan setelah sakit.',
                'aturan_pakai' => 'Dewasa: 1 tablet effervescent per hari, dilarutkan dalam segelas air matang.',
                'efek_samping' => 'Dosis tinggi secara terus-menerus dapat menyebabkan gangguan lambung (maag) atau pembentukan batu ginjal.',
                'harga' => 45000,
                'stok' => 200,
                'stok_minimum' => 20,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
