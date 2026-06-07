<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecommendationController extends Controller
{
    /**
     * Menampilkan halaman form input gejala (Langkah 1 & 2).
     */
    public function index()
    {
        return Inertia::render('Recommendation', [
            'masterSymptoms' => \App\Models\Symptom::all()
        ]);
    }

    /**
     * Memproses input gejala dan usia, lalu memberikan rekomendasi obat cerdas.
     */
    public function process(Request $request)
    {
        // 1. Validasi Input Dasar
        $request->validate([
            'symptoms' => 'required|array',
            'symptoms.*' => 'exists:symptoms,id', // Memastikan ID gejala valid
            'usia' => 'required|integer|min:0'
        ]);

        $symptomIds = $request->symptoms;
        $usia = $request->usia;

        // 2. Fetch Data Produk
        // Kita hanya mengambil produk yang aktif dan terhubung dengan SETIDAKNYA SATU gejala yang dipilih
        $products = Product::whereHas('symptoms', function ($query) use ($symptomIds) {
                $query->whereIn('symptoms.id', $symptomIds);
            })
            ->where('is_active', true)
            ->where('stok', '>', 0) // Pastikan obat tersedia di apotek
            // Eager loading relasi symptoms yang HANYA memuat gejala yang dipilih oleh user
            // Ini membuat perhitungan pivot bobot relevansi menjadi sangat presisi di tahap kalkulasi
            ->with(['symptoms' => function ($query) use ($symptomIds) {
                $query->whereIn('symptoms.id', $symptomIds);
            }, 'category'])
            ->get();

        // 3. Kalkulasi Skor dan Implementasi Logika Cerdas
        $recommendations = $products->map(function ($product) use ($usia) {
            
            // Hitung akumulasi dari kolom pivot 'bobot_relevansi'
            // Nilainya float/decimal, contoh: gejala A (0.8) + gejala B (0.5) = skor 1.3
            $totalScore = $product->symptoms->sum(function ($symptom) {
                return (float) $symptom->pivot->bobot_relevansi;
            });

            $statusRekomendasi = 'direkomendasikan';
            $alasan = null;

            // Logika "Cerdas" berdasarkan usia (Medical Rule Based Engine Sederhana)
            // Jika usia di bawah 12 tahun, obat tipe "keras" tidak disarankan
            if ($usia < 12 && $product->jenis_obat === 'keras') {
                $totalScore -= 2.0; // Pinalti skor yang sangat besar
                $statusRekomendasi = 'tidak disarankan';
                $alasan = 'Obat golongan keras berisiko untuk anak di bawah 12 tahun. Harap konsultasi dengan dokter.';
            } 
            // Jika obat tersebut bebas tapi skor kecocokan tergolong rendah/sedang, kita sebut "dipertimbangkan"
            elseif ($totalScore < 1.0) {
                $statusRekomendasi = 'dipertimbangkan';
                $alasan = 'Obat ini hanya meringankan sebagian kecil keluhan Anda.';
            }

            // Kembalikan struktur array yang siap dikonsumsi oleh React (tanpa mengekspos semua isi database)
            return [
                'id' => $product->id,
                'nama_obat' => $product->nama_obat,
                'kategori' => $product->category->nama_kategori,
                'jenis_obat' => $product->jenis_obat,
                'harga' => $product->harga,
                'gambar' => $product->gambar,
                'aturan_pakai' => $product->aturan_pakai,
                'skor_kecocokan' => round($totalScore, 2),
                'kategori_rekomendasi' => $statusRekomendasi,
                'alasan' => $alasan
            ];
        });

        // 4. Urutkan berdasarkan skor tertinggi (Descending) ke terendah
        $sortedResults = $recommendations->sortByDesc('skor_kecocokan')->values()->all();

        // 5. Kirimkan Data ke View React Frontend (Inertia)
        return Inertia::render('Rekomendasi/Hasil', [
            'results' => $sortedResults,
            'input_usia' => $usia,
            // Opsional: mengirim total obat yang ditemukan
            'total_found' => count($sortedResults) 
        ]);
    }
}
