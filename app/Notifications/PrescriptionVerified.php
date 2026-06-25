<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PrescriptionVerified extends Notification implements \Illuminate\Contracts\Broadcasting\ShouldBroadcast
{
    use Queueable;

    public $prescriptionId;
    public $status;

    public function __construct($prescriptionId, $status)
    {
        $this->prescriptionId = $prescriptionId;
        $this->status = $status;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    public function toArray(object $notifiable): array
    {
        if ($notifiable->role === 'pelanggan') {
            if ($this->status === 'disetujui') {
                return [
                    'type' => 'prescription_verified',
                    'title' => '🚨 [RESEP DISETUJUI] Segera Selesaikan Pembayaran',
                    'message' => "Resep {$this->prescriptionId} telah disetujui oleh Apoteker! Demi keselamatan medis, mohon segera proses transaksi dan lakukan pembayaran sekarang agar obat bisa langsung disiapkan.",
                    'prescription_id' => $this->prescriptionId,
                    'url' => "/prescriptions/" . $this->prescriptionId,
                ];
            } else {
                return [
                    'type' => 'prescription_verified',
                    'title' => '❌ [RESEP DITOLAK] Verifikasi Gagal',
                    'message' => "Maaf, resep {$this->prescriptionId} ditolak. Silakan periksa catatan umpan balik (feedback) dari Apoteker dan unggah kembali resep yang valid.",
                    'prescription_id' => $this->prescriptionId,
                    'url' => "/prescriptions/" . $this->prescriptionId,
                ];
            }
        }

        return [];
    }
}
