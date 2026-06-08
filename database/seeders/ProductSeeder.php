<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $now = now();

        $rawData = [
            ['PROTHYRA 5MG TAB@30', 'TAB', 2350, 'Obat-Obatan', 'Hormon progesteron sintetis untuk gangguan menstruasi.', ['Nyeri', 'Lemas']],
            ['PANADOL COLD & FLU', 'TAB', 15000, 'Obat Batuk & Pilek', 'Meredakan gejala hidung tersumbat, batuk, dan flu.', ['Flu', 'Batuk', 'Pilek', 'Demam']],
            ['PARACETAMOL 500MG', 'TAB', 5000, 'Analgesik & Antipiretik', 'Obat penurun panas dan pereda nyeri ringan.', ['Demam', 'Pusing', 'Nyeri']],
            ['IMBOOST FORCE', 'TAB', 75000, 'Suplemen & Vitamin', 'Suplemen daya tahan tubuh untuk mencegah sakit.', ['Lemas']],
            ['HEPA-MERZ GRANUL@10', 'SC', 57997, 'Obat-Obatan', 'Membantu menurunkan kadar amonia pada penyakit hati.', ['Mual']],
            ['KIFAMED KURSI RODA RACING (KFM-R)', 'UNT', 1599998, 'Alat Kesehatan', 'Kursi roda ringan untuk alat bantu jalan pasien.', []],
            ['MARVEE PRIME YOUTH ULTIMATE SERUM 20ML', 'BT', 222000, 'Kecantikan & Skincare', 'Serum wajah anti-aging untuk meremajakan kulit.', []],
            ['MOLACORT 0.75MG TAB@200 MOL', 'TAB', 277, 'Obat-Obatan', 'Kortikosteroid untuk meredakan peradangan dan alergi.', ['Alergi', 'Sesak Napas']],
            ['MEBO OINT 40GR', 'TUB', 144300, 'Obat-Obatan', 'Salep herbal untuk penyembuhan luka bakar dan ulkus.', ['Luka']],
            ['CELEBON ALOE COLLAGEN MASK', 'SC', 20812, 'Kecantikan & Skincare', 'Masker wajah kolagen aloe vera untuk melembapkan kulit.', []],
            ['WETKINS BABY WET WIPES@50 PINK', 'BH', 15944, 'Ibu & Anak', 'Tisu basah lembut khusus untuk kulit bayi.', []],
            ['CUSSON PREMIER B.FOAM 250 EXTR', 'BT', 7604, 'Perawatan Tubuh', 'Sabun mandi busa lembut untuk membersihkan kulit.', []],
            ['HAEMOVEN CR 10GR', 'TUB', 2876, 'Obat-Obatan', 'Krim untuk meredakan memar dan varises ringan.', ['Luka', 'Nyeri']],
            ['FORMULA PG XP PEACH 100GR', 'TUB', 5524, 'Perawatan Tubuh', 'Pasta gigi perlindungan ekstra rasa persik.', []],
            ['LEUKOTAPE K 5CMX5M SKIN', 'RLL', 390000, 'Alat Kesehatan', 'Plester kinesiologi elastis untuk dukungan otot.', ['Pegal', 'Nyeri Otot']],
            ['NUTRIBABY ROYAL PRONUTRA 1 400', 'DUS', 107430, 'Ibu & Anak', 'Susu formula bayi bernutrisi tinggi tahap 1.', []],
            ['CIMANTIN 10MG TAB@28', 'TAB', 36630, 'Obat-Obatan', 'Obat untuk terapi demensia Alzheimer ringan-sedang.', ['Pusing']],
            ['PEEPIS DISP URINE BAG FOR WOMEN @600 CC', 'PC', 17500, 'Alat Kesehatan', 'Kantong urin sekali pakai khusus wanita.', []],
            ['MINOSEP GARGLE 0.001 -BI', 'BT', 23310, 'Perawatan Tubuh', 'Obat kumur antiseptik untuk kebersihan mulut.', ['Batuk Kering', 'Batuk']],
            ['THERASORB C 10CM X 10CM', 'LBR', 92705, 'Alat Kesehatan', 'Pembalut luka serap tinggi untuk eksudat.', ['Luka']],
            ['APPETON 60+ 400GR VANILA', 'KLG', 347106, 'Ibu & Anak', 'Susu nutrisi untuk lansia 60 tahun ke atas.', ['Lemas']],
            ['DETTOL BS FRESH 70 GR', 'PC', 3885, 'Perawatan Tubuh', 'Sabun mandi antiseptik Dettol dengan kesegaran ekstra.', []],
            ['DEXTROMETHORPHAN SYR GIF ASK', 'BT', 2119, 'Obat Batuk & Pilek', 'Sirup penekan batuk kering (antitusif).', ['Batuk Kering', 'Batuk']],
            ['SIDO M TOLAK LINU MINT 15ML DUSSC @5', 'DUS', 15136, 'Obat Tradisional / Herbal', 'Herbal cair pereda pegal linu dan nyeri sendi rasa mint.', ['Pegal', 'Nyeri Otot']],
            ['ZZNUTRIMAX URICARE CAP@60', 'BT', 413726, 'Vitamin & Suplement', 'Suplemen untuk menjaga kesehatan ginjal dan saluran kemih.', []],
            ['CETIRIZINE 10 MG (DUS 30 TAB)', 'TAB', 305, 'Obat-Obatan', 'Antihistamin untuk meredakan gejala alergi, pilek, dan gatal.', ['Alergi', 'Pilek']],
        ];

        // 1. Prepare Categories
        $dbCategories = DB::table('categories')->get()->keyBy('nama_kategori')->toArray();
        $iconMap = [
            'Obat Batuk & Pilek' => 'fa-head-side-cough',
            'Analgesik & Antipiretik' => 'fa-thermometer-half',
            'Suplemen & Vitamin' => 'fa-apple-alt',
            'Obat-Obatan' => 'fa-pills',
            'Alat Kesehatan' => 'fa-stethoscope',
            'Kecantikan & Skincare' => 'fa-spa',
            'Ibu & Anak' => 'fa-baby',
            'Perawatan Tubuh' => 'fa-bath',
            'Obat Tradisional / Herbal' => 'fa-leaf',
            'Vitamin & Suplement' => 'fa-capsules',
        ];

        // 2. Prepare Images
        $imageMap = [
            'Obat Batuk & Pilek' => 'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=400',
            'Analgesik & Antipiretik' => 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=400',
            'Suplemen & Vitamin' => 'https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=400',
            'Obat-Obatan' => 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400',
            'Alat Kesehatan' => 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=400',
            'Kecantikan & Skincare' => 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400',
            'Ibu & Anak' => 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400',
            'Perawatan Tubuh' => 'https://images.unsplash.com/photo-1608248593842-8d76d4949397?q=80&w=400',
            'Obat Tradisional / Herbal' => 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=400',
            'Vitamin & Suplement' => 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=400',
        ];

        // 3. Prepare Symptoms
        $dbSymptoms = DB::table('symptoms')->get()->keyBy('nama_gejala')->toArray();

        // Tahan Foreign Key check untuk Truncate
        DB::statement('PRAGMA foreign_keys = OFF;');
        DB::table('product_symptoms')->truncate();
        DB::table('products')->truncate();
        DB::statement('PRAGMA foreign_keys = ON;');

        $productData = [];
        $pivotData = [];
        $productIdCounter = 1;

        foreach ($rawData as $row) {
            $catName = $row[3];
            // Tambahkan Kategori jika belum ada
            if (!isset($dbCategories[$catName])) {
                $newCatId = DB::table('categories')->insertGetId([
                    'nama_kategori' => $catName,
                    'slug' => Str::slug($catName),
                    'deskripsi' => "Kategori untuk produk $catName",
                    'ikon' => $iconMap[$catName] ?? 'fa-box',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $dbCategories[$catName] = (object)['id' => $newCatId];
            }

            $catId = $dbCategories[$catName]->id;
            
            // Siapkan Gejala (Symptoms)
            $symptomNames = $row[5];
            foreach ($symptomNames as $sym) {
                if (!isset($dbSymptoms[$sym])) {
                    $newSymId = DB::table('symptoms')->insertGetId([
                        'nama_gejala' => $sym,
                        'slug' => Str::slug($sym),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                    $dbSymptoms[$sym] = (object)['id' => $newSymId];
                }
                
                $pivotData[] = [
                    'product_id' => $productIdCounter,
                    'symptom_id' => $dbSymptoms[$sym]->id,
                    'bobot_relevansi' => 0.90,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            $isPrescriptionRequired = in_array($row[0], [
                'WEGOVY 1.7MG PEN@1',
                'HEPA-MERZ GRANUL@10',
                'MOLACORT 0.75MG TAB@200 MOL'
            ]);

            $productData[] = [
                'id' => $productIdCounter, // Explicit ID for pivot
                'category_id' => $catId,
                'nama_obat' => $row[0],
                'slug' => Str::slug($row[0]),
                'deskripsi' => $row[4],
                'jenis_obat' => $isPrescriptionRequired ? 'keras' : 'bebas',
                'is_prescription_required' => $isPrescriptionRequired,
                'indikasi' => $row[4],
                'aturan_pakai' => 'Sesuai petunjuk di kemasan atau arahan medis.',
                'efek_samping' => 'Baca informasi pada kemasan.',
                'harga' => $row[2],
                'unit' => $row[1],
                'stok' => rand(20, 100),
                'stok_minimum' => 5,
                'gambar' => $imageMap[$catName] ?? $imageMap['Obat-Obatan'],
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
            
            $productIdCounter++;
        }
        
        DB::table('products')->insert($productData);
        DB::table('product_symptoms')->insert($pivotData);
    }
}
