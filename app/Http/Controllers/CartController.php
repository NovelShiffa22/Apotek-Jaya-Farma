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
        $cartItems = array_values($cart); // Convert map to array for React

        // Format data to match Cart.tsx requirements
        $formattedItems = array_map(function($item) {
            return [
                'id' => $item['id'],
                'nama' => $item['name'],
                'jenis_kemasan' => $item['category'] ?? 'Satuan', // Default to category
                'harga' => $item['price'],
                'quantity' => $item['quantity'],
                'foto' => $item['image'],
            ];
        }, $cartItems);

        // Get 2 frequently bought items (random active products with stock)
        $frequentlyBought = Product::where('is_active', true)
            ->where('stok', '>', 0)
            ->inRandomOrder()
            ->limit(2)
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'nama' => $product->nama_obat,
                    'kategori' => $product->category ? $product->category->nama_kategori : 'Umum',
                    'harga' => $product->harga,
                    'foto' => $product->gambar,
                ];
            });

        return \Inertia\Inertia::render('Cart', [
            'cartItems' => $formattedItems,
            'shippingCost' => 0,
            'discount' => \Illuminate\Support\Facades\Cache::get('global_discount', 0),
            'frequentlyBought' => $frequentlyBought
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
        return redirect()->back()->with('success', $msg);
    }

    /**
     * Update kuantitas item dalam keranjang.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Session::get('cart', []);

        if (isset($cart[$id])) {
            $product = Product::findOrFail($id);
            
            // Proteksi jika kuantitas melebihi stok di database MySQL kalian
            if ($request->quantity > $product->stok) {
                return redirect()->back()->with('error', 'Stok tidak mencukupi.');
            }

            $cart[$id]['quantity'] = $request->quantity;
            Session::put('cart', $cart);

            // Langsung arahkan kembali agar data props di React otomatis ter-update
            return redirect()->back()->with('success', 'Kuantitas diperbarui.');
        }

        return redirect()->back()->with('error', 'Item tidak ditemukan.');
    }

    /**
     * Hapus item dari keranjang.
     */
    public function remove(Request $request, $id)
    {
        $cart = Session::get('cart', []);

        if (isset($cart[$id])) {
            unset($cart[$id]);
            Session::put('cart', $cart);
            return redirect()->back()->with('success', 'Item dihapus dari keranjang.');
        }

        return redirect()->back()->with('error', 'Item tidak ditemukan.');
    }
}
