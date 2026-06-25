<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Notification;
use App\Models\Order;
use App\Models\Prescription;
use App\Models\User;
use App\Notifications\OrderEntered;
use App\Notifications\PrescriptionSubmitted;

class HistoricalNotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ambil target user penerima notifikasi
        $allAdminsAndPharmacists = User::whereIn('role', ['admin', 'pharmacist'])->get();
        $onlyAdmins = User::where('role', 'admin')->get();
        $onlyPharmacists = User::where('role', 'pharmacist')->get();

        // 2. Notifikasi untuk Pesanan terbaru (OrderEntered & OrderReadyToPack) -> Ke Admin dan Pelanggan
        $recentOrders = Order::with('user')->latest()->take(5)->get();
        foreach ($recentOrders as $order) {
            // Admin gets 2 notifications
            Notification::send($onlyAdmins, new OrderEntered($order->kode_pesanan));
            Notification::send($onlyAdmins, new \App\Notifications\OrderReadyToPack($order->kode_pesanan));
            
            // Pharmacist gets 1 notification
            Notification::send($onlyPharmacists, new \App\Notifications\OrderReadyToPack($order->kode_pesanan));

            // Customer gets 1 notification
            if ($order->user) {
                Notification::send($order->user, new OrderEntered($order->kode_pesanan));
            }
        }
        
        // Guarantee user@gmail.com gets notifications
        $userBiasa = User::where('email', 'user@gmail.com')->first();
        if ($userBiasa) {
            $userOrder = Order::where('user_id', $userBiasa->id)->latest()->first();
            if ($userOrder) {
                Notification::send($userBiasa, new OrderEntered($userOrder->kode_pesanan));
            }
        }

        // 3. Notifikasi untuk Resep terbaru (PrescriptionSubmitted) -> Ke Admin & Apoteker
        $recentPrescriptions = Prescription::with('user')->latest()->take(5)->get();
        foreach ($recentPrescriptions as $prescription) {
            Notification::send($allAdminsAndPharmacists, new PrescriptionSubmitted($prescription->kode_resep));
            
            // Simulasi PrescriptionVerified ke customer
            if ($prescription->user) {
                $status = rand(0, 1) ? 'disetujui' : 'ditolak';
                Notification::send($prescription->user, new \App\Notifications\PrescriptionVerified($prescription->kode_resep, $status));
            }

            // Simulasi PrescriptionOrderPaid (Prioritas Utama)
            Notification::send($allAdminsAndPharmacists, new \App\Notifications\PrescriptionOrderPaid("INV-PR-" . $prescription->kode_resep));
        }

        // 4. Simulasi StockAlert untuk produk dengan stok terkecil
        $lowStockProduct = \App\Models\Product::orderBy('stok', 'asc')->first();
        if ($lowStockProduct) {
            Notification::send($onlyAdmins, new \App\Notifications\StockAlert($lowStockProduct->nama_obat));
        }

        // Guarantee user@gmail.com gets a prescription notification
        if ($userBiasa) {
            $userPrescription = Prescription::where('user_id', $userBiasa->id)->latest()->first();
            if ($userPrescription) {
                Notification::send($userBiasa, new \App\Notifications\PrescriptionVerified($userPrescription->kode_resep, 'disetujui'));
            }
        }
    }
}
