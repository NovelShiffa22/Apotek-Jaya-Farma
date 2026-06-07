<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
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
});

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');

Route::get('/profile', function () {
    return Inertia::render('Profile');
})->middleware(['auth', 'role:user']);

// Ruang Portal Kerja Manajemen (Dashboard)
Route::get('/pharmacist', function () {
    return Inertia::render('PharmacistDashboard');
})->middleware(['auth', 'role:pharmacist']);

Route::get('/admin', function () {
    return Inertia::render('AdminDashboard');
})->middleware(['auth', 'role:admin']);

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