<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Symptom;

// Halaman Utama / Landing Page
Route::get('/', function () {
    // Menggunakan subquery untuk menghitung total penjualan berdasarkan transaksi riil
    // Subquery mencegah error ONLY_FULL_GROUP_BY pada mode strict Laravel/MySQL
    $featuredProducts = \App\Models\Product::with(['category', 'symptoms'])
        ->select('products.*')
        ->selectRaw('(SELECT COALESCE(SUM(order_items.kuantitas), 0) FROM order_items JOIN orders ON orders.id = order_items.order_id WHERE order_items.product_id = products.id AND orders.status IN ("diproses", "dikirim", "selesai")) as total_sold')
        ->orderBy('total_sold', 'desc')
        ->take(6)
        ->get();

    // Mapping nilai total_sold ke attribute terjual yang digunakan oleh frontend
    foreach ($featuredProducts as $product) {
        $product->terjual = (int) $product->total_sold;
    }

    return Inertia::render('Home', [
        'featuredProducts' => $featuredProducts
    ]);
});

Route::get('/catalog', [ProductController::class, 'index'])->name('catalog.index');

// Halaman Tentang Kami (Public)
Route::get('/tentang-kami', function () {
    $settings = \Illuminate\Support\Facades\DB::table('apotek_settings')->get()->pluck('value', 'key');
    return Inertia::render('TentangKami', [
        'apotekSettings' => [
            'deskripsi'       => $settings->get('deskripsi', 'Apotek Jaya Farma adalah unit usaha pelayanan kefarmasian dan produk kesehatan swasta yang telah berdiri sejak tahun 1971 di Kota Bandung.'),
            'alamat'          => $settings->get('alamat', 'Jl. Malabar No. 50, Kecamatan Lengkong, Kota Bandung'),
            'jam_operasional' => $settings->get('jam_operasional', '08.00 - 18.00 WIB (Buka setiap hari, kecuali hari libur)'),
            'kontak'          => $settings->get('kontak', '+62 813-1532-4311'),
        ],
    ]);
})->name('tentang-kami');

Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

// Menampilkan halaman form input gejala
Route::get('/recommendation', [RecommendationController::class, 'index'])->name('rekomendasi.index');
// Memproses kueri data gejala & menghitung skor rekomendasi obat
Route::post('/rekomendasi/proses', [RecommendationController::class, 'process'])->name('rekomendasi.process');
Route::get('/rekomendasi/proses', function() { return redirect()->route('rekomendasi.index'); });


// Rute Transaksi & Keranjang
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');

Route::get('/notifications', function () {
    return Inertia::render('Notifications');
})->name('notifications.index');

// Rute Simulasi Resep (FE)
Route::prefix('prescriptions')->name('prescriptions.')->group(function () {
    Route::get('/upload/step-1', function() { return Inertia::render('Prescriptions/UploadStep1'); })->name('upload.step1');
    Route::get('/upload/step-2', function() { 
        $user = auth()->user();
        $addresses = $user ? \App\Models\Address::where('user_id', $user->id)->latest()->get() : [];
        $defaultAddress = $addresses->where('is_default', true)->first() ?? $addresses->first();
        return Inertia::render('Prescriptions/UploadStep2', [
            'defaultAddress' => $defaultAddress,
            'addresses' => $addresses
        ]); 
    })->name('upload.step2');
    Route::get('/{id}', [\App\Http\Controllers\PrescriptionController::class, 'show'])->name('detail');
    Route::post('/', [\App\Http\Controllers\PrescriptionController::class, 'store'])->middleware('auth')->name('store');
});

Route::get('/checkout', [CheckoutController::class, 'index'])->middleware('auth')->name('checkout.index');
Route::post('/checkout/proses', [CheckoutController::class, 'process'])->middleware('auth')->name('checkout.proses');
Route::post('/checkout/pembayaran-sukses', [CheckoutController::class, 'pembayaranSukses'])->middleware('auth')->name('checkout.pembayaran-sukses');

Route::get('/invoice/{id}', [CheckoutController::class, 'invoice'])->name('order.invoice');
Route::post('/invoice/{id}/generate-token', [CheckoutController::class, 'generateToken'])->name('order.generate_token');
Route::post('/api/midtrans-callback', [\App\Http\Controllers\MidtransController::class, 'callback']);
Route::post('/invoice/{id}/cancel', [CheckoutController::class, 'cancelTransaction'])->name('order.cancel');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::put('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [CartController::class, 'remove'])->name('cart.remove');

Route::get('/profile', function () {
    $user = auth()->user();
    
    // SINKRONISASI MIDTRANS LOKAL (DIRECT STATUS CHECK) HANYA UNTUK YANG PENDING
    $pendingOrders = \App\Models\VirtualTransaction::where('user_id', $user->id)->where('status', 'Pending')->get();

    \Midtrans\Config::$serverKey = config('midtrans.server_key');
    \Midtrans\Config::$isProduction = config('midtrans.is_production');
    \Midtrans\Config::$curlOptions = [
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_SSL_VERIFYPEER => 0,
        CURLOPT_HTTPHEADER => []
    ];

    foreach ($pendingOrders as $order) {
        try {
            $status = \Midtrans\Transaction::status($order->id);
            
            try {
                if (isset($status->va_numbers) && !empty($status->va_numbers)) {
                    $order->va_number = $status->va_numbers[0]->va_number;
                    $order->bank_name = strtoupper($status->va_numbers[0]->bank);
                } else {
                    $order->bank_name = strtoupper($status->payment_type ?? 'TRANSFER');
                    $order->va_number = $status->payment_code ?? null;
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Midtrans va_numbers parse error: " . $e->getMessage());
            }

            if ($status->transaction_status === 'expire') {
                $order->status = 'Expired';
                $order->save();
                
                // Kembalikan stok obat
                if (is_array($order->items)) {
                    foreach ($order->items as $item) {
                        $productId = $item['id'] ?? $item['product_id'] ?? null;
                        if ($productId) {
                            $product = \App\Models\Product::find($productId);
                            if ($product) {
                                $product->increment('stok', $item['quantity'] ?? 1);
                            }
                        }
                    }
                }
            } elseif ($status->transaction_status === 'cancel') {
                $order->status = 'Dibatalkan';
                $order->save();
                
                // Kembalikan stok obat
                if (is_array($order->items)) {
                    foreach ($order->items as $item) {
                        $productId = $item['id'] ?? $item['product_id'] ?? null;
                        if ($productId) {
                            $product = \App\Models\Product::find($productId);
                            if ($product) {
                                $product->increment('stok', $item['quantity'] ?? 1);
                            }
                        }
                    }
                }
            } elseif ($status->transaction_status === 'settlement' || $status->transaction_status === 'capture') {
                $order->status = 'Lunas';
                $order->save();
            } else {
                $order->save();
            }
        } catch (\Exception $e) {
            // Abaikan jika belum ada di Midtrans
        }

        // Fallback cek waktu lokal (20 menit kedaluwarsa)
        if ($order->status === 'Pending') {
            $createdAt = \Carbon\Carbon::parse($order->created_at);
            if (now()->diffInMinutes($createdAt, true) >= 20 && $createdAt->isPast()) {
                $order->update(['status' => 'Expired']);
                
                if (is_array($order->items)) {
                    foreach ($order->items as $item) {
                        $productId = $item['id'] ?? $item['product_id'] ?? null;
                        if ($productId) {
                            $product = \App\Models\Product::find($productId);
                            if ($product) {
                                $product->increment('stok', $item['quantity'] ?? 1);
                            }
                        }
                    }
                }
            }
        }
    }

    $counts = [
        'Pending' => \App\Models\VirtualTransaction::where('user_id', $user->id)->whereIn('status', ['Pending', 'Belum Bayar'])->count(),
        'Lunas' => \App\Models\VirtualTransaction::where('user_id', $user->id)->where('status', 'Lunas')->count(),
        'Dikirim' => \App\Models\VirtualTransaction::where('user_id', $user->id)->where('status', 'Dikirim')->count(),
        'Selesai' => \App\Models\VirtualTransaction::where('user_id', $user->id)->where('status', 'Selesai')->count(),
        'Dibatalkan' => \App\Models\VirtualTransaction::where('user_id', $user->id)->where('status', 'Dibatalkan')->count(),
    ];

    $currentStatus = request('status', 'Pending');
    $statusArray = $currentStatus === 'Pending' ? ['Pending', 'Belum Bayar'] : [$currentStatus];

    $orders = \App\Models\VirtualTransaction::where('user_id', $user->id)
        ->whereIn('status', $statusArray)
        ->latest()
        ->paginate(5)
        ->withQueryString();

    $addresses = \App\Models\Address::where('user_id', $user->id)->latest()->get();

    $prescriptionCounts = [
        'Menunggu Verifikasi' => \App\Models\Prescription::where('user_id', $user->id)->where('status_validasi', 'pending')->count(),
        'Disetujui' => \App\Models\Prescription::where('user_id', $user->id)->where('status_validasi', 'disetujui')->count(),
        'Ditolak' => \App\Models\Prescription::where('user_id', $user->id)->where('status_validasi', 'ditolak')->count(),
        'Telah dipesan' => \App\Models\Prescription::where('user_id', $user->id)->where('status_validasi', 'telah_dipesan')->count(),
    ];

    $currentPrescriptionStatus = request('prescription_status', 'Menunggu Verifikasi');
    
    $prescriptionsQuery = \App\Models\Prescription::withCount('orders')->where('user_id', $user->id);
    if ($currentPrescriptionStatus === 'Menunggu Verifikasi') {
        $prescriptionsQuery->where('status_validasi', 'pending');
    } elseif ($currentPrescriptionStatus === 'Disetujui') {
        $prescriptionsQuery->where('status_validasi', 'disetujui');
    } elseif ($currentPrescriptionStatus === 'Ditolak') {
        $prescriptionsQuery->where('status_validasi', 'ditolak');
    } elseif ($currentPrescriptionStatus === 'Telah dipesan') {
        $prescriptionsQuery->where('status_validasi', 'telah_dipesan');
    }

    $prescriptions = $prescriptionsQuery->latest()->paginate(5, ['*'], 'prescription_page')->withQueryString();
    
    return Inertia::render('Profile', [
        'user' => $user,
        'orders' => $orders,
        'counts' => $counts,
        'prescriptionCounts' => $prescriptionCounts,
        'addresses' => $addresses,
        'prescriptions' => $prescriptions
    ]);
})->middleware(['auth', 'role:user'])->name('profile');

Route::middleware(['auth', 'role:user'])->group(function () {
    Route::patch('/profile/update', [\App\Http\Controllers\ProfileController::class, 'updateProfile'])->name('profile.update_info');
    Route::post('/profile/address', [\App\Http\Controllers\ProfileController::class, 'storeAlamat'])->name('address.store');
    Route::patch('/profile/address/{id}', [\App\Http\Controllers\ProfileController::class, 'updateAlamat'])->name('address.update');
    Route::patch('/profile/address/{id}/utama', [\App\Http\Controllers\ProfileController::class, 'setUtama'])->name('address.set_utama');
    Route::delete('/profile/address/{id}', [\App\Http\Controllers\ProfileController::class, 'destroyAlamat'])->name('addresses.destroy');
    Route::delete('/profile/orders/{id}', function ($id) {
        $order = \App\Models\VirtualTransaction::where('user_id', auth()->id())->findOrFail($id);
        if ($order->status === 'Dibatalkan') {
            $order->delete();
            return redirect()->back()->with('success', 'Riwayat pesanan berhasil dihapus.');
        }
        return redirect()->back()->with('error', 'Hanya pesanan yang dibatalkan yang dapat dihapus.');
    })->name('orders.destroy');
    Route::delete('/profile/prescriptions/{id}', function ($id) {
        $prescription = \App\Models\Prescription::where('user_id', auth()->id())->findOrFail($id);
        if ($prescription->status_validasi === 'pending') {
            $filePath = str_replace('storage/', '', $prescription->file_foto);
            if (\Illuminate\Support\Facades\Storage::disk('public')->exists($filePath)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($filePath);
            }
            $prescription->delete();
            return redirect()->back()->with('success', 'Resep berhasil dibatalkan.');
        }
        return redirect()->back()->with('error', 'Hanya resep dengan status pending yang dapat dibatalkan.');
    })->name('prescriptions.destroy');
});

// Ruang Portal Kerja Manajemen (Dashboard)
Route::middleware(['auth', 'role:pharmacist'])->group(function () {
    Route::get('/pharmacist', function () {
        // Prescriptions Pagination
        $prescriptionsQuery = \App\Models\Prescription::with(['user.addresses', 'items.product', 'validator', 'virtualTransactions' => function($q) {
            $q->latest();
        }])->latest();

        $prescriptionStatus = request('prescription_status', 'menunggu');
        if ($prescriptionStatus === 'menunggu') {
            $prescriptionsQuery->where('status_validasi', 'pending');
        } elseif ($prescriptionStatus === 'disetujui') {
            $prescriptionsQuery->where('status_validasi', 'disetujui');
        } elseif ($prescriptionStatus === 'ditolak') {
            $prescriptionsQuery->where('status_validasi', 'ditolak');
        }

        $prescriptionSearch = request('prescription_search');
        if ($prescriptionSearch) {
            $prescriptionsQuery->where(function($q) use ($prescriptionSearch) {
                $q->whereHas('user', function($uq) use ($prescriptionSearch) {
                    $uq->where('name', 'like', "%{$prescriptionSearch}%");
                })->orWhere('kode_resep', 'like', "%{$prescriptionSearch}%")
                  ->orWhere('id', 'like', "%{$prescriptionSearch}%");
            });
        }

        $prescriptionDate = request('prescription_date');
        if ($prescriptionDate) {
            $dates = explode(',', $prescriptionDate);
            if (count($dates) == 2) {
                $prescriptionsQuery->whereBetween('created_at', [$dates[0] . ' 00:00:00', $dates[1] . ' 23:59:59']);
            } else {
                $prescriptionsQuery->whereDate('created_at', $dates[0]);
            }
        }

        $paginatedPrescriptions = $prescriptionsQuery->paginate(10, ['*'], 'prescription_page')->withQueryString();

        // Products Pagination
        $productSearch = request('product_search');
        $productCategory = request('product_category', 'all');
        $productsQuery = \App\Models\Product::with(['category', 'symptoms'])
            ->select('products.*')
            ->selectRaw('(SELECT COALESCE(SUM(order_items.kuantitas), 0) FROM order_items JOIN orders ON orders.id = order_items.order_id WHERE order_items.product_id = products.id AND orders.status = "selesai") as sales');
            
        if ($productSearch) {
            $productsQuery->where('nama_obat', 'like', "%{$productSearch}%");
        }
        if ($productCategory !== 'all') {
            $productsQuery->where('jenis_obat', $productCategory);
        }
        $paginatedProducts = $productsQuery->latest()->paginate(10, ['*'], 'product_page')->withQueryString();

        // Orders Pagination
        $orderSearch = request('order_search');
        $orderStatus = request('order_status', 'all');
        $orderDate = request('order_date');

        $ordersQuery = \App\Models\Order::with(['user', 'products', 'prescription', 'shippingMethod', 'statusHistories.changedByUser'])
            ->where(function($q) {
                $q->whereNull('prescription_id')
                  ->orWhereHas('prescription', function($pq) {
                      $pq->where('status_validasi', 'disetujui');
                  });
            })
            ->latest();
            
        $vtsQuery = \App\Models\VirtualTransaction::with(['user', 'prescription', 'pharmacist'])
            ->where(function($q) {
                $q->whereNull('prescription_id')
                  ->orWhereHas('prescription', function($pq) {
                      $pq->where('status_validasi', 'disetujui');
                  });
            })
            ->latest();

        if ($orderSearch) {
            $ordersQuery->where(function($q) use ($orderSearch) {
                $q->whereHas('user', function($uq) use ($orderSearch) {
                    $uq->where('name', 'like', "%{$orderSearch}%");
                })->orWhere('kode_pesanan', 'like', "%{$orderSearch}%");
            });
            $vtsQuery->where(function($q) use ($orderSearch) {
                $q->whereHas('user', function($uq) use ($orderSearch) {
                    $uq->where('name', 'like', "%{$orderSearch}%");
                })->orWhere('va_number', 'like', "%{$orderSearch}%");
            });
        }

        if ($orderStatus !== 'all') {
            $ordersQuery->where('status', $orderStatus);
            $statusMapVt = [
                'menunggu_pembayaran' => ['Pending', 'Belum Bayar'],
                'diproses' => ['Lunas'],
                'dikirim' => ['Dikirim'],
                'selesai' => ['Selesai'],
                'dibatalkan' => ['Dibatalkan']
            ];
            if (isset($statusMapVt[$orderStatus])) {
                $vtsQuery->whereIn('status', $statusMapVt[$orderStatus]);
            } else {
                $vtsQuery->where('status', 'not_existing_status');
            }
        } else {
            $ordersQuery->whereIn('status', ['diproses', 'dikirim', 'selesai']);
            $vtsQuery->whereIn('status', ['Lunas', 'Dikirim', 'Selesai']);
        }

        if ($orderDate) {
            $dates = explode(',', $orderDate);
            if (count($dates) == 2) {
                $ordersQuery->whereBetween('created_at', [$dates[0] . ' 00:00:00', $dates[1] . ' 23:59:59']);
                $vtsQuery->whereBetween('created_at', [$dates[0] . ' 00:00:00', $dates[1] . ' 23:59:59']);
            } else {
                $ordersQuery->whereDate('created_at', $dates[0]);
                $vtsQuery->whereDate('created_at', $dates[0]);
            }
        }

        $allRawOrders = $ordersQuery->get();
        $allRawVts = $vtsQuery->get();
        
        $mappedVts = $allRawVts->map(function ($vt) {
            $statusMap = [
                'Pending' => 'menunggu_pembayaran',
                'Belum Bayar' => 'menunggu_pembayaran',
                'Lunas' => 'diproses',
                'Dikirim' => 'dikirim',
                'Selesai' => 'selesai',
                'Dibatalkan' => 'dibatalkan'
            ];
            $mappedStatus = $statusMap[$vt->status] ?? strtolower($vt->status);

            return [
                'id' => 'vt_' . $vt->id,
                'kode_pesanan' => $vt->va_number ?? 'VT-' . $vt->id,
                'user' => $vt->user,
                'products' => collect($vt->items)->map(function ($item) {
                    return [
                        'id' => $item['id'] ?? $item['product_id'] ?? null,
                        'nama_obat' => $item['name'] ?? $item['nama'] ?? 'Produk',
                        'gambar' => $item['image'] ?? $item['gambar'] ?? null,
                        'stok' => ($p = \App\Models\Product::find($item['id'] ?? $item['product_id'] ?? null)) ? $p->stok : 0,
                        'pivot' => [
                            'kuantitas' => $item['quantity'] ?? 1,
                            'harga_satuan' => $item['price'] ?? $item['harga'] ?? 0,
                        ],
                    ];
                }),
                'prescription_id' => $vt->prescription_id,
                'prescription' => $vt->prescription,
                'status_histories' => $vt->pharmacist ? [
                    [
                        'status_sebelum' => 'menunggu_pembayaran',
                        'status_sesudah' => 'diproses',
                        'changed_by_user' => ['name' => $vt->pharmacist->name],
                        'created_at' => $vt->updated_at,
                    ]
                ] : [],
                'shippingMethod' => ['nama' => $vt->shipping_method, 'biaya' => $vt->shipping_cost],
                'status' => $mappedStatus,
                'total_biaya' => $vt->total_amount,
                'created_at' => $vt->created_at,
                'updated_at' => $vt->updated_at,
            ];
        });

        $allOrders = $allRawOrders->concat($mappedVts)->sortByDesc('created_at')->values();

        $orderPage = request()->get('order_page', 1);
        $perPage = 10;
        $paginatedOrders = new \Illuminate\Pagination\LengthAwarePaginator(
            $allOrders->forPage($orderPage, $perPage)->values(),
            $allOrders->count(),
            $perPage,
            $orderPage,
            ['path' => request()->url(), 'query' => request()->query(), 'pageName' => 'order_page']
        );

        $statusChanges = \App\Models\OrderStatusHistory::with(['order.user', 'changedByUser'])
            ->latest()
            ->take(30)
            ->get();

        // Analytics
        $todayStr = now()->format('Y-m-d');
        $totalResepHariIni = \App\Models\Prescription::whereDate('created_at', $todayStr)->count();
        $pesananHariIni = \App\Models\Order::whereDate('created_at', $todayStr)->count() + 
                          \App\Models\VirtualTransaction::whereDate('created_at', $todayStr)->count();
                          
        $pendingCount = \App\Models\Prescription::where('status_validasi', 'pending')->count();
        $approvedCount = \App\Models\Prescription::where('status_validasi', 'disetujui')->count();
        $rejectedCount = \App\Models\Prescription::where('status_validasi', 'ditolak')->count();

        $recentActivities = \App\Models\Prescription::whereIn('status_validasi', ['disetujui', 'ditolak'])
            ->latest('updated_at')
            ->take(5)
            ->get();
            
        $verifikasiFilterDays = request('verifikasi_days', 7);
        $chartData = [];
        $now = now();
        for ($i = $verifikasiFilterDays - 1; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            $count = \App\Models\Prescription::whereIn('status_validasi', ['disetujui', 'ditolak'])
                        ->whereDate('updated_at', $dateStr)
                        ->count();
            $chartData[] = [
                'day' => $date->translatedFormat('j M'),
                'value' => $count,
                'active' => $i === 0
            ];
        }

        $baseOrdersQuery = \App\Models\Order::where(function($q) {
            $q->whereNull('prescription_id')
              ->orWhereHas('prescription', function($pq) {
                  $pq->where('status_validasi', 'disetujui');
              });
        });
        
        $baseVtsQuery = \App\Models\VirtualTransaction::where(function($q) {
            $q->whereNull('prescription_id')
              ->orWhereHas('prescription', function($pq) {
                  $pq->where('status_validasi', 'disetujui');
              });
        });

        $orderCounts = [
            'all' => (clone $baseOrdersQuery)->whereIn('status', ['diproses', 'dikirim', 'selesai'])->count() + (clone $baseVtsQuery)->whereIn('status', ['Lunas', 'Dikirim', 'Selesai'])->count(),
            'diproses' => (clone $baseOrdersQuery)->where('status', 'diproses')->count() + (clone $baseVtsQuery)->where('status', 'Lunas')->count(),
            'dikirim' => (clone $baseOrdersQuery)->where('status', 'dikirim')->count() + (clone $baseVtsQuery)->where('status', 'Dikirim')->count(),
            'selesai' => (clone $baseOrdersQuery)->where('status', 'selesai')->count() + (clone $baseVtsQuery)->where('status', 'Selesai')->count(),
        ];

        $analytics = [
            'total_resep_hari_ini' => $totalResepHariIni,
            'pesanan_hari_ini' => $pesananHariIni,
            'pending_count' => $pendingCount,
            'approved_count' => $approvedCount,
            'rejected_count' => $rejectedCount,
            'recent_activities' => $recentActivities,
            'chart_data' => $chartData,
            'order_counts' => $orderCounts
        ];

        return Inertia::render('PharmacistDashboard', [
            'prescriptions' => $paginatedPrescriptions,
            'products' => $paginatedProducts,
            'orders' => $paginatedOrders,
            'statusChanges' => $statusChanges,
            'analytics' => $analytics
        ]);
    })->name('pharmacist.dashboard');

    Route::get('/pharmacist/orders/{id}', function ($id) {
        if (str_starts_with($id, 'vt_')) {
            $vtId = str_replace('vt_', '', $id);
            $vt = \App\Models\VirtualTransaction::with(['user', 'prescription', 'pharmacist'])->findOrFail($vtId);
            
            $statusMap = [
                'Pending' => 'menunggu_pembayaran',
                'Belum Bayar' => 'menunggu_pembayaran',
                'Lunas' => 'diproses',
                'Dikirim' => 'dikirim',
                'Selesai' => 'selesai',
                'Dibatalkan' => 'dibatalkan'
            ];
            $mappedStatus = $statusMap[$vt->status] ?? strtolower($vt->status);

            $order = [
                'id' => 'vt_' . $vt->id,
                'kode_pesanan' => $vt->va_number ?? 'VT-' . $vt->id,
                'user' => $vt->user,
                'payment_method' => $vt->payment_method,
                'shipping_address' => $vt->shipping_address,
                'products' => collect($vt->items)->map(function ($item) {
                    return [
                        'id' => $item['id'] ?? $item['product_id'] ?? null,
                        'nama_obat' => $item['name'] ?? $item['nama'] ?? 'Produk',
                        'gambar' => $item['image'] ?? $item['gambar'] ?? null,
                        'stok' => ($p = \App\Models\Product::find($item['id'] ?? $item['product_id'] ?? null)) ? $p->stok : 0,
                        'pivot' => [
                            'kuantitas' => $item['quantity'] ?? 1,
                            'harga_satuan' => $item['price'] ?? $item['harga'] ?? 0,
                        ],
                    ];
                }),
                'prescription' => $vt->prescription,
                'status_histories' => (function() use ($vt, $mappedStatus) {
                    $histories = [];
                    if ($vt->pharmacist && in_array($mappedStatus, ['diproses', 'dikirim', 'selesai', 'dibatalkan'])) {
                        $histories[] = [
                            'status_sebelum' => 'menunggu_pembayaran',
                            'status_sesudah' => 'diproses',
                            'changed_by_user' => ['name' => $vt->pharmacist->name],
                            'created_at' => $vt->updated_at,
                        ];
                    }
                    if ($vt->pharmacist && in_array($mappedStatus, ['dikirim', 'selesai'])) {
                        $histories[] = [
                            'status_sebelum' => 'diproses',
                            'status_sesudah' => 'dikirim',
                            'changed_by_user' => ['name' => 'Admin Apotek'],
                            'created_at' => clone $vt->updated_at,
                        ];
                    }
                    if ($vt->pharmacist && in_array($mappedStatus, ['selesai'])) {
                        $histories[] = [
                            'status_sebelum' => 'dikirim',
                            'status_sesudah' => 'selesai',
                            'changed_by_user' => ['name' => 'Admin Apotek'],
                            'created_at' => clone $vt->updated_at,
                        ];
                    }
                    return array_reverse($histories);
                })(),
                'shippingMethod' => ['nama' => $vt->shipping_method, 'biaya' => $vt->shipping_cost],
                'status' => $mappedStatus,
                'total_biaya' => $vt->total_amount,
                'created_at' => $vt->created_at,
                'updated_at' => $vt->updated_at,
            ];
        } else {
            $order = \App\Models\Order::with(['user', 'products', 'prescription', 'statusHistories.changedByUser'])->findOrFail($id);
        }

        return Inertia::render('PharmacistOrderDetail', [
            'order' => $order
        ]);
    })->name('pharmacist.orders.show');

    Route::put('/pharmacist/prescriptions/{id}', function(\Illuminate\Http\Request $request, $id) {
        $prescription = \App\Models\Prescription::findOrFail($id);
        
        $request->validate([
            'status_validasi' => 'required|in:pending,disetujui,ditolak',
        ]);

        $updateData = [
            'status_validasi' => $request->status_validasi,
            'catatan_apoteker' => $request->catatan_apoteker,
            'rejection_reason' => $request->rejection_reason,
            'verifier_name' => auth()->user()->name,
            'validated_by' => auth()->id(),
            'validated_at' => now(),
        ];

        if ($request->status_validasi === 'disetujui') {
            $updateData['doctor_name'] = $request->doctor_name;
            $updateData['nama_dokter'] = $request->doctor_name;
            $updateData['doctor_poli'] = $request->doctor_poli;
            $updateData['doctor_ppk'] = $request->doctor_ppk;
            $updateData['doctor_alamat'] = $request->doctor_alamat;
            $updateData['tanggal_resep'] = $request->tanggal_resep;
            $updateData['sip_dokter'] = $request->sip_dokter;
            $updateData['total_biaya'] = $request->total_biaya;
            
            if ($request->has('items') && is_array($request->items)) {
                $prescription->items()->delete();
                foreach ($request->items as $item) {
                    $prescription->items()->create([
                        'product_id' => $item['product_id'] ?? null,
                        'product_name' => $item['product_name'] ?? null,
                        'is_racikan' => $item['is_racikan'] ?? false,
                        'kuantitas_resep' => $item['kuantitas_resep'] ?? 0,
                        'kuantitas_ambil' => $item['kuantitas_ambil'] ?? 0,
                        'satuan' => $item['satuan'] ?? null,
                        'signa' => $item['signa'] ?? null,
                        'harga_satuan' => $item['harga_satuan'] ?? 0,
                        'subtotal' => $item['subtotal'] ?? 0,
                    ]);
                }
            }
        }

        $prescription->update($updateData);

        return back()->with('success', 'Validasi resep berhasil disimpan');
    })->name('pharmacist.prescriptions.update');



    Route::put('/pharmacist/orders/{id}/status', function(\Illuminate\Http\Request $request, $id) {
        $request->validate(['status' => 'required|string|in:pending,diproses,dikirim,selesai,dibatalkan']);
        
        if (str_starts_with($id, 'vt_')) {
            $vtId = str_replace('vt_', '', $id);
            $vt = \App\Models\VirtualTransaction::findOrFail($vtId);
            $statusMap = [
                'menunggu_pembayaran' => 'Pending',
                'diproses' => 'Lunas',
                'dikirim' => 'Dikirim',
                'selesai' => 'Selesai',
                'dibatalkan' => 'Dibatalkan'
            ];
            $newStatus = $statusMap[$request->status] ?? 'Pending';
            $vt->update(['status' => $newStatus, 'pharmacist_id' => auth()->id()]);
            return back()->with('success', 'Status pesanan virtual berhasil diperbarui');
        }

        $order = \App\Models\Order::findOrFail($id);
        $statusSebelum = $order->status;
        $order->update(['status' => $request->status]);

        \App\Models\OrderStatusHistory::create([
            'order_id' => $order->id,
            'changed_by' => auth()->id(),
            'status_sebelum' => $statusSebelum,
            'status_sesudah' => $request->status,
            'keterangan' => 'Status diubah oleh apoteker: ' . auth()->user()->name
        ]);

        return back()->with('success', 'Status pesanan berhasil diperbarui');
    })->name('pharmacist.orders.status');

    Route::post('/pharmacist/settings/profile', function(\Illuminate\Http\Request $request) {
        $user = auth()->user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'avatar' => 'nullable|image|max:2048'
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        
        if ($request->filled('password')) {
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->save();

        return back()->with('success', 'Profil berhasil diperbarui');
    })->name('pharmacist.settings.update');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', function () {
        $categories = \App\Models\Category::all();
        $symptoms = \App\Models\Symptom::all();

        // Products Pagination
        $productSearch = request('product_search');
        $productCategory = request('product_category', 'all');
        $productsQuery = \App\Models\Product::with(['category', 'symptoms'])
            ->select('products.*')
            ->selectRaw('(SELECT COALESCE(SUM(order_items.kuantitas), 0) FROM order_items JOIN orders ON orders.id = order_items.order_id WHERE order_items.product_id = products.id AND orders.status = "selesai") as sales');
            
        if ($productSearch) {
            $productsQuery->where('nama_obat', 'like', "%{$productSearch}%");
        }
        if ($productCategory !== 'all') {
            $productsQuery->where('jenis_obat', $productCategory);
        }
        $paginatedProducts = $productsQuery->latest()->paginate(10, ['*'], 'product_page')->withQueryString();

        // Users Pagination
        $userSearch = request('user_search');
        $userRole = request('user_role', 'all');
        $usersQuery = \App\Models\User::query();
        if ($userSearch) {
            $usersQuery->where(function($q) use ($userSearch) {
                $q->where('name', 'like', "%{$userSearch}%")
                  ->orWhere('email', 'like', "%{$userSearch}%");
            });
        }
        if ($userRole !== 'all') {
            $usersQuery->where('role', $userRole);
        }
        $paginatedUsers = $usersQuery->latest()->paginate(10, ['*'], 'user_page')->withQueryString();

        // Orders Pagination
        $orderSearch = request('order_search');
        $orderStatus = request('order_status', 'all');
        $orderDate = request('order_date');

        $ordersQuery = \App\Models\Order::with(['user', 'products', 'prescription', 'shippingMethod', 'statusHistories.changedByUser'])->latest();
        $vtsQuery = \App\Models\VirtualTransaction::with(['user', 'prescription', 'pharmacist'])->latest();

        if ($orderSearch) {
            $ordersQuery->where(function($q) use ($orderSearch) {
                $q->whereHas('user', function($uq) use ($orderSearch) {
                    $uq->where('name', 'like', "%{$orderSearch}%");
                })->orWhere('kode_pesanan', 'like', "%{$orderSearch}%");
            });
            $vtsQuery->where(function($q) use ($orderSearch) {
                $q->whereHas('user', function($uq) use ($orderSearch) {
                    $uq->where('name', 'like', "%{$orderSearch}%");
                })->orWhere('va_number', 'like', "%{$orderSearch}%");
            });
        }

        if ($orderStatus !== 'all') {
            $ordersQuery->where('status', $orderStatus);
            $statusMapVt = [
                'menunggu_pembayaran' => ['Pending', 'Belum Bayar'],
                'diproses' => ['Lunas'],
                'dikirim' => ['Dikirim'],
                'selesai' => ['Selesai'],
                'dibatalkan' => ['Dibatalkan']
            ];
            if (isset($statusMapVt[$orderStatus])) {
                $vtsQuery->whereIn('status', $statusMapVt[$orderStatus]);
            } else {
                $vtsQuery->where('status', 'not_existing_status');
            }
        }

        if ($orderDate) {
            $dates = explode(',', $orderDate);
            if (count($dates) == 2) {
                $ordersQuery->whereBetween('created_at', [$dates[0] . ' 00:00:00', $dates[1] . ' 23:59:59']);
                $vtsQuery->whereBetween('created_at', [$dates[0] . ' 00:00:00', $dates[1] . ' 23:59:59']);
            } else {
                $ordersQuery->whereDate('created_at', $dates[0]);
                $vtsQuery->whereDate('created_at', $dates[0]);
            }
        }

        $allRawOrders = $ordersQuery->get();
        $allRawVts = $vtsQuery->get();
        
        $mappedVts = $allRawVts->map(function ($vt) {
            $statusMap = [
                'Pending' => 'menunggu_pembayaran',
                'Belum Bayar' => 'menunggu_pembayaran',
                'Lunas' => 'diproses',
                'Dikirim' => 'dikirim',
                'Selesai' => 'selesai',
                'Dibatalkan' => 'dibatalkan'
            ];
            $mappedStatus = $statusMap[$vt->status] ?? strtolower($vt->status);

            return [
                'id' => 'vt_' . $vt->id,
                'kode_pesanan' => $vt->va_number ?? 'VT-' . $vt->id,
                'user' => $vt->user,
                'products' => collect($vt->items)->map(function ($item) {
                    return [
                        'id' => $item['id'] ?? $item['product_id'] ?? null,
                        'nama_obat' => $item['name'] ?? $item['nama'] ?? 'Produk',
                        'gambar' => $item['image'] ?? $item['gambar'] ?? null,
                        'stok' => ($p = \App\Models\Product::find($item['id'] ?? $item['product_id'] ?? null)) ? $p->stok : 0,
                        'pivot' => [
                            'kuantitas' => $item['quantity'] ?? 1,
                            'harga_satuan' => $item['price'] ?? $item['harga'] ?? 0,
                        ],
                    ];
                }),
                'prescription_id' => $vt->prescription_id,
                'prescription' => $vt->prescription,
                'status_histories' => $vt->pharmacist ? [
                    [
                        'status_sebelum' => 'menunggu_pembayaran',
                        'status_sesudah' => 'diproses',
                        'changed_by_user' => ['name' => $vt->pharmacist->name],
                        'created_at' => $vt->updated_at,
                    ]
                ] : [],
                'shippingMethod' => ['nama' => $vt->shipping_method, 'biaya' => $vt->shipping_cost],
                'status' => $mappedStatus,
                'total_biaya' => $vt->total_amount,
                'created_at' => $vt->created_at,
                'updated_at' => $vt->updated_at,
            ];
        });

        $allOrders = $allRawOrders->concat($mappedVts)->sortByDesc('created_at')->values();

        $orderPage = request()->get('order_page', 1);
        $perPage = 10;
        $paginatedOrders = new \Illuminate\Pagination\LengthAwarePaginator(
            $allOrders->forPage($orderPage, $perPage)->values(),
            $allOrders->count(),
            $perPage,
            $orderPage,
            ['path' => request()->url(), 'query' => request()->query(), 'pageName' => 'order_page']
        );

        $statusChanges = \App\Models\OrderStatusHistory::with(['order.user', 'changedByUser'])
            ->latest()
            ->take(30)
            ->get();
            
        $today = now()->startOfDay();
        $thisMonth = now()->startOfMonth();

        $incomeToday = \App\Models\Order::where('status', 'selesai')->where('created_at', '>=', $today)->sum('total_biaya') + 
                       \App\Models\VirtualTransaction::where('status', 'Selesai')->where('created_at', '>=', $today)->sum('total_amount');
                       
        $incomeThisMonth = \App\Models\Order::where('status', 'selesai')->where('created_at', '>=', $thisMonth)->sum('total_biaya') + 
                           \App\Models\VirtualTransaction::where('status', 'Selesai')->where('created_at', '>=', $thisMonth)->sum('total_amount');
                           
        $incomeAllTime = \App\Models\Order::where('status', 'selesai')->sum('total_biaya') + 
                         \App\Models\VirtualTransaction::where('status', 'Selesai')->sum('total_amount');

        $totalPrescriptionsVerified = \App\Models\Prescription::where('status_validasi', 'disetujui')->count();
        $totalPrescriptionsRejected = \App\Models\Prescription::where('status_validasi', 'ditolak')->count();

        // Calculate revenue for chart (e.g. last 7, 30, 90 days)
        $revenueDays = request('revenue_days', 7);
        $revenueChartData = [];
        $now = now();
        for ($i = $revenueDays - 1; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            
            $dayTotalOrders = \App\Models\Order::where('status', 'selesai')
                ->whereDate('created_at', $dateStr)
                ->sum('total_biaya');
                
            $dayTotalVts = \App\Models\VirtualTransaction::where('status', 'Selesai')
                ->whereDate('created_at', $dateStr)
                ->sum('total_amount');
                
            $revenueChartData[] = [
                'date' => $date->translatedFormat('j M'),
                'total' => $dayTotalOrders + $dayTotalVts
            ];
        }

        // Calculate top products
        $topProducts = \App\Models\Product::select('products.id', 'products.nama_obat', 'products.harga', 'products.gambar')
            ->selectRaw('COALESCE(SUM(order_items.kuantitas), 0) as sales')
            ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'selesai')
            ->groupBy('products.id', 'products.nama_obat', 'products.harga', 'products.gambar')
            ->orderByDesc('sales')
            ->take(5)
            ->get();

        $baseAdminOrdersQuery = \App\Models\Order::query();
        $baseAdminVtsQuery = \App\Models\VirtualTransaction::query();

        $orderCounts = [
            'all' => $baseAdminOrdersQuery->count() + $baseAdminVtsQuery->count(),
            'menunggu_pembayaran' => (clone $baseAdminOrdersQuery)->where('status', 'menunggu_pembayaran')->count() + (clone $baseAdminVtsQuery)->whereIn('status', ['Pending', 'Belum Bayar'])->count(),
            'diproses' => (clone $baseAdminOrdersQuery)->where('status', 'diproses')->count() + (clone $baseAdminVtsQuery)->where('status', 'Lunas')->count(),
            'dikirim' => (clone $baseAdminOrdersQuery)->where('status', 'dikirim')->count() + (clone $baseAdminVtsQuery)->where('status', 'Dikirim')->count(),
            'selesai' => (clone $baseAdminOrdersQuery)->where('status', 'selesai')->count() + (clone $baseAdminVtsQuery)->where('status', 'Selesai')->count(),
            'dibatalkan' => (clone $baseAdminOrdersQuery)->where('status', 'dibatalkan')->count() + (clone $baseAdminVtsQuery)->where('status', 'Dibatalkan')->count(),
        ];

        $analytics = [
            'income_today' => $incomeToday,
            'income_this_month' => $incomeThisMonth,
            'income_all_time' => $incomeAllTime,
            'prescriptions_verified' => $totalPrescriptionsVerified,
            'prescriptions_rejected' => $totalPrescriptionsRejected,
            'revenue_chart_data' => $revenueChartData,
            'top_products' => $topProducts,
            'order_counts' => $orderCounts
        ];
        
        $userCount = \App\Models\User::count();
        $adminCount = \App\Models\User::where('role', 'admin')->count();
        $pharmacistCount = \App\Models\User::where('role', 'pharmacist')->count();
        $customerCount = \App\Models\User::where('role', 'user')->count();
        
        $analytics['user_counts'] = [
            'total' => $userCount,
            'admin' => $adminCount,
            'pharmacist' => $pharmacistCount,
            'customer' => $customerCount
        ];

        $analytics['critical_stock_products'] = \App\Models\Product::whereRaw('stok <= COALESCE(stok_minimum, 10)')->get();

        return Inertia::render('AdminDashboard', [
            'products' => $paginatedProducts,
            'categories' => $categories,
            'users' => $paginatedUsers,
            'symptoms' => $symptoms,
            'orders' => $paginatedOrders,
            'statusChanges' => $statusChanges,
            'analytics' => $analytics
        ]);
    })->name('admin.dashboard');

    Route::get('/admin/orders/{id}', function ($id) {
        if (str_starts_with($id, 'vt_')) {
            $vtId = str_replace('vt_', '', $id);
            $vt = \App\Models\VirtualTransaction::with(['user', 'prescription', 'pharmacist'])->findOrFail($vtId);
            
            $statusMap = [
                'Pending' => 'menunggu_pembayaran',
                'Belum Bayar' => 'menunggu_pembayaran',
                'Lunas' => 'diproses',
                'Dikirim' => 'dikirim',
                'Selesai' => 'selesai',
                'Dibatalkan' => 'dibatalkan'
            ];
            $mappedStatus = $statusMap[$vt->status] ?? strtolower($vt->status);

            $order = [
                'id' => 'vt_' . $vt->id,
                'kode_pesanan' => $vt->va_number ?? 'VT-' . $vt->id,
                'user' => $vt->user,
                'payment_method' => $vt->payment_method,
                'shipping_address' => $vt->shipping_address,
                'products' => collect($vt->items)->map(function ($item) {
                    return [
                        'id' => $item['id'] ?? $item['product_id'] ?? null,
                        'nama_obat' => $item['name'] ?? $item['nama'] ?? 'Produk',
                        'gambar' => $item['image'] ?? $item['gambar'] ?? null,
                        'stok' => ($p = \App\Models\Product::find($item['id'] ?? $item['product_id'] ?? null)) ? $p->stok : 0,
                        'pivot' => [
                            'kuantitas' => $item['quantity'] ?? 1,
                            'harga_satuan' => $item['price'] ?? $item['harga'] ?? 0,
                        ],
                    ];
                }),
                'prescription' => $vt->prescription,
                'status_histories' => (function() use ($vt, $mappedStatus) {
                    $histories = [];
                    if ($vt->pharmacist && in_array($mappedStatus, ['diproses', 'dikirim', 'selesai', 'dibatalkan'])) {
                        $histories[] = [
                            'status_sebelum' => 'menunggu_pembayaran',
                            'status_sesudah' => 'diproses',
                            'changed_by_user' => ['name' => $vt->pharmacist->name],
                            'created_at' => $vt->updated_at,
                        ];
                    }
                    if ($vt->pharmacist && in_array($mappedStatus, ['dikirim', 'selesai'])) {
                        $histories[] = [
                            'status_sebelum' => 'diproses',
                            'status_sesudah' => 'dikirim',
                            'changed_by_user' => ['name' => 'Admin Apotek'],
                            'created_at' => clone $vt->updated_at,
                        ];
                    }
                    if ($vt->pharmacist && in_array($mappedStatus, ['selesai'])) {
                        $histories[] = [
                            'status_sebelum' => 'dikirim',
                            'status_sesudah' => 'selesai',
                            'changed_by_user' => ['name' => 'Admin Apotek'],
                            'created_at' => clone $vt->updated_at,
                        ];
                    }
                    return array_reverse($histories);
                })(),
                'shippingMethod' => ['nama' => $vt->shipping_method, 'biaya' => $vt->shipping_cost],
                'status' => $mappedStatus,
                'total_biaya' => $vt->total_amount,
                'created_at' => $vt->created_at,
                'updated_at' => $vt->updated_at,
            ];
        } else {
            $order = \App\Models\Order::with(['user', 'products', 'prescription', 'statusHistories.changedByUser'])->findOrFail($id);
        }

        return Inertia::render('AdminOrderDetail', [
            'order' => $order
        ]);
    })->name('admin.orders.show');

    Route::get('/admin/settings', function () {
        return Inertia::render('AdminSettings');
    })->name('admin.settings');

    Route::get('/admin/pharmacy-info', function () {
        $settings = \Illuminate\Support\Facades\DB::table('apotek_settings')->get()->pluck('value', 'key');
        $globalDiscount = \Illuminate\Support\Facades\Cache::get('global_discount', 0);
        return Inertia::render('AdminPharmacyInfo', [
            'apotekSettings' => [
                'deskripsi'       => $settings->get('deskripsi', ''),
                'alamat'          => $settings->get('alamat', ''),
                'jam_operasional' => $settings->get('jam_operasional', ''),
                'kontak'          => $settings->get('kontak', ''),
            ],
            'globalDiscount' => $globalDiscount,
        ]);
    })->name('admin.pharmacy-info');

    Route::post('/admin/pharmacy-info', function (\Illuminate\Http\Request $request) {
        $request->validate([
            'deskripsi'       => 'nullable|string|max:2000',
            'alamat'          => 'nullable|string|max:500',
            'jam_operasional' => 'nullable|string|max:200',
            'kontak'          => 'nullable|string|max:100',
        ]);

        $fields = ['deskripsi', 'alamat', 'jam_operasional', 'kontak'];
        foreach ($fields as $field) {
            \Illuminate\Support\Facades\DB::table('apotek_settings')->updateOrInsert(
                ['key' => $field],
                ['value' => $request->input($field, ''), 'updated_at' => now()]
            );
        }

        return back()->with('success', 'Informasi Apotek berhasil disimpan.');
    })->name('admin.pharmacy-info.save');

    Route::post('/admin/settings/discount', function(\Illuminate\Http\Request $request) {
        $request->validate(['discount' => 'required|numeric|min:0']);
        \Illuminate\Support\Facades\Cache::forever('global_discount', $request->discount);
        return back()->with('success', 'Potongan harga global berhasil diperbarui');
    })->name('admin.settings.discount');

    Route::post('/admin/settings/profile', function(\Illuminate\Http\Request $request) {
        $user = auth()->user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'avatar' => 'nullable|image|max:2048'
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        
        if ($request->filled('password')) {
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->save();

        return back()->with('success', 'Profil berhasil diperbarui');
    })->name('admin.settings.update');

    Route::put('/admin/products/{id}/stock', [ProductController::class, 'updateStock'])->name('admin.products.update_stock');

    Route::get('/admin/products/create', [ProductController::class, 'create'])->name('admin.products.create');
    Route::post('/admin/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/admin/products/{id}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
    Route::put('/admin/products/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::post('/admin/products/{id}', [ProductController::class, 'update'])->name('products.update_post');
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::post('/admin/products/{id}/image', [ProductController::class, 'updateImage'])->name('products.updateImage');

    Route::post('/admin/users', [AdminUserController::class, 'store'])->name('admin.users.store');
    Route::put('/admin/users/{id}', [AdminUserController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');

    Route::put('/admin/orders/{id}/status', function(\Illuminate\Http\Request $request, $id) {
        $request->validate(['status' => 'required|string|in:diproses,dikirim,selesai,dibatalkan']);
        
        if (str_starts_with($id, 'vt_')) {
            $vtId = str_replace('vt_', '', $id);
            $vt = \App\Models\VirtualTransaction::findOrFail($vtId);
            $statusMap = [
                'menunggu_pembayaran' => 'Pending',
                'diproses' => 'Lunas',
                'dikirim' => 'Dikirim',
                'selesai' => 'Selesai',
                'dibatalkan' => 'Dibatalkan'
            ];
            $newStatus = $statusMap[$request->status] ?? 'Pending';
            $vt->update(['status' => $newStatus, 'pharmacist_id' => auth()->id()]);
            return back()->with('success', 'Status pesanan virtual berhasil diperbarui');
        }

        $order = \App\Models\Order::findOrFail($id);
        $statusSebelum = $order->status;
        $order->update(['status' => $request->status]);

        \App\Models\OrderStatusHistory::create([
            'order_id' => $order->id,
            'changed_by' => auth()->id(),
            'status_sebelum' => $statusSebelum,
            'status_sesudah' => $request->status,
            'keterangan' => 'Status diubah oleh admin: ' . auth()->user()->name
        ]);

        return back()->with('success', 'Status pesanan berhasil diperbarui');
    })->name('admin.orders.status');
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->role === 'admin') {
        return redirect('/admin');
    } elseif ($user->role === 'pharmacist') {
        return redirect('/pharmacist');
    }
    return redirect('/');
})->middleware(['auth'])->name('dashboard');

// Manajemen Akun Pengguna / Profile Settings
Route::middleware('auth')->group(function () {
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';