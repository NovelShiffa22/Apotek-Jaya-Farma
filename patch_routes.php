<?php
$file = 'e:\NGODING\Laravel\Apotek-Jaya-Farma\routes\web.php';
$content = file_get_contents($file);

// Replace Pharmacist Route
$pharmacistOld = <<<'EOD'
// Ruang Portal Kerja Manajemen (Dashboard)
Route::middleware(['auth', 'role:pharmacist'])->group(function () {
    Route::get('/pharmacist', function () {
        $prescriptions = \App\Models\Prescription::with(['user.addresses', 'items.product', 'validator'])->latest()->get();
        $products = \App\Models\Product::with(['category', 'symptoms'])->latest()->get();
        
        $orders = \App\Models\Order::with(['user', 'products', 'prescription', 'statusHistories.changedByUser'])->latest()->get();
        $vts = \App\Models\VirtualTransaction::with(['user', 'prescription', 'pharmacist'])->latest()->get();
        
        $mappedVts = $vts->map(function ($vt) {
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
                'prescription' => $vt->prescription,
                'status_histories' => $vt->pharmacist ? [
                    [
                        'status_sebelum' => 'menunggu_pembayaran',
                        'status_sesudah' => 'diproses',
                        'changed_by_user' => ['name' => $vt->pharmacist->name],
                        'created_at' => $vt->updated_at,
                    ]
                ] : [],
                'status' => $mappedStatus,
                'total_biaya' => $vt->total_amount,
                'created_at' => $vt->created_at,
                'updated_at' => $vt->updated_at,
            ];
        });

        $allOrders = $orders->concat($mappedVts)->sortByDesc('created_at')->values();

        $statusChanges = \App\Models\OrderStatusHistory::with(['order.user', 'changedByUser'])
            ->latest()
            ->take(30)
            ->get();

        return Inertia::render('PharmacistDashboard', [
            'prescriptions' => $prescriptions,
            'products' => $products,
            'orders' => $allOrders,
            'statusChanges' => $statusChanges
        ]);
    })->name('pharmacist.dashboard');
EOD;

$pharmacistNew = <<<'EOD'
// Ruang Portal Kerja Manajemen (Dashboard)
Route::middleware(['auth', 'role:pharmacist'])->group(function () {
    Route::get('/pharmacist', function () {
        // Prescriptions Pagination
        $prescriptionsQuery = \App\Models\Prescription::with(['user.addresses', 'items.product', 'validator'])->latest();

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
            $prescriptionsQuery->whereDate('created_at', $prescriptionDate);
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

        $ordersQuery = \App\Models\Order::with(['user', 'products', 'prescription', 'statusHistories.changedByUser'])->latest();
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
            $ordersQuery->whereDate('created_at', $orderDate);
            $vtsQuery->whereDate('created_at', $orderDate);
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
                'prescription' => $vt->prescription,
                'status_histories' => $vt->pharmacist ? [
                    [
                        'status_sebelum' => 'menunggu_pembayaran',
                        'status_sesudah' => 'diproses',
                        'changed_by_user' => ['name' => $vt->pharmacist->name],
                        'created_at' => $vt->updated_at,
                    ]
                ] : [],
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

        $analytics = [
            'total_resep_hari_ini' => $totalResepHariIni,
            'pesanan_hari_ini' => $pesananHariIni,
            'pending_count' => $pendingCount,
            'approved_count' => $approvedCount,
            'rejected_count' => $rejectedCount,
            'recent_activities' => $recentActivities,
            'chart_data' => $chartData
        ];

        return Inertia::render('PharmacistDashboard', [
            'prescriptions' => $paginatedPrescriptions,
            'products' => $paginatedProducts,
            'orders' => $paginatedOrders,
            'statusChanges' => $statusChanges,
            'analytics' => $analytics
        ]);
    })->name('pharmacist.dashboard');
EOD;

$content = str_replace($pharmacistOld, $pharmacistNew, $content);

// Replace Admin Route
$adminOld = <<<'EOD'
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', function () {
        $products = \App\Models\Product::with(['category', 'symptoms'])->latest()->get();
        $categories = \App\Models\Category::all();
        $users = \App\Models\User::all();
        $symptoms = \App\Models\Symptom::all();
        
        $orders = \App\Models\Order::with(['user', 'products', 'prescription', 'statusHistories.changedByUser'])->latest()->get();
        $vts = \App\Models\VirtualTransaction::with(['user', 'prescription', 'pharmacist'])->latest()->get();
        
        $mappedVts = $vts->map(function ($vt) {
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
                'prescription' => $vt->prescription,
                'status_histories' => $vt->pharmacist ? [
                    [
                        'status_sebelum' => 'menunggu_pembayaran',
                        'status_sesudah' => 'diproses',
                        'changed_by_user' => ['name' => $vt->pharmacist->name],
                        'created_at' => $vt->updated_at,
                    ]
                ] : [],
                'status' => $mappedStatus,
                'total_biaya' => $vt->total_amount,
                'created_at' => $vt->created_at,
                'updated_at' => $vt->updated_at,
            ];
        });

        $allOrders = $orders->concat($mappedVts)->sortByDesc('created_at')->values();

        $statusChanges = \App\Models\OrderStatusHistory::with(['order.user', 'changedByUser'])
            ->latest()
            ->take(30)
            ->get();
            
        $today = now()->startOfDay();
        $thisMonth = now()->startOfMonth();

        $completedOrders = $orders->where('status', 'selesai');
        $completedVts = $vts->where('status', 'Selesai');

        $incomeToday = $completedOrders->where('created_at', '>=', $today)->sum('total_biaya') + 
                       $completedVts->where('created_at', '>=', $today)->sum('total_amount');
                       
        $incomeThisMonth = $completedOrders->where('created_at', '>=', $thisMonth)->sum('total_biaya') + 
                           $completedVts->where('created_at', '>=', $thisMonth)->sum('total_amount');
                           
        $incomeAllTime = $completedOrders->sum('total_biaya') + $completedVts->sum('total_amount');

        $totalPrescriptionsVerified = \App\Models\Prescription::where('status_validasi', 'disetujui')->count();
        $totalPrescriptionsRejected = \App\Models\Prescription::where('status_validasi', 'ditolak')->count();

        $analytics = [
            'income_today' => $incomeToday,
            'income_this_month' => $incomeThisMonth,
            'income_all_time' => $incomeAllTime,
            'prescriptions_verified' => $totalPrescriptionsVerified,
            'prescriptions_rejected' => $totalPrescriptionsRejected,
        ];
        
        return Inertia::render('AdminDashboard', [
            'products' => $products,
            'categories' => $categories,
            'users' => $users,
            'symptoms' => $symptoms,
            'orders' => $allOrders,
            'statusChanges' => $statusChanges,
            'analytics' => $analytics
        ]);
    })->name('admin.dashboard');
EOD;

$adminNew = <<<'EOD'
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

        $ordersQuery = \App\Models\Order::with(['user', 'products', 'prescription', 'statusHistories.changedByUser'])->latest();
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
            $ordersQuery->whereDate('created_at', $orderDate);
            $vtsQuery->whereDate('created_at', $orderDate);
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
                'prescription' => $vt->prescription,
                'status_histories' => $vt->pharmacist ? [
                    [
                        'status_sebelum' => 'menunggu_pembayaran',
                        'status_sesudah' => 'diproses',
                        'changed_by_user' => ['name' => $vt->pharmacist->name],
                        'created_at' => $vt->updated_at,
                    ]
                ] : [],
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

        $analytics = [
            'income_today' => $incomeToday,
            'income_this_month' => $incomeThisMonth,
            'income_all_time' => $incomeAllTime,
            'prescriptions_verified' => $totalPrescriptionsVerified,
            'prescriptions_rejected' => $totalPrescriptionsRejected,
            'revenue_chart_data' => $revenueChartData,
            'top_products' => $topProducts
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
EOD;

$content = str_replace($adminOld, $adminNew, $content);
file_put_contents($file, $content);
echo "Routes updated successfully.\n";
