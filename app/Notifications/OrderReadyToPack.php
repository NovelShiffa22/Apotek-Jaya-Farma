<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderReadyToPack extends Notification implements \Illuminate\Contracts\Broadcasting\ShouldBroadcast
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
        if ($notifiable->role === 'admin') {
            return [
                'type' => 'order_ready',
                'title' => '📦 [PERLU DIKEMAS] Pesanan Baru Siap Disiapkan',
                'message' => "Pesanan {$this->invoiceNumber} telah lunas. Segera siapkan produk dari rak penyimpanan.",
                'invoice_number' => $this->invoiceNumber,
                'url' => $notifiable->role === 'pharmacist' ? "/pharmacist/orders/" . $this->invoiceNumber : "/admin/orders/" . $this->invoiceNumber,
            ];
        }

        if ($notifiable->role === 'pharmacist') {
            return [
                'type' => 'order_ready',
                'title' => '📦 [PERLU DIKEMAS] Pesanan Baru Siap Disiapkan',
                'message' => "Pesanan {$this->invoiceNumber} telah lunas. Segera lakukan pengemasan produk sesuai manifest.",
                'invoice_number' => $this->invoiceNumber,
                'url' => $notifiable->role === 'pharmacist' ? "/pharmacist/orders/" . $this->invoiceNumber : "/admin/orders/" . $this->invoiceNumber,
            ];
        }

        return [];
    }
}
