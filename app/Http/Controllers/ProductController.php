<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Symptom;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Menampilkan daftar semua produk beserta kategorinya.
     */
    public function index(Request $request)
    {
        $categories = Category::all();
        $symptoms = Symptom::all();

        $catQuery = $request->input('category');
        $symQuery = $request->input('symptoms');
        $searchQuery = $request->input('search');

        $products = Product::with(['category', 'symptoms'])
            ->when($catQuery && $catQuery !== 'all', function ($q) use ($catQuery) {
                $q->whereHas('category', function ($q) use ($catQuery) {
                    $q->where('slug', $catQuery);
                });
            })
            ->when($symQuery, function ($q) use ($symQuery) {
                $symArray = is_array($symQuery) ? $symQuery : explode(',', $symQuery);
                $q->whereHas('symptoms', function ($q) use ($symArray) {
                    $q->whereIn('slug', $symArray);
                });
            })
            ->when($searchQuery, function ($q) use ($searchQuery) {
                $q->where('nama_obat', 'like', '%' . $searchQuery . '%');
            })
            ->get();

        return Inertia::render('Catalog', [
            'products' => $products,
            'masterCategories' => $categories,
            'masterSymptoms' => $symptoms,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Menampilkan detail spesifik dari sebuah produk.
     */
    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);
        return Inertia::render('ProductDetail', [
            'product' => $product
        ]);
    }

    /**
     * Menampilkan form untuk membuat produk baru.
     */
    public function create()
    {
        return Inertia::render('CreateProduct');
    }

    /**
     * Menyimpan data produk baru ke database.
     */
    public function store(Request $request)
    {
        // TODO: Validasi dan simpan data produk
        // Untuk saat ini hanya melakukan redirect kembali dengan pesan sukses
        return redirect()->route('admin.dashboard')->with('success', 'Produk berhasil ditambahkan');
    }

    /**
     * Menampilkan form untuk mengedit produk (Dummy Data untuk FE).
     */
    public function edit($id)
    {
        // Dummy data untuk kebutuhan FE sementara
        $dummyProduct = [
            'id' => $id,
            'name' => 'Paracetamol 500mg',
            'sku' => 'AP-12345',
            'category' => 'bebas',
            'manufacturer' => 'PT. Kimia Farma',
            'buyPrice' => '10000',
            'sellPrice' => '15000',
            'initialStock' => '150',
            'unit' => 'tablet',
            'description' => 'Obat pereda nyeri dan penurun demam.',
            'sideEffects' => 'Jarang terjadi, mungkin ruam kulit ringan.',
            'expiryDate' => '2027-12-31',
        ];

        return Inertia::render('CreateProduct', [
            'isEdit' => true,
            'initialData' => $dummyProduct
        ]);
    }
}
