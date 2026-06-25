<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PrescriptionSubmitted extends Notification implements ShouldBroadcast
{
    use Queueable;

    public $prescriptionId;

    /**
     * Create a new notification instance.
     */
    public function __construct($prescriptionId)
    {
        $this->prescriptionId = $prescriptionId;
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
        if (in_array($notifiable->role, ['admin', 'pharmacist'])) {
            return [
                'type' => 'prescription_submitted',
                'title' => 'Resep Baru Masuk',
                'message' => "Ada resep baru {$this->prescriptionId} yang membutuhkan verifikasi Apoteker.",
                'prescription_id' => $this->prescriptionId,
                'url' => in_array($notifiable->role, ['admin', 'pharmacist']) ? "/pharmacist/prescriptions/" . $this->prescriptionId : "/prescriptions/" . $this->prescriptionId,
            ];
        }

        return [
            'type' => 'prescription_submitted',
            'title' => 'Resep Berhasil Diunggah',
            'message' => "Resepmu {$this->prescriptionId} sukses dikirim! Mohon tunggu sebentar ya, apoteker kami sedang memeriksa kelengkapan medisnya.",
            'prescription_id' => $this->prescriptionId,
                'url' => in_array($notifiable->role, ['admin', 'pharmacist']) ? "/pharmacist/prescriptions/" . $this->prescriptionId : "/prescriptions/" . $this->prescriptionId,
        ];
    }
}
