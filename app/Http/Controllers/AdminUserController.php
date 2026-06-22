<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AdminUserController extends Controller
{
    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => ['required', 'regex:/^(08|628)[1-9][0-9]{7,10}$/'],
            'role' => 'required|string|in:admin,pharmacist,user',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'name.required' => 'Nama lengkap wajib diisi',
            'email.required' => 'Alamat email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email ini sudah terdaftar',
            'phone.required' => 'Nomor telepon wajib diisi',
            'phone.regex' => 'Nomor tidak valid, masukkan angka (10-13 digit) diawali 08 atau 628',
            'role.required' => 'Peran (Role) wajib dipilih',
            'password.required' => 'Kata sandi wajib diisi',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        if (auth()->check()) {
            \App\Models\UserActivity::create([
                'user_id' => auth()->id(),
                'action' => 'create_user',
                'description' => 'Menambahkan user baru: ' . $user->name . ' (' . $user->role . ')',
                'ip_address' => request()->ip(),
            ]);
        }

        return redirect()->back()->with('success', 'User berhasil ditambahkan');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => ['required', 'regex:/^(08|628)[1-9][0-9]{7,10}$/'],
            'role' => 'required|string|in:admin,pharmacist,user',
        ];

        // Jika password diisi, maka divalidasi dan diubah
        if ($request->filled('password')) {
            $rules['password'] = ['confirmed', Rules\Password::defaults()];
        }

        $validated = $request->validate($rules, [
            'name.required' => 'Nama lengkap wajib diisi',
            'email.required' => 'Alamat email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email ini sudah terdaftar',
            'phone.required' => 'Nomor telepon wajib diisi',
            'phone.regex' => 'Nomor tidak valid, masukkan angka (10-13 digit) diawali 08 atau 628',
            'role.required' => 'Peran (Role) wajib dipilih',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
        ];

        if ($request->filled('password')) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);

        if (auth()->check()) {
            \App\Models\UserActivity::create([
                'user_id' => auth()->id(),
                'action' => 'update_user',
                'description' => 'Memperbarui data user: ' . $user->name,
                'ip_address' => request()->ip(),
            ]);
        }

        return redirect()->back()->with('success', 'Data user berhasil diperbarui');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Jangan izinkan admin menghapus dirinya sendiri
        if (auth()->id() == $user->id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri');
        }

        $userName = $user->name;
        $user->delete();

        if (auth()->check()) {
            \App\Models\UserActivity::create([
                'user_id' => auth()->id(),
                'action' => 'delete_user',
                'description' => 'Menghapus user: ' . $userName,
                'ip_address' => request()->ip(),
            ]);
        }

        return redirect()->back()->with('success', 'User berhasil dihapus');
    }

    /**
     * Get user activities.
     */
    public function activities($id)
    {
        $activities = \App\Models\UserActivity::where('user_id', $id)
            ->latest()
            ->get();
            
        return response()->json($activities);
    }
}
