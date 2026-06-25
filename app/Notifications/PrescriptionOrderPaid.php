<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PrescriptionOrderPaid extends Notification implements \Illuminate\Contracts\Broadcasting\ShouldBroadcast
{
    use Queueable;

    public $invoiceNumber;

    public function __construct($invoiceNumber)
    {
        $this->invoiceNumber = $invoiceNumber;
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
        if ($notifiable->role === 'pharmacist') {
            return [
                'type' => 'prescription_order_paid',
                'title' => "🔥 [PRIORITAS UTAMA] Penebusan Resep Lunas {$this->invoiceNumber}",
                'message' => "Pelanggan telah melunasi pesanan hasil tebus resep {$this->invoiceNumber}. Sesuai standar darurat, segera siapkan dan racik obat ini sekarang juga!",
                'invoice_number' => $this->invoiceNumber,
                'url' => $notifiable->role === 'pharmacist' ? "/pharmacist/orders/" . $this->invoiceNumber : "/admin/orders/" . $this->invoiceNumber,
            ];
        }

        if ($notifiable->role === 'admin') {
            return [
                'type' => 'prescription_order_paid',
                'title' => "💸 [INFO] Pembayaran Resep Terverifikasi {$this->invoiceNumber}",
                'message' => "Dana untuk pesanan jalur resep {$this->invoiceNumber} telah lunas masuk ke dalam sistem.",
                'invoice_number' => $this->invoiceNumber,
                'url' => $notifiable->role === 'pharmacist' ? "/pharmacist/orders/" . $this->invoiceNumber : "/admin/orders/" . $this->invoiceNumber,
            ];
        }

        return [];
    }
}
