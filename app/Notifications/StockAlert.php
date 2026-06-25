<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StockAlert extends Notification implements \Illuminate\Contracts\Broadcasting\ShouldBroadcast
{
    use Queueable;

    public $productName;

    public function __construct($productName)
    {
        $this->productName = $productName;
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
                'type' => 'stock_alert',
                'title' => '⚠️ [STOK KRITIS] Peringatan Ketersediaan Produk',
                'message' => "Stok produk {$this->productName} hampir habis atau telah menyentuh batas minimum. Segera lakukan pemesanan ulang!",
                'product_name' => $this->productName,
                'url' => "/admin/products",
            ];
        }

        return [];
    }
}
