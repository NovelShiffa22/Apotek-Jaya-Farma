<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Gemini\Laravel\Facades\Gemini;

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
            'symptoms' => 'nullable|array',
            'symptoms.*' => 'exists:symptoms,id', // Memastikan ID gejala valid
            'usia' => 'required|integer|min:0',
            'keluhan' => 'nullable|string',
            'jenis_kelamin' => 'nullable|string'
        ]);

        // Custom validation to ensure either symptoms or keluhan is filled
        if (empty($request->symptoms) && empty(trim($request->keluhan ?? ''))) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'symptoms' => 'Pilih setidaknya satu gejala atau isi detail keluhan.',
                'keluhan' => 'Pilih setidaknya satu gejala atau isi detail keluhan.',
            ]);
        }

        $symptomIds = $request->symptoms ?? [];
        $usia = (int) $request->usia;
        $keluhan = $request->keluhan;
        $jenisKelamin = $request->jenis_kelamin;

        $geminiAnalysis = null;
        $geminiProducts = [];

        // 2. Hubungi Gemini API untuk melakukan sinkronisasi keluhan medis dan gejala
        try {
            $selectedSymptoms = \App\Models\Symptom::whereIn('id', $symptomIds)->pluck('nama_gejala')->toArray();
            
            // Ambil produk yang relevan dengan gejala terpilih ATAU keluhan pasien (untuk optimasi token & mencegah timeout)
            $matchingProductsQuery = Product::where('is_active', true)
                ->where('stok', '>', 0);
            
            $hasFilter = false;
            
            if (!empty($symptomIds)) {
                $matchingProductsQuery->where(function($q) use ($symptomIds) {
                    $q->whereHas('symptoms', function ($query) use ($symptomIds) {
                        $query->whereIn('symptoms.id', $symptomIds);
                    });
                });
                $hasFilter = true;
            }
            
            if (!empty(trim($keluhan ?? ''))) {
                $words = preg_split('/[\s,?.!]+/', strtolower($keluhan));
                $stopWords = ['saya', 'dan', 'yang', 'untuk', 'pada', 'dengan', 'atau', 'ini', 'itu', 'di', 'ke', 'dari', 'sejak', 'sudah', 'telah', 'ada', 'tidak', 'bisa', 'karena', 'jika', 'lalu', 'sebagai', 'saat', 'rasa', 'terasa'];
                $keywords = array_filter($words, function($word) use ($stopWords) {
                    return strlen($word) > 2 && !in_array($word, $stopWords);
                });
                
                if (!empty($keywords)) {
                    if ($hasFilter) {
                        // Jika sudah ada filter gejala, tambahkan pencarian kata kunci dengan OR
                        $matchingProductsQuery->orWhere(function($q) use ($keywords) {
                            $q->where('is_active', true)
                              ->where('stok', '>', 0)
                              ->where(function($sub) use ($keywords) {
                                  foreach ($keywords as $kw) {
                                      $sub->orWhere('nama_obat', 'like', "%{$kw}%")
                                          ->orWhere('deskripsi', 'like', "%{$kw}%")
                                          ->orWhere('indikasi', 'like', "%{$kw}%")
                                          ->orWhereHas('symptoms', function($sQuery) use ($kw) {
                                              $sQuery->where('nama_gejala', 'like', "%{$kw}%");
                                          });
                                  }
                              });
                        });
                    } else {
                        // Jika tidak ada gejala terpilih, filter hanya berdasarkan kata kunci keluhan
                        $matchingProductsQuery->where(function($sub) use ($keywords) {
                            foreach ($keywords as $kw) {
                                $sub->orWhere('nama_obat', 'like', "%{$kw}%")
                                    ->orWhere('deskripsi', 'like', "%{$kw}%")
                                    ->orWhere('indikasi', 'like', "%{$kw}%")
                                    ->orWhereHas('symptoms', function($sQuery) use ($kw) {
                                        $sQuery->where('nama_gejala', 'like', "%{$kw}%");
                                    });
                            }
                        });
                    }
                    $hasFilter = true;
                }
            }
            
            $products = $matchingProductsQuery->with(['category'])->get();
            
            // Jika hasil filter kosong, ambil 15 produk terpopuler agar Gemini tetap memberikan rekomendasi dasar
            if ($products->isEmpty()) {
                $products = Product::where('is_active', true)
                    ->where('stok', '>', 0)
                    ->with(['category'])
                    ->limit(15)
                    ->get();
            }

            // Kirim data ringkas (hanya field kunci) untuk menghemat token
            $productData = $products->map(function ($product) {
                return [
                    'id' => $product->id,
                    'nama_obat' => $product->nama_obat,
                    'kategori' => $product->category->nama_kategori ?? 'Umum',
                    'jenis_obat' => $product->jenis_obat,
                    'indikasi' => $product->indikasi,
                ];
            })->toArray();

            $prompt = "Anda adalah apoteker AI profesional di Apotek Jaya Farma.\n"
                . "Analisis profil pasien berikut:\n"
                . "- Usia: {$usia} tahun\n"
                . "- Jenis Kelamin: " . ($jenisKelamin ?? 'Tidak disebutkan') . "\n"
                . "- Gejala yang dipilih (dari checklist): " . (empty($selectedSymptoms) ? 'Tidak ada' : implode(', ', $selectedSymptoms)) . "\n"
                . "- Detail Keluhan Tambahan (tulis tangan): \"" . ($keluhan ?? 'Tidak ada') . "\"\n\n"
                . "Daftar obat yang tersedia di apotek:\n"
                . json_encode($productData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n"
                . "PENTING - SINKRONISASI GEJALA & DETAIL KELUHAN:\n"
                . "Anda harus menyinkronkan dan mempertimbangkan 'Gejala yang dipilih' DAN 'Detail Keluhan Tambahan' secara bersamaan sebagai satu kesatuan kondisi klinis pasien. Jangan hanya fokus pada salah satu input saja. Evaluasi semua produk obat dan klasifikasikan masing-masing obat ke kategori:\n"
                . "1. 'direkomendasikan': Obat yang sangat relevan untuk mengatasi kombinasi/sinkronisasi dari seluruh gejala yang dipilih dan keluhan tambahan, serta aman bagi usia pasien.\n"
                . "2. 'dipertimbangkan': Obat pendukung atau alternatif yang relevan dengan sebagian gejala/keluhan, namun bukan merupakan pilihan utama, atau memerlukan perhatian khusus.\n\n"
                . "Tugas Anda:\n"
                . "1. Analisis keluhan pasien secara klinis dan berikan penjelasan ringkas tentang diagnosis/kondisi yang mungkin dialami pasien berdasarkan kombinasi gejala dan keluhan ini, saran non-farmakologi (misal istirahat, minum air), serta disclaimer medis (disclaimer wajib ada).\n"
                . "2. Evaluasi daftar obat di atas dan klasifikasikan masing-masing obat ke salah satu kategori: 'direkomendasikan' atau 'dipertimbangkan'.\n"
                . "3. Berikan skor kecocokan (0-100) dan alasan rasional singkat dalam bahasa Indonesia untuk masing-masing obat.\n\n"
                . "PENTING: Hanya masukkan produk obat ke dalam array 'products' jika obat tersebut masuk dalam kategori 'direkomendasikan' atau 'dipertimbangkan'. Obat yang tidak relevan/tidak disarankan TIDAK PERLU dimasukkan ke dalam array 'products' untuk menghemat token dan mempercepat respon.\n\n"
                . "Respon harus berupa JSON valid yang tepat dengan format berikut:\n"
                . "{\n"
                . "  \"analisis_ai\": \"[Tulis analisis medis, saran non-obat, dan disclaimer di sini]\",\n"
                . "  \"products\": [\n"
                . "    {\n"
                . "      \"id\": [id obat],\n"
                . "      \"kategori_rekomendasi\": \"direkomendasikan\" | \"dipertimbangkan\",\n"
                . "      \"skor_kecocokan\": [angka 0 sampai 100],\n"
                . "      \"alasan\": \"[Alasan klinis/farmakologis singkat dalam bahasa Indonesia]\"\n"
                . "    }\n"
                . "  ]\n"
                . "}\n"
                . "Jangan sertakan teks lain di luar format JSON ini.";

            // Menggunakan model gemini-2.5-flash
            $geminiResult = Gemini::generativeModel(model: 'gemini-2.5-flash')
                ->generateContent($prompt);
            
            $responseContent = trim($geminiResult->text());
            
            if (str_starts_with($responseContent, '```')) {
                $responseContent = preg_replace('/^```(?:json)?\s*/i', '', $responseContent);
                $responseContent = preg_replace('/\s*```$/', '', $responseContent);
                $responseContent = trim($responseContent);
            }

            $decoded = json_decode($responseContent, true);
            if (json_last_error() === JSON_ERROR_NONE && isset($decoded['products'])) {
                $geminiAnalysis = $decoded['analisis_ai'] ?? null;
                $geminiProducts = collect($decoded['products'])->keyBy('id')->toArray();
            } else {
                \Illuminate\Support\Facades\Log::error("Gemini invalid JSON response: " . $responseContent);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Gemini API call failed: " . $e->getMessage());
        }

        // 3. Ambil data produk berdasarkan model evaluasi (Gemini atau Legacy)
        if (empty($geminiProducts)) {
            // Kita hanya mengambil produk yang aktif dan terhubung dengan SETIDAKNYA SATU gejala yang dipilih
            $products = Product::whereHas('symptoms', function ($query) use ($symptomIds) {
                    $query->whereIn('symptoms.id', $symptomIds);
                })
                ->where('is_active', true)
                ->where('stok', '>', 0) // Pastikan obat tersedia di apotek
                ->with(['symptoms' => function ($query) use ($symptomIds) {
                    $query->whereIn('symptoms.id', $symptomIds);
                }, 'category'])
                ->get();
        }

        // 4. Kalkulasi Skor dan Konversi ke Persentase
        $recommendations = $products->map(function ($product) use ($usia, $geminiProducts) {
            
            if (!empty($geminiProducts)) {
                if (isset($geminiProducts[$product->id])) {
                    $geminiData = $geminiProducts[$product->id];
                    $percentageScore = (int) $geminiData['skor_kecocokan'];
                    $alasan = $geminiData['alasan'] ?? '';
                    
                    $kategori_rekomendasi = $geminiData['kategori_rekomendasi'];
                    if ($kategori_rekomendasi === 'tidak_disarankan') {
                        $kategori_rekomendasi = 'tidak disarankan';
                    }
                } else {
                    $percentageScore = 0;
                    $kategori_rekomendasi = 'tidak disarankan';
                    $alasan = 'Tidak relevan dengan keluhan Anda.';
                }
            } else {
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
            }

            return [
                'id' => $product->id,
                'nama_obat' => $product->nama_obat,
                'kategori' => $product->category->nama_kategori ?? 'Umum',
                'jenis_obat' => $product->jenis_obat,
                'harga' => $product->harga,
                'gambar' => $product->gambar,
                'aturan_pakai' => $product->aturan_pakai,
                'skor_kecocokan' => $percentageScore,
                'kategori_rekomendasi' => $kategori_rekomendasi,
                'alasan' => $alasan
            ];
        });

        // 5. Kelompokkan ke Tiga Array Terpisah
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

        // 6. Kirimkan Data ke View React Frontend (Inertia)
        return Inertia::render('Rekomendasi/Hasil', [
            'direkomendasikan' => $direkomendasikan,
            'dipertimbangkan' => $dipertimbangkan,
            'tidakDisarankan' => $tidakDisarankan,
            'input_usia' => $usia,
            'total_found' => count($recommendations),
            'gemini_analysis' => $geminiAnalysis,
            'input_keluhan' => $keluhan
        ]);
    }
}
