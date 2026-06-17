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
                    $qty = $pItem->kuantitas_ambil ?? $pItem->kuantitas_resep ?? 1;
                    
                    if ($prod) {
                        $checkoutItems[] = [
                            'id' => $prod->id,
                            'name' => $prod->nama_obat,
                            'category' => $prod->category ? $prod->category->nama_kategori : 'Satuan',
                            'price' => $prod->harga,
                            'quantity' => $qty,
                            'image' => $prod->gambar,
                        ];
                    } else {
                        $checkoutItems[] = [
                            'id' => 'racikan_' . $pItem->id,
                            'name' => $pItem->product_name ?? 'Racikan Baru',
                            'category' => 'Racikan',
                            'price' => $pItem->harga_satuan ?? 0,
                            'quantity' => $qty,
                            'image' => null,
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

        if (empty($checkoutItems)) {
            return redirect()->route('catalog.index')->with('error', 'Keranjang belanja kosong. Silakan pilih produk terlebih dahulu sebelum melakukan checkout.');
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
                'id' => 'Kirim via Kurir',
                'title' => 'Kirim via Kurir',
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

        $shippingAddress = $request->input('shipping_address');
        if (empty($shippingAddress) || $shippingAddress === 'Alamat belum diatur') {
            return redirect()->back()->withErrors(['address' => 'Alamat pengiriman wajib diisi dan tidak boleh kosong sebelum memilih kurir!']);
        }

        $shippingMethod = $request->input('shipping_method');
        $prescriptionId = $request->input('prescription_id');

        $isKotaBandung = stripos($shippingAddress, 'Bandung') !== false && 
                         stripos($shippingAddress, 'Kabupaten') === false && 
                         stripos($shippingAddress, 'Kab.') === false;

        if ($prescriptionId) {
            // Validasi: Cek apakah sudah ada transaksi aktif untuk resep ini
            $activeTransaction = \App\Models\VirtualTransaction::where('prescription_id', $prescriptionId)
                ->whereIn('status', ['Pending', 'Belum Bayar', 'menunggu_pembayaran'])
                ->first();

            if ($activeTransaction) {
                if ($request->wantsJson()) {
                    return response()->json([
                        'message' => 'Terdapat transaksi pembayaran yang masih aktif untuk resep ini. Selesaikan atau batalkan pesanan tersebut terlebih dahulu.',
                        'transaction_id' => $activeTransaction->id
                    ], 400);
                }
                return redirect()->back()->withErrors(['pesanan' => 'Terdapat transaksi pembayaran yang masih aktif untuk resep ini.']);
            }

            if ($shippingMethod === 'kurir_toko' || $shippingMethod === 'Kirim via Kurir') {
                if (!$isKotaBandung) {
                    return redirect()->back()->withErrors(['shipping_method' => 'Layanan kurir toko untuk pesanan resep saat ini hanya mencakup wilayah Kota Bandung. Alamat luar kota tidak didukung.']);
                }
            }
        }

        $paymentMethod = $request->input('payment_method');
        $isBuyNow = $request->input('is_buy_now', false);
        
        $shippingCost = ($shippingMethod === 'kurir_toko' || $shippingMethod === 'Kirim via Kurir') ? 12000 : 0;
        $discount = \Illuminate\Support\Facades\Cache::get('global_discount', 0);
        
        $subtotal = 0;
        $purchasedItems = [];

        if ($prescriptionId) {
            $prescription = \App\Models\Prescription::with('items.product.category')->find($prescriptionId);
            if ($prescription) {
                // SINKRONISASI DATA PENGIRIMAN DARI RESEP
                $shippingMethod = $prescription->shipping_method ?? 'ambil_apotek';
                $shippingAddress = $prescription->shipping_address ?? 'Alamat belum diatur';
                $shippingCost = ($shippingMethod === 'kurir' || $shippingMethod === 'kurir_toko') ? 12000 : 0;
                $discount = 0; // HAPUS DISKON UNTUK RESEP
                
                foreach ($prescription->items as $pItem) {
                    $prod = $pItem->product;
                    $qty = $pItem->kuantitas_ambil ?? $pItem->kuantitas_resep ?? 1;
                    
                    if ($prod) {
                        $purchasedItems[] = [
                            'id' => $prod->id,
                            'name' => $prod->nama_obat,
                            'category' => $prod->category ? $prod->category->nama_kategori : 'Satuan',
                            'price' => $prod->harga,
                            'quantity' => $qty,
                            'image' => $prod->gambar,
                        ];
                        $subtotal += $prod->harga * $qty;
                    } else {
                        // Racikan / Custom Item
                        $harga = $pItem->harga_satuan ?? 0;
                        $purchasedItems[] = [
                            'id' => 'racikan_' . $pItem->id, // Fake ID for racikan
                            'name' => $pItem->product_name ?? 'Racikan Baru',
                            'category' => 'Racikan',
                            'price' => $harga,
                            'quantity' => $qty,
                            'image' => null,
                        ];
                        $subtotal += $harga * $qty;
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
        
        $transaction = \App\Models\VirtualTransaction::create([
            'user_id' => auth()->id(),
            'prescription_id' => $prescriptionId,
            'va_number' => null,
            'bank_name' => null,
            'payment_method' => $paymentMethod,
            'total_amount' => $totalAmount,
            'status' => 'Pending',
            'items' => $purchasedItems,
            'shipping_address' => $shippingAddress,
            'shipping_method' => $shippingMethod,
            'shipping_cost' => $shippingCost,
        ]);

        // Log the activity
        if (auth()->check()) {
            \App\Models\UserActivity::create([
                'user_id' => auth()->id(),
                'action' => 'create_virtual_transaction',
                'description' => 'User membuat pesanan virtual #' . ($transaction->va_number ?? 'VT-' . $transaction->id),
                'ip_address' => $request->ip(),
            ]);
        }

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

        if ($request->wantsJson()) {
            return response()->json([
                'snap_token' => $transaction->snap_token ?? null,
                'transaction_id' => $transaction->id,
            ]);
        }

        return redirect()->route('order.invoice', ['id' => $transaction->id]);
    }

    public function invoice($id)
    {
        $transaction = \App\Models\VirtualTransaction::findOrFail($id);
        
        // DIRECT SINKRONISASI MIDTRANS
        if ($transaction->status === 'Pending' || $transaction->status === 'Belum Bayar') {
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = filter_var(config('midtrans.is_production'), FILTER_VALIDATE_BOOLEAN);
            \Midtrans\Config::$curlOptions = [
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTPHEADER => []
            ];

            try {
                $status = \Midtrans\Transaction::status($transaction->id);
                
                try {
                    if (isset($status->va_numbers) && count($status->va_numbers) > 0) {
                        // 1. Tipe Virtual Account Bank biasa
                        $transaction->bank_name = strtoupper($status->va_numbers[0]->bank);
                        $transaction->va_number = $status->va_numbers[0]->va_number;
                    } elseif (isset($status->payment_type) && $status->payment_type == 'cstore') {
                        // 2. Tipe Gerai Retail (Alfamart / Indomaret)
                        $transaction->bank_name = strtoupper($status->store ?? 'GERAI RETAIL');
                        $transaction->va_number = $status->payment_code ?? null;
                    } elseif (isset($status->payment_type) && ($status->payment_type == 'echannel' || isset($status->bill_key))) {
                        // 3. Tipe Mandiri Bill
                        $transaction->bank_name = 'MANDIRI BILL';
                        $transaction->va_number = ($status->biller_code ?? '') . ' - ' . ($status->bill_key ?? '');
                    } else {
                        // 4. Tipe E-Wallet (DANA, Gopay, ShopeePay, QRIS)
                        $transaction->bank_name = strtoupper($status->payment_type ?? 'E-WALLET');
                        $transaction->va_number = $status->transaction_id ?? null;
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("Midtrans universal parsing error: " . $e->getMessage());
                }

                if ($status->transaction_status == 'settlement' || $status->transaction_status == 'capture') {
                    $transaction->update(['status' => 'Lunas']);
                    if ($transaction->prescription_id) {
                        \App\Models\Prescription::where('id', $transaction->prescription_id)
                            ->update(['status_validasi' => 'telah_dipesan']);
                    }
                } else if ($status->transaction_status == 'expire') {
                    $transaction->update(['status' => 'Expired']);
                } else if ($status->transaction_status == 'cancel' || $status->transaction_status == 'deny') {
                    $transaction->update(['status' => 'Dibatalkan']);
                } else {
                    $transaction->save();
                }
                
                // Pastikan data terbaru dari database diambil kembali
                $transaction = $transaction->fresh();

            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Midtrans API Check failed in invoice: " . $e->getMessage());
            }
        }
        
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

        if ($transaction->prescription_id) {
            \App\Models\Prescription::where('id', $transaction->prescription_id)
                ->update(['status_validasi' => 'telah_dipesan']);
        }

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

    public function pembayaranSukses(\Illuminate\Http\Request $request)
    {
        $transaction = \App\Models\VirtualTransaction::find($request->order_id);
        
        if ($transaction) {
            $transaction->status = 'Lunas';
            
            // Universal mapping untuk sinkronisasi fallback frontend
            if ($request->has('va_numbers') && is_array($request->va_numbers) && count($request->va_numbers) > 0) {
                $transaction->bank_name = strtoupper($request->va_numbers[0]['bank'] ?? '');
                $transaction->va_number = $request->va_numbers[0]['va_number'] ?? null;
            } elseif ($request->payment_type == 'cstore') {
                $transaction->bank_name = strtoupper($request->store ?? 'GERAI RETAIL');
                $transaction->va_number = $request->payment_code ?? null;
            } elseif ($request->payment_type == 'echannel' || $request->has('bill_key')) {
                $transaction->bank_name = 'MANDIRI BILL';
                $transaction->va_number = ($request->biller_code ?? '') . ' - ' . ($request->bill_key ?? '');
            } else {
                $transaction->bank_name = strtoupper($request->payment_type ?? 'E-WALLET');
                $transaction->va_number = $request->transaction_id ?? null;
            }
            
            $transaction->save();

            if ($transaction->prescription_id) {
                \App\Models\Prescription::where('id', $transaction->prescription_id)
                    ->update(['status_validasi' => 'telah_dipesan']);
            }
        }
        
        return redirect()->back();
    }
}
