<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class StockCritical extends Notification implements ShouldBroadcast
{
    use Queueable;

    public $productName;
    public $productId;
    public $remainingStock;

    /**
     * Create a new notification instance.
     */
    public function __construct($productName, $productId, $remainingStock)
    {
        $this->productName = $productName;
        $this->productId = $productId;
        $this->remainingStock = $remainingStock;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'stock_critical',
            'title' => 'Peringatan Stok Kritis',
            'message' => "Peringatan! Stok obat {$this->productName} (ID: {$this->productId}) kritis, tersisa {$this->remainingStock} unit.",
            'product_id' => $this->productId,
            'product_name' => $this->productName,
                'url' => "/admin/products",
            'remaining_stock' => $this->remainingStock,
        ];
    }
}
