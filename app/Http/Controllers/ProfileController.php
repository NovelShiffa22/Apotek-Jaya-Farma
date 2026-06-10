<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Memperbarui informasi profil dari halaman Profile pelanggan.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', \Illuminate\Validation\Rule::unique('users')->ignore(auth()->id())],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $user = $request->user();
        $user->fill($request->only('name', 'email', 'phone'));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return redirect()->back()->with('success', 'Informasi profil berhasil diperbarui.');
    }

    /**
     * Menyimpan alamat baru.
     */
    public function storeAlamat(Request $request): RedirectResponse
    {
        $request->validate([
            'label' => 'required|string|max:255',
            'alamat_lengkap' => 'required|string',
            'kota' => 'required|string',
            'provinsi' => 'required|string',
            'kode_pos' => 'required|string|max:10',
        ]);

        $is_default = $request->input('is_default', false);

        // Jika ini alamat pertama atau user mencentang sebagai utama, jadikan utama
        if ($is_default || \App\Models\Address::where('user_id', auth()->id())->count() === 0) {
            \App\Models\Address::where('user_id', auth()->id())->update(['is_default' => false]);
            $is_default = true;
        }

        \App\Models\Address::create([
            'user_id' => auth()->id(),
            'label' => $request->label,
            'alamat_lengkap' => $request->alamat_lengkap,
            'kota' => $request->kota,
            'provinsi' => $request->provinsi,
            'kode_pos' => $request->kode_pos,
            'is_default' => $is_default,
        ]);

        return redirect()->back()->with('success', 'Alamat berhasil ditambahkan.');
    }

    /**
     * Memperbarui alamat yang sudah ada.
     */
    public function updateAlamat(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'label' => 'required|string|max:255',
            'alamat_lengkap' => 'required|string',
            'kota' => 'required|string',
            'provinsi' => 'required|string',
            'kode_pos' => 'required|string|max:10',
        ]);

        $address = \App\Models\Address::where('user_id', auth()->id())->findOrFail($id);
        
        $is_default = $request->input('is_default', false);

        if ($is_default && !$address->is_default) {
            \App\Models\Address::where('user_id', auth()->id())->update(['is_default' => false]);
        }

        $address->update([
            'label' => $request->label,
            'alamat_lengkap' => $request->alamat_lengkap,
            'kota' => $request->kota,
            'provinsi' => $request->provinsi,
            'kode_pos' => $request->kode_pos,
            'is_default' => $is_default,
        ]);

        return redirect()->back()->with('success', 'Alamat berhasil diperbarui.');
    }

    /**
     * Mengatur alamat sebagai utama.
     */
    public function setUtama($id): RedirectResponse
    {
        $address = \App\Models\Address::where('user_id', auth()->id())->findOrFail($id);
        
        // Matikan semua alamat utama user ini
        \App\Models\Address::where('user_id', auth()->id())->update(['is_default' => false]);
        
        // Jadikan alamat yang dipilih sebagai utama
        $address->update(['is_default' => true]);

        return redirect()->back()->with('success', 'Alamat utama berhasil diperbarui.');
    }

    /**
     * Menghapus alamat pengiriman.
     */
    public function destroyAlamat($id): RedirectResponse
    {
        $address = \App\Models\Address::where('user_id', auth()->id())->findOrFail($id);
        
        // Jika alamat yang dihapus adalah utama, jadikan alamat pertama lain sebagai utama
        if ($address->is_default) {
            $otherAddress = \App\Models\Address::where('user_id', auth()->id())
                ->where('id', '!=', $id)
                ->first();
            if ($otherAddress) {
                $otherAddress->update(['is_default' => true]);
            }
        }

        $address->delete();

        return redirect()->back()->with('success', 'Alamat berhasil dihapus.');
    }
}
