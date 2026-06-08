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

        // 3. Kalkulasi Skor dan Konversi ke Persentase
        $recommendations = $products->map(function ($product) use ($usia) {
            $totalScore = $product->symptoms->sum(function ($symptom) {
                return (float) $symptom->pivot->bobot_relevansi;
            });

            // Konversi skor ke format persentase (mirip logika frontend)
            $percentageScore = $totalScore > 0 ? min((int) round($totalScore * 45 + 50), 99) : 0;

            $alasan = null;
            $kategori_rekomendasi = '';

            // Logika medis dasar: obat keras dilarang untuk anak < 12 tahun
            if ($usia < 12 && $product->jenis_obat === 'keras') {
                $percentageScore = 0;
                $kategori_rekomendasi = 'tidak disarankan';
                $alasan = 'Obat golongan keras berisiko untuk anak di bawah 12 tahun. Harap konsultasi dengan dokter.';
            } else {
                if ($percentageScore >= 85) {
                    $kategori_rekomendasi = 'direkomendasikan';
                } elseif ($percentageScore >= 50) {
                    $kategori_rekomendasi = 'dipertimbangkan';
                    $alasan = 'Obat ini meringankan sebagian keluhan Anda.';
                } else {
                    $kategori_rekomendasi = 'tidak disarankan';
                    $alasan = 'Tingkat kecocokan sangat rendah dengan keluhan Anda.';
                }
            }

            return [
                'id' => $product->id,
                'nama_obat' => $product->nama_obat,
                'kategori' => $product->category->nama_kategori,
                'jenis_obat' => $product->jenis_obat,
                'harga' => $product->harga,
                'gambar' => $product->gambar,
                'aturan_pakai' => $product->aturan_pakai,
                'skor_kecocokan' => $percentageScore,
                'kategori_rekomendasi' => $kategori_rekomendasi,
                'alasan' => $alasan
            ];
        });

        // 4. Kelompokkan ke Tiga Array Terpisah
        $direkomendasikan = [];
        $dipertimbangkan = [];
        $tidakDisarankan = [];

        foreach ($recommendations as $item) {
            if ($item['kategori_rekomendasi'] === 'direkomendasikan') {
                $direkomendasikan[] = $item;
            } elseif ($item['kategori_rekomendasi'] === 'dipertimbangkan') {
                $dipertimbangkan[] = $item;
            } else {
                $tidakDisarankan[] = $item;
            }
        }

        // Urutkan tiap array dari skor terbesar ke terkecil
        usort($direkomendasikan, fn($a, $b) => $b['skor_kecocokan'] <=> $a['skor_kecocokan']);
        usort($dipertimbangkan, fn($a, $b) => $b['skor_kecocokan'] <=> $a['skor_kecocokan']);
        usort($tidakDisarankan, fn($a, $b) => $b['skor_kecocokan'] <=> $a['skor_kecocokan']);

        // 5. Kirimkan Data ke View React Frontend (Inertia)
        return Inertia::render('Rekomendasi/Hasil', [
            'direkomendasikan' => $direkomendasikan,
            'dipertimbangkan' => $dipertimbangkan,
            'tidakDisarankan' => $tidakDisarankan,
            'input_usia' => $usia,
            'total_found' => count($recommendations) 
        ]);
    }
}
