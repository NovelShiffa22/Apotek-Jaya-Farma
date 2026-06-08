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
            $query->where('id', 'LIKE', '%' . $request->search . '%');
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
            'prescription_file' => 'required|mimes:jpg,jpeg,png,pdf|max:2048'
        ]);

        $file = $request->file('prescription_file');
        $fileName = 'rx_file_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('prescriptions', $fileName, 'public');

        do {
            $kodeResep = 'RX-' . mt_rand(100000, 999999);
        } while (Prescription::where('kode_resep', $kodeResep)->exists());

        Prescription::create([
            'user_id' => auth()->id(),
            'kode_resep' => $kodeResep,
            'file_foto' => 'storage/' . $path,
            'status_validasi' => 'pending'
        ]);

        return redirect()->route('prescriptions.index')->with('success', 'Resep berhasil diunggah! Mohon tunggu proses verifikasi dari apoteker.');
    }
}
