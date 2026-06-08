<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Symptom;

// Halaman Utama / Landing Page
Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/catalog', [ProductController::class, 'index'])->name('catalog.index');

Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

// Menampilkan halaman form input gejala
Route::get('/recommendation', [RecommendationController::class, 'index'])->name('rekomendasi.index');
// Memproses kueri data gejala & menghitung skor rekomendasi obat
Route::post('/rekomendasi/proses', [RecommendationController::class, 'process'])->name('rekomendasi.process');


// Rute Transaksi & Keranjang
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');

Route::get('/notifications', function () {
    return Inertia::render('Notifications');
})->name('notifications.index');

// Rute Simulasi Resep (FE)
Route::prefix('prescriptions')->name('prescriptions.')->group(function () {
    Route::get('/', [\App\Http\Controllers\PrescriptionController::class, 'index'])->middleware('auth')->name('index');
    Route::get('/upload/step-1', function() { return Inertia::render('Prescriptions/UploadStep1'); })->name('upload.step1');
    Route::get('/upload/step-2', function() { return Inertia::render('Prescriptions/UploadStep2'); })->name('upload.step2');
    Route::get('/upload/step-3', function() { return Inertia::render('Prescriptions/UploadStep3'); })->name('upload.step3');
    Route::get('/{id}', function($id) { return Inertia::render('Prescriptions/Detail', ['id' => $id]); })->name('detail');
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
    return Inertia::render('Profile', [
        'orders' => $orders
    ]);
})->middleware(['auth', 'role:user']);

// Ruang Portal Kerja Manajemen (Dashboard)
Route::get('/pharmacist', function () {
    return Inertia::render('PharmacistDashboard');
})->middleware(['auth', 'role:pharmacist']);

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('AdminDashboard');
    })->name('admin.dashboard');

    Route::get('/admin/products/create', [ProductController::class, 'create'])->name('admin.products.create');
    Route::post('/admin/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/admin/products/{id}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
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