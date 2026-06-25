<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();

        // Hanya ambil user dengan role 'user' (pelanggan asli)
        $faker = \Faker\Factory::create('id_ID');

        $users = User::where('role', 'user')->pluck('id');

        DB::table('shipping_methods')->insertOrIgnore([
            [
                'id' => 1, 
                'nama_metode' => 'Kirim via Kurir', 
                'tipe' => 'standard',
                'biaya' => 12000,
                'estimasi_waktu' => '2-3 hari',
                'is_active' => true
            ],
            [
                'id' => 2, 
                'nama_metode' => 'Ambil di Apotek', 
                'tipe' => 'pickup',
                'biaya' => 0,
                'estimasi_waktu' => 'Siap dalam 2 jam',
                'is_active' => true
            ]
        ]);

        $products = Product::all();
        if ($products->isEmpty()) {
            \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
            return;
        }

        $pharmacistsAndAdmins = User::where('role', 'pharmacist')->pluck('id');

        $dailyOrderCounts = [];
        $dailyResepCounts = [];

        for($i=0; $i<100; $i++){ 
            $isPrescription = $i >= 70; // 30 of them are prescriptions
            $date = now()->subDays(rand(0, 89))->setTime(rand(8,20), rand(0,59)); 
            
            // Random status distribution: Banyakin Pending (40%), Selesai dikit (15%)
            $rand = rand(1, 100);
            if ($rand <= 40) {
                $status = 'Pending'; // 40%
            } elseif ($rand <= 60) {
                $status = 'Diproses'; // 20%
            } elseif ($rand <= 80) {
                $status = 'Dikirim'; // 20%
            } elseif ($rand <= 95) {
                $status = 'Selesai'; // 15%
            } else {
                $status = 'Dibatalkan'; // 5%
            }

            if ($isPrescription && $status === 'Diproses') {
                $status = rand(1, 2) === 1 ? 'Dikirim' : 'Selesai';
            }

            $userId = $users->random();
            $userAddress = \App\Models\Address::where('user_id', $userId)->first();
            
            if ($userAddress) {
                $kota = $userAddress->kota;
                $shippingAddressData = [
                    'label' => $userAddress->label ?? 'Rumah',
                    'alamat_lengkap' => $userAddress->alamat_lengkap,
                    'kota' => $userAddress->kota,
                    'provinsi' => $userAddress->provinsi,
                    'kode_pos' => $userAddress->kode_pos
                ];
            } else {
                $kota = $faker->city;
                $shippingAddressData = [
                    'label' => 'Rumah',
                    'alamat_lengkap' => $faker->streetAddress,
                    'kota' => $kota,
                    'provinsi' => $faker->state,
                    'kode_pos' => $faker->postcode
                ];
            }
            
            if (stripos($kota, 'Bandung') !== false) {
                $shippingMethodId = rand(1, 2);
            } else {
                $shippingMethodId = 2; // Ambil di Apotek mutlak untuk luar kota
            }

            $biayaKurirFlat = \DB::table('shipping_methods')->where('id', 1)->value('biaya') ?? 12000;
            $biayaPengiriman = $shippingMethodId === 1 ? $biayaKurirFlat : 0;
            $namaPengiriman = $shippingMethodId === 1 ? 'kurir' : 'ambil_sendiri';

            if ($shippingMethodId === 2 && $status === 'Dikirim') {
                $status = 'Selesai';
            }

            // Aturan Mutlak: JIKA ini resep dan sudah masuk Order (bukan pending), status WAJIB akhir (Dikirim/Selesai)
            if ($isPrescription && $status === 'Diproses') {
                $status = $shippingMethodId === 1 ? 'Dikirim' : 'Selesai';
            }

            $pharmacistId = ($status !== 'Pending' && $status !== 'Dibatalkan') ? $pharmacistsAndAdmins->random() : null;

            $prescriptionId = null;

            if ($isPrescription) {
                // Create Prescription
                $prescriptionStatus = 'disetujui';
                if ($status === 'Pending' || $status === 'Dibatalkan') {
                    $prescriptionStatus = $faker->randomElement(['pending', 'disetujui', 'ditolak']);
                }

                $prescriptionVerifierId = ($prescriptionStatus !== 'pending') ? $pharmacistsAndAdmins->random() : null;
                $prescriptionVerifierName = $prescriptionVerifierId ? \App\Models\User::find($prescriptionVerifierId)->name : null;

                $dayKey = $date->format('Ymd');
                if (!isset($dailyResepCounts[$dayKey])) {
                    $dailyResepCounts[$dayKey] = 0;
                }
                $dailyResepCounts[$dayKey]++;
                $resepSequence = str_pad($dailyResepCounts[$dayKey], 4, '0', STR_PAD_LEFT);

                $gender = $faker->randomElement(['Laki-laki', 'Perempuan']);
                $namaPasien = $gender === 'Perempuan' ? $faker->name('female') : $faker->name('male');

                $prescription = \App\Models\Prescription::create([
                    'kode_resep' => 'RSP-' . $dayKey . '-' . $resepSequence,
                    'user_id' => $userId,
                    'nama_pasien' => $namaPasien,
                    'tanggal_lahir_pasien' => now()->subYears(rand(10, 60))->format('Y-m-d'),
                    'whatsapp' => preg_replace('/[^0-9]/', '', $faker->phoneNumber),
                    'nik_ktp' => $prescriptionStatus === 'pending' || is_null($prescriptionVerifierId) ? null : $faker->numerify('################'),
                    'jenis_kelamin' => $prescriptionStatus === 'pending' || is_null($prescriptionVerifierId) ? null : $gender,
                    'shipping_method' => $namaPengiriman,
                    'nama_dokter' => $prescriptionStatus === 'pending' ? null : 'dr. ' . $faker->name,
                    'doctor_poli' => $prescriptionStatus === 'pending' ? null : $faker->randomElement(['Poli Umum', 'Poli Penyakit Dalam', 'Poli Anak', 'Poli Kulit dan Kelamin']),
                    'doctor_ppk' => $prescriptionStatus === 'pending' ? null : $faker->randomElement(['Klinik Sehat Selalu', 'RSUD Kota', 'RS Kasih Ibu', 'Klinik Medika Utama']),
                    'doctor_alamat' => $prescriptionStatus === 'pending' ? null : $faker->address,
                    'tanggal_resep' => $prescriptionStatus === 'pending' ? null : $date->format('Y-m-d'),
                    'sip_dokter' => $prescriptionStatus === 'pending' ? null : 'SIP/' . rand(100, 999) . '/' . date('Y') . '/' . rand(1000, 9999),
                    'file_foto' => 'prescriptions/dummy_resep.jpg',
                    'status_validasi' => $prescriptionStatus,
                    'validated_by' => $prescriptionVerifierId,
                    'verifier_name' => $prescriptionVerifierName,
                    'validated_at' => $prescriptionStatus !== 'pending' ? $date->copy()->addMinutes(15) : null,
                    'catatan_apoteker' => $prescriptionStatus === 'disetujui' ? 'Resep sudah divalidasi dan dapat ditebus.' : ($prescriptionStatus === 'ditolak' ? 'Resep tidak valid atau tidak terbaca jelas.' : null),
                    'rejection_reason' => $prescriptionStatus === 'ditolak' ? 'Tulisan dokter tidak terbaca, mohon unggah ulang foto yang lebih jelas.' : null,
                    'created_at' => $date,
                    'updated_at' => $date,
                    'shipping_address' => json_encode($shippingAddressData)
                ]);
                $prescriptionId = $prescription->id;

                // Create PrescriptionItems
                if ($prescriptionStatus === 'disetujui') {
                    $numResepItems = rand(1, 3);
                    $prescriptionDrugs = $products->filter(function($p) { return $p->is_prescription_required == 1; });
                    if ($prescriptionDrugs->isEmpty()) {
                        $prescriptionDrugs = $products;
                    }

                    for($r=0; $r<$numResepItems; $r++) {
                        $selectedProduct = $prescriptionDrugs->random();
                        $isRacikan = (rand(1, 100) <= 30); // 30% chance for racikan
                        
                        \DB::table('prescription_items')->insert([
                            'prescription_id' => $prescription->id,
                            'product_id' => $selectedProduct->id,
                            'product_name' => $isRacikan ? 'Racikan Puyer ' . $faker->word : $selectedProduct->nama_obat,
                            'is_racikan' => $isRacikan,
                            'satuan' => $isRacikan ? 'Puyer' : ($selectedProduct->satuan ?? 'Tablet'),
                            'signa' => $isRacikan ? '3 x sehari 1 puyer' : '3 x sehari 1 tablet',
                            'kuantitas_resep' => rand(3, 10),
                            'kuantitas_ambil' => rand(3, 10),
                            'harga_satuan' => $isRacikan ? rand(5000, 20000) : $selectedProduct->harga,
                            'created_at' => $date,
                            'updated_at' => $date
                        ]);
                    }
                }
            }

            // Only create VirtualTransaction and Order if it's not a pending/rejected prescription
            if ($isPrescription && (!isset($prescriptionStatus) || $prescriptionStatus !== 'disetujui')) {
                continue; // Skip order creation for pending/rejected prescriptions
            }

            $dayKey = $date->format('Ymd');
            if (!isset($dailyOrderCounts[$dayKey])) {
                $dailyOrderCounts[$dayKey] = 0;
            }
            $dailyOrderCounts[$dayKey]++;
            $orderSequence = str_pad($dailyOrderCounts[$dayKey], 4, '0', STR_PAD_LEFT);

            // SINKRONISASI ATOMIK RESEP - PESANAN
            if ($isPrescription && $prescriptionId) {
                $syncPrescription = \App\Models\Prescription::find($prescriptionId);
                if ($syncPrescription) {
                    $namaPengiriman = $syncPrescription->shipping_method;
                    $shippingMethodId = ($namaPengiriman === 'kurir' || $namaPengiriman === 'Kirim via Kurir') ? 1 : 2;
                    $biayaPengiriman = $shippingMethodId === 1 ? \DB::table('shipping_methods')->where('id', 1)->value('biaya') : 0;
                }
            }

            $order = Order::create([
                'kode_pesanan' => 'INV-' . $dayKey . '-' . $orderSequence, 
                'user_id' => $userId, 
                'address_id' => \App\Models\Address::where('user_id', $userId)->first()->id ?? 1,
                'shipping_method_id' => $shippingMethodId,
                'shipping_address' => $shippingAddressData,
                'prescription_id' => $prescriptionId,
                'status' => $status === 'Pending' ? 'menunggu_pembayaran' : strtolower($status), 
                'subtotal_produk' => 0, 
                'biaya_pengiriman' => $biayaPengiriman, 
                'biaya_layanan' => 0, 
                'total_biaya' => 0, 
                'created_at' => $date, 
                'updated_at' => $date
            ]); 
            
            // Isi Order Items
            $subtotal = 0;
            $itemsJson = [];

            if ($isPrescription) {
                // Get from prescription items
                $pItems = \App\Models\PrescriptionItem::where('prescription_id', $prescriptionId)->get();
                foreach($pItems as $pItem) {
                    $qty = $pItem->kuantitas_ambil;
                    $harga = $pItem->harga_satuan;
                    $total = $qty * $harga;
                    $subtotal += $total;

                    $product = \App\Models\Product::find($pItem->product_id);
                    DB::table('order_items')->insert([
                        'order_id' => $order->id,
                        'product_id' => $pItem->product_id,
                        'kuantitas' => $qty,
                        'harga_satuan' => $harga,
                        'subtotal' => $total,
                        'created_at' => $date,
                        'updated_at' => $date,
                    ]);

                    $itemsJson[] = [
                        'id' => $pItem->product_id,
                        'name' => $pItem->product_name,
                        'price' => $harga,
                        'quantity' => $qty,
                        'image' => $product->gambar ?? null,
                    ];
                }
            } else {
                $numItems = rand(1, 3);
                $selectedProducts = $products->random(min($numItems, $products->count()));
                
                foreach ($selectedProducts as $product) {
                    $qty = rand(1, 3);
                    $harga = $product->harga;
                    $total = $qty * $harga;
                    $subtotal += $total;
                    
                    DB::table('order_items')->insert([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'kuantitas' => $qty,
                        'harga_satuan' => $harga,
                        'subtotal' => $total,
                        'created_at' => $order->created_at,
                        'updated_at' => $order->created_at,
                    ]);

                    $itemsJson[] = [
                        'id' => $product->id,
                        'name' => $product->nama_obat,
                        'price' => $harga,
                        'quantity' => $qty,
                        'image' => $product->gambar,
                    ];
                }
            }
            
            $totalAmount = $subtotal + $order->biaya_pengiriman;
            
            // Update tabel Order
            $order->update([
                'subtotal_produk' => $subtotal,
                'total_biaya' => $totalAmount
            ]);

            // Riwayat Pesanan
            $historyTimeline = [];
            $currentTime = $date->copy();
            
            $statusAsli = $status === 'Pending' ? 'menunggu_pembayaran' : strtolower($status);
            
            $historyTimeline[] = [
                'status_sebelum' => null,
                'status_sesudah' => 'menunggu_pembayaran',
                'time' => $currentTime->copy()
            ];

            if (in_array($statusAsli, ['diproses', 'dikirim', 'selesai'])) {
                $historyTimeline[] = [
                    'status_sebelum' => 'menunggu_pembayaran',
                    'status_sesudah' => 'diproses',
                    'time' => $currentTime->copy()->addMinutes(15)
                ];
            }
            
            if (in_array($statusAsli, ['dikirim', 'selesai'])) {
                $historyTimeline[] = [
                    'status_sebelum' => 'diproses',
                    'status_sesudah' => 'dikirim',
                    'time' => $currentTime->copy()->addHours(2)
                ];
            }

            if ($statusAsli === 'selesai') {
                $historyTimeline[] = [
                    'status_sebelum' => 'dikirim',
                    'status_sesudah' => 'selesai',
                    'time' => $currentTime->copy()->addDays(1)
                ];
            }

            if ($statusAsli === 'dibatalkan') {
                $historyTimeline[] = [
                    'status_sebelum' => 'menunggu_pembayaran',
                    'status_sesudah' => 'dibatalkan',
                    'time' => $currentTime->copy()->addHours(1)
                ];
            }

            foreach($historyTimeline as $hist) {
                \DB::table('order_status_histories')->insert([
                    'order_id' => $order->id,
                    'changed_by' => ($hist['status_sesudah'] !== 'menunggu_pembayaran') ? $pharmacistId : null,
                    'status_sebelum' => $hist['status_sebelum'],
                    'status_sesudah' => $hist['status_sesudah'],
                    'keterangan' => 'Status diubah secara sistem',
                    'created_at' => $hist['time'],
                    'updated_at' => $hist['time']
                ]);
            }

            // SINKRONISASI KE VIRTUAL TRANSACTIONS (Sistem Pelanggan)
            \App\Models\VirtualTransaction::create([
                'user_id' => $order->user_id,
                'pharmacist_id' => $pharmacistId,
                'prescription_id' => $prescriptionId,
                'invoice_number' => $order->kode_pesanan,
                'total_amount' => $totalAmount,
                'status' => $status === 'Diproses' ? 'Lunas' : $status, // Sesuaikan dengan yang dibaca frontend pelangan
                'payment_method' => 'Midtrans Payment Gateway',
                'bank_name' => 'BCA',
                'va_number' => '123' . rand(1000000, 9999999),
                'items' => $itemsJson,
                'shipping_address' => $shippingAddressData,
                'shipping_method' => $namaPengiriman,
                'shipping_cost' => $biayaPengiriman,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ]);

            // SINKRONISASI STATUS RESEP
            if ($isPrescription && $prescriptionId && $status === 'Selesai') {
                \App\Models\Prescription::where('id', $prescriptionId)->update(['status_validasi' => 'telah_dipesan']);
            }
        }

        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
    }
}
