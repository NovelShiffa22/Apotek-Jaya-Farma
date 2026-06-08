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
}
