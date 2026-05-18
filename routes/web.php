<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/catalog', function () {
    return Inertia::render('Catalog');
});

Route::get('/product/{id}', function ($id) {
    return Inertia::render('ProductDetail', ['id' => $id]);
});

Route::get('/recommendation', function () {
    return Inertia::render('Recommendation');
});

Route::get('/checkout', function () {
    return Inertia::render('Checkout');
});

Route::get('/cart', function () {
    return Inertia::render('Checkout');
});

Route::get('/profile', function () {
    return Inertia::render('Profile');
});

Route::get('/pharmacist', function () {
    return Inertia::render('PharmacistDashboard');
});

Route::get('/admin', function () {
    return Inertia::render('AdminDashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
