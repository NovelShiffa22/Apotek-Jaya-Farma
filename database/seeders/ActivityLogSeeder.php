<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ActivityLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::all();
        
        foreach ($users as $user) {
            // Log Registration
            \App\Models\UserActivity::create([
                'user_id' => $user->id,
                'action' => 'register',
                'description' => 'User mendaftar akun',
                'created_at' => $user->created_at,
                'updated_at' => $user->created_at,
            ]);

            // Log Orders
            $orders = \App\Models\Order::where('user_id', $user->id)->get();
            foreach ($orders as $order) {
                \App\Models\UserActivity::create([
                    'user_id' => $user->id,
                    'action' => 'create_order',
                    'description' => 'User membuat pesanan #' . $order->kode_pesanan,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->created_at,
                ]);
            }

            // Log Virtual Transactions
            $vts = \App\Models\VirtualTransaction::where('user_id', $user->id)->get();
            foreach ($vts as $vt) {
                \App\Models\UserActivity::create([
                    'user_id' => $user->id,
                    'action' => 'create_virtual_transaction',
                    'description' => 'User membuat pesanan virtual #' . ($vt->va_number ?? 'VT-'.$vt->id),
                    'created_at' => $vt->created_at,
                    'updated_at' => $vt->created_at,
                ]);
            }

            // Log Prescriptions
            $prescriptions = \App\Models\Prescription::where('user_id', $user->id)->get();
            foreach ($prescriptions as $prescription) {
                \App\Models\UserActivity::create([
                    'user_id' => $user->id,
                    'action' => 'upload_prescription',
                    'description' => 'User mengunggah resep #' . ($prescription->kode_resep ?? 'RSP-'.$prescription->id),
                    'created_at' => $prescription->created_at,
                    'updated_at' => $prescription->created_at,
                ]);
            }
        }
    }
}
