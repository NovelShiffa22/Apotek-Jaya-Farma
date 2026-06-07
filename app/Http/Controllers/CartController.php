<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    /**
     * Menampilkan halaman keranjang belanja
     */
    public function index()
    {
        $cart = Session::get('cart', []);
        
        // Hitung total belanja
        $total = array_sum(array_map(function($item) {
            return $item['price'] * $item['quantity'];
        }, $cart));

        return \Inertia\Inertia::render('Checkout', [
            'cart' => $cart,
            'total' => $total
        ]);
    }

    /**
     * Menambahkan produk ke keranjang belanja (berbasis Session).
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $productId = $request->product_id;
        $quantity = $request->quantity ?? 1;

        // Ambil data produk
        $product = Product::findOrFail($productId);

        // Validasi ketersediaan stok obat
        if ($product->stok < $quantity) {
            $msg = "Stok {$product->nama_obat} tidak mencukupi. Sisa stok: {$product->stok}.";
            if ($request->wantsJson() || $request->ajax()) return response()->json(['message' => $msg], 400);
            return redirect()->back()->with('error', $msg);
        }
        
        // Validasi status produk aktif
        if (!$product->is_active) {
            $msg = "Obat {$product->nama_obat} saat ini tidak tersedia atau ditarik.";
            if ($request->wantsJson() || $request->ajax()) return response()->json(['message' => $msg], 400);
            return redirect()->back()->with('error', $msg);
        }

        // Ambil data keranjang dari session, default array kosong
        $cart = Session::get('cart', []);

        // Jika produk sudah ada di keranjang, akumulasi kuantitasnya
        if (isset($cart[$productId])) {
            $newQuantity = $cart[$productId]['quantity'] + $quantity;
            
            // Validasi limit stok atas akumulasi keranjang
            if ($newQuantity > $product->stok) {
                $msg = "Kuantitas melebihi batas stok! Sisa stok yang bisa ditambahkan: " . ($product->stok - $cart[$productId]['quantity']);
                if ($request->wantsJson() || $request->ajax()) return response()->json(['message' => $msg], 400);
                return redirect()->back()->with('error', $msg);
            }
            
            $cart[$productId]['quantity'] = $newQuantity;
        } else {
            // Jika belum ada, buat entri baru
            $cart[$productId] = [
                'id' => $product->id,
                'name' => $product->nama_obat,
                'price' => $product->harga,
                'quantity' => $quantity,
                'image' => $product->gambar ?? null,
                'category' => $product->category ? $product->category->nama_kategori : 'Umum',
            ];
        }

        // Simpan update state keranjang ke session
        Session::put('cart', $cart);

        $msg = "{$product->nama_obat} berhasil ditambahkan ke keranjang.";
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['success' => true, 'message' => $msg]);
        }
        return redirect()->back()->with('success', $msg);
    }
}
