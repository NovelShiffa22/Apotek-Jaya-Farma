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
})->middleware(['auth', 'role:user']);

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

Route::middleware('auth')->group(function () {
    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
