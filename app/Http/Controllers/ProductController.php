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

        return Inertia::render('Katalog/Index', [
            'products' => $products
        ]);
    }
}
