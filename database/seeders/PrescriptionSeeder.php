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
        $users = \App\Models\User::where('role', 'user')->get();
        if ($users->isEmpty()) return;

        // Helper function to get random user and their shipping method
        $getRandomUserAndMethod = function() use ($users) {
            $user = $users->random();
            $userAddress = \App\Models\Address::where('user_id', $user->id)->first();
            $kota = $userAddress ? $userAddress->kota : 'Bandung';
            
            if (stripos($kota, 'Bandung') !== false) {
                // Force mostly Kirim via Kurir for Bandung to ensure variation
                $shippingMethodId = rand(1, 10) <= 7 ? 1 : 2; 
            } else {
                $shippingMethodId = 2; // Mutlak ambil di apotek untuk luar kota
            }
            return [
                'user' => $user,
                'namaPengiriman' => $shippingMethodId === 1 ? 'kurir' : 'ambil_sendiri'
            ];
        };

        $pharmacist = \App\Models\User::where('role', 'pharmacist')->first();
        $pharmacistId = $pharmacist ? $pharmacist->id : null;
        $pharmacistName = $pharmacist ? $pharmacist->name : null;

        // Pending
        for ($i = 1; $i <= 3; $i++) {
            $data = $getRandomUserAndMethod();
            \App\Models\Prescription::create([
                'user_id' => $data['user']->id,
                'kode_resep' => 'RX-' . date('Ymd') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'nama_pasien' => 'Sinta Nuriyah',
                'tanggal_lahir_pasien' => '1990-05-14',
                'whatsapp' => '08123456789',
                'shipping_address' => $data['namaPengiriman'] === 'Kirim via Kurir' ? (function() use ($data) {
                    $addr = \App\Models\Address::where('user_id', $data['user']->id)->first();
                    return $addr ? $addr->only(['alamat_lengkap', 'kota', 'provinsi']) : null;
                })() : null,
                'nik_ktp' => null,
                'jenis_kelamin' => null,
                'file_foto' => 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=400',
                'status_validasi' => 'pending',
                'shipping_method' => $data['namaPengiriman'],
                'created_at' => now()->subMinutes(rand(10, 60))
            ]);
        }

        // Approved
        $data = $getRandomUserAndMethod();
        $approved = \App\Models\Prescription::create([
            'user_id' => $data['user']->id,
            'kode_resep' => 'RX-' . date('Ymd') . '-004',
            'nama_pasien' => 'Sinta Nuriyah',
            'tanggal_lahir_pasien' => '1990-05-14',
            'whatsapp' => '08123456789',
            'shipping_address' => $data['namaPengiriman'] === 'kurir' ? \App\Models\Address::where('user_id', $data['user']->id)->value('alamat_lengkap') : null,
            'nik_ktp' => '3271012345678901',
            'jenis_kelamin' => 'Perempuan',
            'file_foto' => 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=400',
            'status_validasi' => 'disetujui',
            'shipping_method' => $data['namaPengiriman'],
            'doctor_name' => 'Dr. Hermawan',
            'doctor_poli' => 'Umum',
            'doctor_ppk' => 'RS Cipto Mangunkusumo',
            'doctor_alamat' => 'Jl. Diponegoro No. 71, Jakarta',
            'total_biaya' => 55000,
            'validated_by' => $pharmacistId,
            'verifier_name' => $pharmacistName,
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
        $data = $getRandomUserAndMethod();
        \App\Models\Prescription::create([
            'user_id' => $data['user']->id,
            'kode_resep' => 'RX-' . date('Ymd') . '-005',
            'nama_pasien' => 'Budi Santoso',
            'tanggal_lahir_pasien' => '1985-11-23',
            'whatsapp' => '08198765432',
            'shipping_address' => $data['namaPengiriman'] === 'Kirim via Kurir' ? \App\Models\Address::where('user_id', $data['user']->id)->value('alamat_lengkap') : null,
            'nik_ktp' => '3271012345678902',
            'jenis_kelamin' => 'Laki-laki',
            'file_foto' => 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=400',
            'status_validasi' => 'ditolak',
            'shipping_method' => $data['namaPengiriman'],
            'catatan_apoteker' => 'Resep tidak jelas, mohon upload foto ulang yang lebih terang dan jelas.',
            'rejection_reason' => 'Foto resep blur / tidak terbaca',
            'validated_by' => $pharmacistId,
            'verifier_name' => $pharmacistName,
            'validated_at' => now()->subHours(5),
            'created_at' => now()->subHours(6)
        ]);
    }
}
