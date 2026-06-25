<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class OrderEntered extends Notification implements ShouldBroadcast
{
    use Queueable;

    public $invoiceNumber;

    /**
     * Create a new notification instance.
     */
    public function __construct($invoiceNumber)
    {
        $this->invoiceNumber = $invoiceNumber;
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
        if ($notifiable->role === 'admin') {
            return [
                'type' => 'order_entered',
                'title' => "💸 [INFO] Transaksi Baru Selesai {$this->invoiceNumber}",
                'message' => "Pembayaran untuk pesanan {$this->invoiceNumber} telah terverifikasi oleh sistem.",
                'invoice_number' => $this->invoiceNumber,
                'url' => $notifiable->role === 'admin' ? "/admin/orders/" . $this->invoiceNumber : "/profile/orders/" . $this->invoiceNumber,
            ];
        }

        return [
            'type' => 'order_entered',
            'title' => '✅ Pembayaran Berhasil & Diproses',
            'message' => "Pembayaran untuk {$this->invoiceNumber} sukses! Staf apotek sedang menyiapkan dan mengemas produk Anda.",
            'invoice_number' => $this->invoiceNumber,
                'url' => $notifiable->role === 'admin' ? "/admin/orders/" . $this->invoiceNumber : "/profile/orders/" . $this->invoiceNumber,
        ];
    }
}
