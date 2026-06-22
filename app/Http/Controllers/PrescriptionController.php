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
            'whatsapp' => ['required', 'regex:/^(08|628)[1-9][0-9]{7,10}$/'],
            'catatan' => 'nullable|string|max:1000',
            'shipping_address' => 'required|string',
            'shipping_method' => 'required|in:ambil_sendiri,kurir',
            'is_legal_agreed' => 'required'
        ], [
            'prescription_file.required' => 'Mohon unggah berkas resep dokter Anda terlebih dahulu',
            'prescription_file.mimes' => 'Format berkas tidak didukung. Sediakan file dalam format JPG, PNG, atau PDF',
            'prescription_file.max' => 'Ukuran berkas terlalu besar. Maksimal ukuran file yang diperbolehkan adalah 5MB',
            'whatsapp.required' => 'Nomor WhatsApp wajib diisi',
            'whatsapp.numeric' => 'Nomor WhatsApp hanya boleh berisi angka',
            'whatsapp.digits_between' => 'Nomor WhatsApp harus terdiri dari 10 hingga 13 digit angka',
            'whatsapp.regex' => 'Nomor tidak valid, masukkan angka (10-13 digit) diawali 08 atau 628',
            'shipping_address.required' => 'Mohon pilih atau tambahkan alamat pengiriman',
            'is_legal_agreed.required' => 'Anda harus menyetujui pernyataan legalitas resep',
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

        $today = now()->format('ymd');
        $lastPrescription = Prescription::where('kode_resep', 'like', "RSP-{$today}-%")->orderBy('kode_resep', 'desc')->first();
        
        $sequence = 1;
        if ($lastPrescription) {
            $lastSequence = (int) substr($lastPrescription->kode_resep, -4);
            $sequence = $lastSequence + 1;
        }
        
        $kodeResep = "RSP-" . $today . "-" . str_pad($sequence, 4, '0', STR_PAD_LEFT);

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

        if (auth()->check()) {
            \App\Models\UserActivity::create([
                'user_id' => auth()->id(),
                'action' => 'upload_prescription',
                'description' => 'User mengunggah resep #' . $kodeResep,
                'ip_address' => $request->ip(),
            ]);
        }

        return redirect('/profile?tab=prescriptions&prescription_status=Menunggu Verifikasi')->with('success', 'Resep berhasil diunggah! Mohon tunggu proses verifikasi dari apoteker.');
    }
}
