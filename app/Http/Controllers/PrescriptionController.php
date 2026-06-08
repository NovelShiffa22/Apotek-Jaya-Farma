<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Prescription;

class PrescriptionController extends Controller
{
    public function index(Request $request)
    {
        $query = Prescription::where('user_id', auth()->id());

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = strtolower($request->search);
            $query->where(function ($q) use ($searchTerm) {
                $q->whereRaw('LOWER(kode_resep) LIKE ?', ['%' . $searchTerm . '%'])
                  ->orWhereRaw('LOWER(file_foto) LIKE ?', ['%' . $searchTerm . '%']);
            });
        }

        $prescriptions = $query->latest()->paginate(5)->withQueryString();

        return Inertia::render('Prescriptions/Index', [
            'prescriptions' => $prescriptions,
            'filters' => $request->only('search')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'prescription_file' => 'required|mimes:jpg,jpeg,png,pdf|max:5120'
        ], [
            'prescription_file.required' => 'Mohon unggah berkas resep dokter Anda terlebih dahulu.',
            'prescription_file.mimes' => 'Format berkas tidak didukung. Sediakan file dalam format JPG, PNG, atau PDF.',
            'prescription_file.max' => 'Ukuran berkas terlalu besar. Maksimal ukuran file yang diperbolehkan adalah 5MB.',
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
            'status_validasi' => 'pending'
        ]);

        return redirect()->route('prescriptions.upload.step3', ['id' => $prescription->id])->with('success', 'Resep berhasil diunggah! Mohon tunggu proses verifikasi dari apoteker.');
    }
}
