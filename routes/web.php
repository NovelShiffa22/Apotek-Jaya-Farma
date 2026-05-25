<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RecommendationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Halaman Utama / Landing Page
Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/catalog', [ProductController::class, 'index'])->name('catalog.index');

Route::get('/product/{id}', function ($id) {
    return Inertia::render('ProductDetail', ['id' => $id]);
});

// Menampilkan halaman form input gejala
Route::get('/recommendation', function () {
    return Inertia::render('Recommendation');
});

// Memproses kueri data gejala & menghitung skor rekomendasi obat
Route::post('/rekomendasi/proses', [RecommendationController::class, 'process'])->name('rekomendasi.process');


// Rute Transaksi & Keranjang
Route::get('/checkout', function () {
    return Inertia::render('Checkout');
});

Route::get('/cart', function () {
    return Inertia::render('Checkout');
});

Route::get('/profile', function () {
    return Inertia::render('Profile');
});

// Ruang Portal Kerja Manajemen (Dashboard)
Route::get('/pharmacist', function () {
    return Inertia::render('PharmacistDashboard');
});

Route::get('/admin', function () {
    return Inertia::render('AdminDashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Manajemen Akun Pengguna / Profile Settings
Route::middleware('auth')->group(function () {
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';