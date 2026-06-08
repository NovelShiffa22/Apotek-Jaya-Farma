<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\CartController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Symptom;

// Halaman Utama / Landing Page
Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/catalog', [ProductController::class, 'index'])->name('catalog.index');

Route::get('/product/{id}', function ($id) {
    return Inertia::render('ProductDetail', ['id' => $id]);
});

// Menampilkan halaman form input gejala
Route::get('/recommendation', [RecommendationController::class, 'index'])->name('rekomendasi.index');
// Memproses kueri data gejala & menghitung skor rekomendasi obat
Route::post('/rekomendasi/proses', [RecommendationController::class, 'process'])->name('rekomendasi.process');


// Rute Transaksi & Keranjang
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');

Route::get('/checkout', function () {
    return Inertia::render('Checkout');
})->name('checkout.index');

Route::get('/cart', function () {
    return Inertia::render('Cart');
})->name('cart.index');

Route::get('/notifications', function () {
    return Inertia::render('Notifications');
})->name('notifications.index');

// Rute Simulasi Resep (FE)
Route::prefix('prescriptions')->name('prescriptions.')->group(function () {
    Route::get('/', function() { return Inertia::render('Prescriptions/Index'); })->name('index');
    Route::get('/upload/step-1', function() { return Inertia::render('Prescriptions/UploadStep1'); })->name('upload.step1');
    Route::get('/upload/step-2', function() { return Inertia::render('Prescriptions/UploadStep2'); })->name('upload.step2');
    Route::get('/upload/step-3', function() { return Inertia::render('Prescriptions/UploadStep3'); })->name('upload.step3');
    Route::get('/{id}', function($id) { return Inertia::render('Prescriptions/Detail', ['id' => $id]); })->name('detail');
});

Route::get('/profile', function () {
    return Inertia::render('Profile');
})->middleware(['auth', 'role:user']);

// Ruang Portal Kerja Manajemen (Dashboard)
Route::get('/pharmacist', function () {
    return Inertia::render('PharmacistDashboard');
})->middleware(['auth', 'role:pharmacist']);

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', function () {
        $products = \App\Models\Product::with('category')->latest()->get();
        $categories = \App\Models\Category::all();
        $users = \App\Models\User::all();
        $orders = \App\Models\Order::with(['user', 'products'])->latest()->get();
        
        return Inertia::render('AdminDashboard', [
            'products' => $products,
            'categories' => $categories,
            'users' => $users,
            'orders' => $orders
        ]);
    })->name('admin.dashboard');

    Route::get('/admin/products/create', [ProductController::class, 'create'])->name('admin.products.create');
    Route::post('/admin/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/admin/products/{id}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
    Route::put('/admin/products/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::post('/admin/products/{id}/image', [ProductController::class, 'updateImage'])->name('products.updateImage');

    Route::post('/admin/users', [AdminUserController::class, 'store'])->name('admin.users.store');
    Route::put('/admin/users/{id}', [AdminUserController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
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