<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Prescription;
use Illuminate\Support\Facades\Auth;

class PrescriptionController extends Controller
{
    public function show($id)
    {
        $prescription = Prescription::with(['items.product.category', 'validator'])->where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        return Inertia::render('Prescriptions/Detail', [
            'prescription' => $prescription,
            'user' => Auth::user()
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'prescription_file' => 'required|mimes:jpg,jpeg,png,pdf|max:5120',
            'nama_pasien' => 'nullable|string|max:255',
            'nama_dokter' => 'nullable|string|max:255',
            'whatsapp' => 'nullable|string|max:20',
            'catatan' => 'nullable|string|max:1000',
            'is_legal_agreed' => 'accepted'
        ], [
            'prescription_file.required' => 'Mohon unggah berkas resep dokter Anda terlebih dahulu.',
            'prescription_file.mimes' => 'Format berkas tidak didukung. Sediakan file dalam format JPG, PNG, atau PDF.',
            'prescription_file.max' => 'Ukuran berkas terlalu besar. Maksimal ukuran file yang diperbolehkan adalah 5MB.',
            'is_legal_agreed.accepted' => 'Anda harus menyetujui pernyataan legalitas resep.',
        ]);

        $file = $request->file('prescription_file');
        $fileName = 'rx_file_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('prescriptions', $fileName, 'public');

        do {
            $kodeResep = 'RX-' . mt_rand(100000, 999999);
        } while (Prescription::where('kode_resep', $kodeResep)->exists());

        $prescription = Prescription::create([
            'user_id' => auth()->id(),
            'kode_resep' => $kodeResep,
            'file_foto' => 'storage/' . $path,
            'status_validasi' => 'pending',
            'nama_pasien' => $request->nama_pasien,
            'nama_dokter' => $request->nama_dokter,
            'whatsapp' => $request->whatsapp,
            'catatan' => $request->catatan,
            'is_legal_agreed' => $request->is_legal_agreed ? true : false,
        ]);

        return redirect('/profile?tab=prescriptions&prescription_status=Menunggu Verifikasi')->with('success', 'Resep berhasil diunggah! Mohon tunggu proses verifikasi dari apoteker.');
    }
}
