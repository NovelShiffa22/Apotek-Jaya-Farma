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
        $prescriptionId = $request->query('prescription_id');
        $isBuyNow = false;
        $isPrescription = false;
        
        $checkoutItems = [];

        if ($prescriptionId) {
            $prescription = \App\Models\Prescription::with('items.product.category')->find($prescriptionId);
            if ($prescription) {
                $isPrescription = true;
                foreach ($prescription->items as $pItem) {
                    $prod = $pItem->product;
                    if ($prod) {
                        $checkoutItems[] = [
                            'id' => $prod->id,
                            'name' => $prod->nama_obat,
                            'category' => $prod->category ? $prod->category->nama_kategori : 'Satuan',
                            'price' => $prod->harga,
                            'quantity' => $pItem->kuantitas_ambil ?? $pItem->kuantitas_resep ?? 1,
                            'image' => $prod->gambar,
                        ];
                    }
                }
            }
        }

        if (!$isPrescription && $buyNowProductId) {
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

        if (!$isPrescription && !$isBuyNow) {
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
        $checkoutItems = array_map(function($item) {
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
        $addresses = [];

        if ($user) {
            $addresses = \App\Models\Address::where('user_id', $user->id)->latest()->get();
            $primaryAddress = $addresses->where('is_default', true)->first();
            
            if (!$primaryAddress) {
                $primaryAddress = $addresses->first();
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
            'cartItems' => $checkoutItems,
            'address' => $deliveryAddress,
            'addresses' => $addresses,
            'shippingMethods' => $shippingMethods,
            'discount' => \Illuminate\Support\Facades\Cache::get('global_discount', 0),
            'isBuyNow' => $isBuyNow,
            'prescriptionId' => $prescriptionId ? (int)$prescriptionId : null,
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

        $prescriptionId = $request->input('prescription_id');

        if ($prescriptionId) {
            $prescription = \App\Models\Prescription::with('items.product.category')->find($prescriptionId);
            if ($prescription) {
                foreach ($prescription->items as $pItem) {
                    $prod = $pItem->product;
                    if ($prod) {
                        $qty = $pItem->kuantitas_ambil ?? $pItem->kuantitas_resep ?? 1;
                        $purchasedItems[] = [
                            'id' => $prod->id,
                            'name' => $prod->nama_obat,
                            'category' => $prod->category ? $prod->category->nama_kategori : 'Satuan',
                            'price' => $prod->harga,
                            'quantity' => $qty,
                            'image' => $prod->gambar,
                        ];
                        $subtotal += $prod->harga * $qty;
                    }
                }
            }
        } elseif ($isBuyNow) {
            $buyNowProductIds = $request->input('item_ids', []);
            $quantities = $request->input('quantities', []);
            if (!empty($buyNowProductIds)) {
                $product = \App\Models\Product::with('category')->find($buyNowProductIds[0]);
                if ($product) {
                    $qty = isset($quantities[0]) ? (int)$quantities[0] : 1;
                    $purchasedItems[] = [
                        'id' => $product->id,
                        'name' => $product->nama_obat,
                        'category' => $product->category ? $product->category->nama_kategori : 'Satuan',
                        'price' => $product->harga,
                        'quantity' => $qty,
                        'image' => $product->gambar,
                    ];
                    $subtotal += $product->harga * $qty;
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
            'prescription_id' => $prescriptionId,
            'va_number' => $vaNumber,
            'payment_method' => $paymentMethod,
            'total_amount' => $totalAmount,
            'status' => 'Pending',
            'items' => $purchasedItems,
        ]);

        // Kurangi stok obat
        foreach ($purchasedItems as $item) {
            $productId = $item['id'] ?? $item['product_id'] ?? null;
            if ($productId) {
                $product = \App\Models\Product::find($productId);
                if ($product) {
                    $product->decrement('stok', $item['quantity'] ?? 1);
                }
            }
        }

        // Konfigurasi Midtrans
        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');
        \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
        \Midtrans\Config::$is3ds = config('midtrans.is_3ds');
        // Bypass SSL untuk localhost Windows (mengatasi CURL Error cacert.pem)
        \Midtrans\Config::$curlOptions = [
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTPHEADER => []
        ];

        $itemDetails = [];
        foreach ($purchasedItems as $item) {
            $itemDetails[] = [
                'id' => substr((string)$item['id'], 0, 50),
                'price' => (int)$item['price'],
                'quantity' => (int)$item['quantity'],
                'name' => substr($item['name'], 0, 50),
            ];
        }

        if ($shippingCost > 0) {
            $itemDetails[] = [
                'id' => 'SHIPPING',
                'price' => (int)$shippingCost,
                'quantity' => 1,
                'name' => 'Biaya Pengiriman',
            ];
        }

        if ($discount > 0) {
            $itemDetails[] = [
                'id' => 'DISCOUNT',
                'price' => -(int)$discount,
                'quantity' => 1,
                'name' => 'Potongan Harga',
            ];
        }

        $params = [
            'transaction_details' => [
                'order_id' => $transaction->id,
                'gross_amount' => (int)$totalAmount,
            ],
            'item_details' => $itemDetails,
            'customer_details' => [
                'first_name' => auth()->check() ? auth()->user()->name : 'Guest',
                'email' => auth()->check() ? auth()->user()->email : 'guest@example.com',
                'phone' => auth()->check() ? auth()->user()->phone : '08123456789',
            ],
            'callbacks' => [
                'finish' => url('/invoice/' . $transaction->id),
                'unfinish' => url('/invoice/' . $transaction->id),
                'error' => url('/invoice/' . $transaction->id)
            ],
            'expiry' => [
                'start_time' => date('Y-m-d H:i:s O'),
                'duration' => 20,
                'unit' => 'minutes'
            ]
        ];

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            $transaction->update(['snap_token' => $snapToken]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Gagal mendapatkan token Midtrans: ' . $e->getMessage());
        }

        return redirect()->route('order.invoice', ['id' => $transaction->id]);
    }

    public function invoice($id)
    {
        $transaction = \App\Models\VirtualTransaction::findOrFail($id);
        
        // DIRECT SINKRONISASI MIDTRANS
        if ($transaction->status === 'Pending' || $transaction->status === 'Belum Bayar') {
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production');
            \Midtrans\Config::$curlOptions = [
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTPHEADER => []
            ];

            try {
                $status = \Midtrans\Transaction::status($transaction->id);
                if ($status->transaction_status == 'settlement' || $status->transaction_status == 'capture') {
                    $transaction->update(['status' => 'Lunas']);
                } else if ($status->transaction_status == 'expire') {
                    $transaction->update(['status' => 'Expired']);
                } else if ($status->transaction_status == 'cancel' || $status->transaction_status == 'deny') {
                    $transaction->update(['status' => 'Dibatalkan']);
                }
            } catch (\Exception $e) {
                // Abaikan jika order belum ada di Midtrans atau eror jaringan
            }
        }

        // TIDAK DILAKUKAN REDIRECT OTOMATIS AGAR HALAMAN SUCCESS (STRUK) BISA DIRENDER DI FRONTEND
        // if ($transaction->status === 'Lunas' || $transaction->status === 'Diproses') {
        //     return redirect('/profile?tab=orders')->with('success', 'Pembayaran Berhasil! Pesanan Anda sedang diproses.');
        // }
        
        return Inertia::render('Invoice', [
            'transaction' => $transaction
        ]);
    }

    public function generateToken($id)
    {
        $transaction = \App\Models\VirtualTransaction::findOrFail($id);
        
        if (!$transaction->snap_token) {
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production');
            \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
            \Midtrans\Config::$is3ds = config('midtrans.is_3ds');
            \Midtrans\Config::$curlOptions = [
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTPHEADER => []
            ];

            $params = [
                'transaction_details' => [
                    'order_id' => $transaction->id,
                    'gross_amount' => $transaction->total_amount,
                ],
                'customer_details' => [
                    'first_name' => auth()->check() ? auth()->user()->name : 'Guest',
                    'email' => auth()->check() ? auth()->user()->email : 'guest@example.com',
                    'phone' => auth()->check() ? auth()->user()->phone : '08123456789',
                ],
                'callbacks' => [
                    'finish' => url('/invoice/' . $transaction->id),
                    'unfinish' => url('/invoice/' . $transaction->id),
                    'error' => url('/invoice/' . $transaction->id)
                ]
            ];

            try {
                $snapToken = \Midtrans\Snap::getSnapToken($params);
                $transaction->update(['snap_token' => $snapToken]);
                return redirect()->back()->with('success', 'Token pembayaran berhasil dibuat.');
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Gagal memproses pembayaran: ' . $e->getMessage());
            }
        }
        
        return redirect()->back();
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
