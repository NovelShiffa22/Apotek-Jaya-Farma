<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Share apotek_settings globally to all Inertia pages
        Inertia::share([
            'apotekInfo' => function () {
                try {
                    $settings = DB::table('apotek_settings')->get()->pluck('value', 'key');
                    return [
                        'deskripsi'       => $settings->get('deskripsi', 'Apotek Jaya Farma adalah unit usaha pelayanan kefarmasian dan produk kesehatan swasta yang telah berdiri sejak tahun 1971 di Kota Bandung.'),
                        'alamat'          => $settings->get('alamat', 'Jl. Malabar No. 50, Kecamatan Lengkong, Kota Bandung'),
                        'jam_operasional' => $settings->get('jam_operasional', '08.00 - 18.00 WIB'),
                        'kontak'          => $settings->get('kontak', '+62 813-1532-4311'),
                    ];
                } catch (\Exception $e) {
                    // Gracefully degrade if table doesn't exist yet
                    return [
                        'deskripsi'       => 'Apotek Jaya Farma adalah unit usaha pelayanan kefarmasian dan produk kesehatan swasta yang telah berdiri sejak tahun 1971 di Kota Bandung.',
                        'alamat'          => 'Jl. Malabar No. 50, Kecamatan Lengkong, Kota Bandung',
                        'jam_operasional' => '08.00 - 18.00 WIB',
                        'kontak'          => '+62 813-1532-4311',
                    ];
                }
            },
        ]);
    }
}
