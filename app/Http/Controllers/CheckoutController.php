<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index(Request $request)
    {
        $buyNowProductId = $request->query('buy_now_product_id');
        $buyNowQuantity = $request->query('buy_now_quantity', 1);
        $isBuyNow = false;
        
        $checkoutItems = [];

        if ($buyNowProductId) {
            $product = \App\Models\Product::with('category')->find($buyNowProductId);
            if ($product) {
                $isBuyNow = true;
                $checkoutItems = [[
                    'id' => $product->id,
                    'name' => $product->nama_obat,
                    'category' => $product->category ? $product->category->nama_kategori : 'Satuan',
                    'price' => $product->harga,
                    'quantity' => $buyNowQuantity,
                    'image' => $product->gambar,
                ]];
            }
        }

        if (!$isBuyNow) {
            // 1. Dapatkan data keranjang (seluruhnya) dari session
            $cart = Session::get('cart', []);
            
            // 2. Filter item berdasarkan IDs yang dicentang dari halaman cart
            $selectedIds = $request->input('items', []);
            
            if (!empty($selectedIds)) {
                foreach ($selectedIds as $id) {
                    if (isset($cart[$id])) {
                        $checkoutItems[] = $cart[$id];
                    }
                }
            } else {
                // Fallback: Jika tidak ada item spesifik, ambil semua
                $checkoutItems = array_values($cart);
            }
        }

        // 3. Format Data Produk untuk UI
        $formattedItems = array_map(function($item) {
            return [
                'id' => $item['id'],
                'nama' => $item['name'],
                'jenis_kemasan' => $item['category'] ?? 'Satuan', 
                'harga' => $item['price'],
                'quantity' => $item['quantity'],
                'foto' => $item['image'],
            ];
        }, $checkoutItems);

        // 4. Data Alamat Pengiriman
        $user = auth()->user();
        $deliveryAddress = null;

        if ($user) {
            $primaryAddress = \App\Models\Address::where('user_id', $user->id)
                ->where('is_default', true)
                ->first();
            
            if (!$primaryAddress) {
                $primaryAddress = \App\Models\Address::where('user_id', $user->id)->first();
            }

            if ($primaryAddress) {
                $deliveryAddress = [
                    'nama_penerima' => $user->name . ' (' . $primaryAddress->label . ')',
                    'alamat_lengkap' => $primaryAddress->alamat_lengkap . ', ' . $primaryAddress->kota . ', ' . $primaryAddress->provinsi . ' ' . $primaryAddress->kode_pos,
                    'nomor_hp' => $user->phone ?? '-',
                ];
            } else {
                $deliveryAddress = [
                    'nama_penerima' => $user->name . ' (Utama)',
                    'alamat_lengkap' => $user->address ?? 'Alamat belum diatur',
                    'nomor_hp' => $user->phone ?? '-',
                ];
            }
        } else {
            // Data Dummy elegan jika guest (Sesuai Mockup)
            $deliveryAddress = [
                'nama_penerima' => 'Budi Santoso (Utama)',
                'alamat_lengkap' => 'Jl. Kemang Raya No. 42, Bangka, Mampang Prapatan, Jakarta Selatan, 12730',
                'nomor_hp' => '0812-3456-7890',
            ];
        }

        // 5. Data Opsi Metode Pengiriman
        $shippingMethods = [
            [
                'id' => 'ambil_apotek',
                'title' => 'Ambil di Apotek',
                'subtitle' => 'Siap dalam 2 jam',
                'price' => 0,
            ],
            [
                'id' => 'kurir_toko',
                'title' => 'Kurir Toko',
                'subtitle' => '',
                'price' => 12000,
            ]
        ];

        // 6. Return Payload ke Frontend (Inertia)
        return Inertia::render('Checkout', [
            'cartItems' => $formattedItems,
            'address' => $deliveryAddress,
            'shippingMethods' => $shippingMethods,
            'discount' => \Illuminate\Support\Facades\Cache::get('global_discount', 0),
            'isBuyNow' => $isBuyNow,
        ]);
    }

    public function process(Request $request)
    {
        // Simulasi validasi pesanan
        $request->validate([
            'shipping_method' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        $shippingMethod = $request->input('shipping_method');
        $paymentMethod = $request->input('payment_method');
        $isBuyNow = $request->input('is_buy_now', false);
        
        $shippingCost = $shippingMethod === 'kurir_toko' ? 12000 : 0;
        $discount = \Illuminate\Support\Facades\Cache::get('global_discount', 0);
        
        $subtotal = 0;
        $purchasedItems = [];

        if ($isBuyNow) {
            $buyNowProductIds = $request->input('item_ids', []);
            if (!empty($buyNowProductIds)) {
                $product = \App\Models\Product::with('category')->find($buyNowProductIds[0]);
                if ($product) {
                    $purchasedItems[] = [
                        'id' => $product->id,
                        'name' => $product->nama_obat,
                        'category' => $product->category ? $product->category->nama_kategori : 'Satuan',
                        'price' => $product->harga,
                        'quantity' => 1,
                        'image' => $product->gambar,
                    ];
                    $subtotal += $product->harga;
                }
            }
        } else {
            $cart = Session::get('cart', []);
            $selectedIds = $request->input('item_ids', []);
            
            if (!empty($selectedIds)) {
                foreach ($selectedIds as $id) {
                    if(isset($cart[$id])) {
                        $purchasedItems[] = $cart[$id];
                        $subtotal += $cart[$id]['price'] * $cart[$id]['quantity'];
                    }
                    unset($cart[$id]);
                }
                Session::put('cart', $cart);
            } else {
                foreach ($cart as $id => $item) {
                    $purchasedItems[] = $item;
                    $subtotal += $item['price'] * $item['quantity'];
                }
                Session::forget('cart');
            }
        }
        if (empty($purchasedItems)) {
            return redirect()->back()->with('error', 'Tidak ada produk yang dipilih untuk dicheckout.');
        }

        $totalAmount = $subtotal > 0 ? max(0, $subtotal + $shippingCost - $discount) : 0;
        
        // Generate VA Number
        $phone = auth()->check() ? auth()->user()->phone : null;
        $vaNumber = '8830' . ($phone ? preg_replace('/[^0-9]/', '', $phone) : rand(10000000, 99999999));

        $transaction = \App\Models\VirtualTransaction::create([
            'user_id' => auth()->id(),
            'va_number' => $vaNumber,
            'payment_method' => $paymentMethod,
            'total_amount' => $totalAmount,
            'status' => 'Pending',
            'items' => $purchasedItems,
        ]);

        return redirect()->route('order.invoice', ['id' => $transaction->id]);
    }

    public function invoice($id)
    {
        $transaction = \App\Models\VirtualTransaction::findOrFail($id);
        
        return Inertia::render('Invoice', [
            'transaction' => $transaction
        ]);
    }

    public function simulatePayment($id)
    {
        $transaction = \App\Models\VirtualTransaction::findOrFail($id);
        $transaction->update([
            'status' => 'Lunas'
        ]);

        return redirect()->back()->with('success', 'Pembayaran berhasil diverifikasi!');
    }

    public function cancelTransaction($id)
    {
        $transaction = \App\Models\VirtualTransaction::where('user_id', auth()->id())->findOrFail($id);
        
        if ($transaction->status !== 'Lunas') {
            $transaction->update(['status' => 'Dibatalkan']);
            return redirect('/profile?tab=orders')->with('success', 'Pesanan berhasil dibatalkan.');
        }

        return redirect()->back()->with('error', 'Pesanan yang sudah lunas tidak dapat dibatalkan.');
    }
}
