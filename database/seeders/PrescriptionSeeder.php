<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PrescriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = \App\Models\User::first();
        if (!$user) return;

        // Pending
        for ($i = 1; $i <= 3; $i++) {
            \App\Models\Prescription::create([
                'user_id' => $user->id,
                'kode_resep' => 'RX-' . date('Ymd') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'file_foto' => 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=400',
                'status_validasi' => 'pending',
                'created_at' => now()->subMinutes(rand(10, 60))
            ]);
        }

        // Approved
        $approved = \App\Models\Prescription::create([
            'user_id' => $user->id,
            'kode_resep' => 'RX-' . date('Ymd') . '-004',
            'file_foto' => 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=400',
            'status_validasi' => 'disetujui',
            'doctor_name' => 'Dr. Hermawan',
            'doctor_poli' => 'Umum',
            'doctor_ppk' => 'RS Cipto Mangunkusumo',
            'doctor_alamat' => 'Jl. Diponegoro No. 71, Jakarta',
            'total_biaya' => 55000,
            'validated_at' => now()->subHours(2),
            'created_at' => now()->subHours(3)
        ]);

        $product = \App\Models\Product::first();
        if ($product) {
            \App\Models\PrescriptionItem::create([
                'prescription_id' => $approved->id,
                'product_id' => $product->id,
                'product_name' => $product->nama_obat,
                'is_racikan' => false,
                'kuantitas_resep' => 10,
                'kuantitas_ambil' => 10,
                'satuan' => 'Tablet',
                'signa' => '3x1',
                'harga_satuan' => $product->harga,
                'subtotal' => 10 * $product->harga,
            ]);
        }

        // Rejected
        \App\Models\Prescription::create([
            'user_id' => $user->id,
            'kode_resep' => 'RX-' . date('Ymd') . '-005',
            'file_foto' => 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=400',
            'status_validasi' => 'ditolak',
            'catatan_apoteker' => 'Resep tidak jelas, mohon upload foto ulang yang lebih terang dan jelas.',
            'validated_at' => now()->subHours(5),
            'created_at' => now()->subHours(6)
        ]);
    }
}
