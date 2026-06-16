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
        $prescription = Prescription::with(['items.product.category', 'validator', 'virtualTransactions' => function($q) {
            $q->latest();
        }])->where('id', $id)->where('user_id', Auth::id())->firstOrFail();

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
            'tanggal_lahir_pasien' => 'nullable|date',
            'whatsapp' => ['required', 'numeric', 'digits_between:10,13', 'regex:/^(08|62)/'],
            'catatan' => 'nullable|string|max:1000',
            'shipping_address' => 'required|string',
            'shipping_method' => 'required|in:ambil_sendiri,kurir',
            'is_legal_agreed' => 'accepted'
        ], [
            'prescription_file.required' => 'Mohon unggah berkas resep dokter Anda terlebih dahulu.',
            'prescription_file.mimes' => 'Format berkas tidak didukung. Sediakan file dalam format JPG, PNG, atau PDF.',
            'prescription_file.max' => 'Ukuran berkas terlalu besar. Maksimal ukuran file yang diperbolehkan adalah 5MB.',
            'whatsapp.required' => 'Nomor WhatsApp wajib diisi.',
            'whatsapp.numeric' => 'Nomor WhatsApp hanya boleh berisi angka.',
            'whatsapp.digits_between' => 'Nomor WhatsApp harus terdiri dari 10 hingga 13 digit angka.',
            'whatsapp.regex' => 'Nomor WhatsApp harus diawali dengan 08 atau 62.',
            'shipping_address.required' => 'Mohon pilih atau tambahkan alamat pengiriman.',
            'is_legal_agreed.accepted' => 'Anda harus menyetujui pernyataan legalitas resep.',
        ]);

        if ($request->shipping_method === 'kurir') {
            $isKotaBandung = stripos($request->shipping_address, 'Bandung') !== false && 
                             stripos($request->shipping_address, 'Kabupaten') === false && 
                             stripos($request->shipping_address, 'Kab.') === false;
            
            if (!$isKotaBandung) {
                return redirect()->back()->withErrors(['shipping_method' => 'Layanan kurir toko saat ini hanya mencakup wilayah Kota Bandung. Alamat Kabupaten tidak didukung.']);
            }
        }

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
            'tanggal_lahir_pasien' => $request->tanggal_lahir_pasien,
            'whatsapp' => $request->whatsapp,
            'catatan' => $request->catatan,
            'shipping_address' => $request->shipping_address,
            'shipping_method' => $request->shipping_method,
            'is_legal_agreed' => $request->is_legal_agreed ? true : false,
        ]);

        return redirect('/profile?tab=prescriptions&prescription_status=Menunggu Verifikasi')->with('success', 'Resep berhasil diunggah! Mohon tunggu proses verifikasi dari apoteker.');
    }
}
