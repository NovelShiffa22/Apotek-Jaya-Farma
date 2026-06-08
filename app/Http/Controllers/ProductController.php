<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Menampilkan daftar semua produk beserta kategorinya.
     */
    public function index()
    {
        // Mengambil data produk beserta relasi kategorinya
        // Anda juga bisa menambahkan ->where('is_active', true) jika hanya ingin produk yang aktif
        $products = Product::with('category')->get();

        return Inertia::render('Catalog', [
            'products' => $products
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
