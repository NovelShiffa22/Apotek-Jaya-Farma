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
    $featuredProducts = \App\Models\Product::with(['category', 'symptoms'])->inRandomOrder()->take(6)->get();
    return Inertia::render('Home', [
        'featuredProducts' => $featuredProducts
    ]);
});

Route::get('/catalog', [ProductController::class, 'index'])->name('catalog.index');

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
    Route::get('/', [\App\Http\Controllers\PrescriptionController::class, 'index'])->middleware('auth')->name('index');
    Route::get('/upload/step-1', function() { return Inertia::render('Prescriptions/UploadStep1'); })->name('upload.step1');
    Route::get('/upload/step-2', function() { 
        $defaultAddress = \App\Models\Address::where('user_id', auth()->id())->where('is_default', true)->first() 
                       ?? \App\Models\Address::where('user_id', auth()->id())->first();
        return Inertia::render('Prescriptions/UploadStep2', [
            'defaultAddress' => $defaultAddress
        ]); 
    })->name('upload.step2');
    Route::get('/upload/step-3', function() { return Inertia::render('Prescriptions/UploadStep3'); })->name('upload.step3');
    Route::get('/{id}', [\App\Http\Controllers\PrescriptionController::class, 'show'])->name('detail');
    Route::post('/', [\App\Http\Controllers\PrescriptionController::class, 'store'])->middleware('auth')->name('store');
});

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout/proses', [CheckoutController::class, 'process'])->name('checkout.proses');

Route::get('/invoice/{id}', [CheckoutController::class, 'invoice'])->name('order.invoice');
Route::post('/invoice/{id}/simulasi-bayar', [CheckoutController::class, 'simulatePayment'])->name('order.simulate_payment');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::put('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [CartController::class, 'remove'])->name('cart.remove');

Route::get('/profile', function () {
    $orders = \App\Models\VirtualTransaction::where('user_id', auth()->id())->latest()->get();
    $addresses = \App\Models\Address::where('user_id', auth()->id())->latest()->get();
    return Inertia::render('Profile', [
        'user' => auth()->user(),
        'orders' => $orders,
        'addresses' => $addresses
    ]);
})->middleware(['auth', 'role:user'])->name('profile');

Route::middleware(['auth', 'role:user'])->group(function () {
    Route::patch('/profile/update', [\App\Http\Controllers\ProfileController::class, 'updateProfile'])->name('profile.update_info');
    Route::post('/profile/address', [\App\Http\Controllers\ProfileController::class, 'storeAlamat'])->name('address.store');
    Route::patch('/profile/address/{id}/utama', [\App\Http\Controllers\ProfileController::class, 'setUtama'])->name('address.set_utama');
});

// Ruang Portal Kerja Manajemen (Dashboard)
Route::middleware(['auth', 'role:pharmacist'])->group(function () {
    Route::get('/pharmacist', function () {
        $prescriptions = \App\Models\Prescription::with(['user', 'items.product'])->latest()->get();
        $products = \App\Models\Product::all();
        $orders = \App\Models\Order::with(['user', 'products', 'prescription'])->latest()->get();

        return Inertia::render('PharmacistDashboard', [
            'prescriptions' => $prescriptions,
            'products' => $products,
            'orders' => $orders
        ]);
    })->name('pharmacist.dashboard');

    Route::put('/pharmacist/prescriptions/{id}', function(\Illuminate\Http\Request $request, $id) {
        $prescription = \App\Models\Prescription::findOrFail($id);
        
        $request->validate([
            'status_validasi' => 'required|in:pending,disetujui,ditolak',
        ]);

        $prescription->update([
            'status_validasi' => $request->status_validasi,
            'doctor_name' => $request->doctor_name,
            'doctor_poli' => $request->doctor_poli,
            'doctor_ppk' => $request->doctor_ppk,
            'doctor_alamat' => $request->doctor_alamat,
            'total_biaya' => $request->total_biaya,
            'catatan_apoteker' => $request->catatan_apoteker,
            'validated_by' => auth()->id(),
            'validated_at' => now(),
        ]);

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

        return back()->with('success', 'Validasi resep berhasil disimpan');
    })->name('pharmacist.prescriptions.update');

    Route::put('/pharmacist/products/{id}', function(\Illuminate\Http\Request $request, $id) {
        $product = \App\Models\Product::findOrFail($id);
        
        $request->validate([
            'indikasi' => 'nullable|string',
            'aturan_pakai' => 'nullable|string',
            'efek_samping' => 'nullable|string',
            'deskripsi' => 'nullable|string',
        ]);

        $product->update([
            'indikasi' => $request->indikasi ?? $product->indikasi,
            'aturan_pakai' => $request->aturan_pakai ?? $product->aturan_pakai,
            'efek_samping' => $request->efek_samping ?? $product->efek_samping,
            'deskripsi' => $request->deskripsi ?? $product->deskripsi,
        ]);

        return back()->with('success', 'Informasi obat berhasil diperbarui');
    })->name('pharmacist.products.update');

    Route::put('/pharmacist/orders/{id}/status', function(\Illuminate\Http\Request $request, $id) {
        $request->validate(['status' => 'required|string|in:pending,diproses,disiapkan,dikirim,selesai,dibatalkan']);
        $order = \App\Models\Order::findOrFail($id);
        $order->update(['status' => $request->status]);
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
        $products = \App\Models\Product::with(['category', 'symptoms'])->latest()->get();
        $categories = \App\Models\Category::all();
        $users = \App\Models\User::all();
        $symptoms = \App\Models\Symptom::all();
        $orders = \App\Models\Order::with(['user', 'products', 'prescription'])->latest()->get();
        
        return Inertia::render('AdminDashboard', [
            'products' => $products,
            'categories' => $categories,
            'users' => $users,
            'symptoms' => $symptoms,
            'orders' => $orders
        ]);
    })->name('admin.dashboard');

    Route::get('/admin/settings', function () {
        return Inertia::render('AdminSettings');
    })->name('admin.settings');

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

    Route::put('/admin/orders/{id}/status', function(Illuminate\Http\Request $request, $id) {
        $request->validate(['status' => 'required|string|in:diproses,disiapkan,dikirim,selesai']);
        $order = \App\Models\Order::findOrFail($id);
        $order->update(['status' => $request->status]);
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