<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            'whatsapp_number' => '6281315324311',
            'nama_apotek' => 'Apotek Jaya Farma',
            'alamat_fisik' => 'Jl. Malabar No. 50, Kecamatan Lengkong, Kota Bandung',
            'jam_operasional' => '08.00 - 18.00 WIB (Buka setiap hari, kecuali hari libur)',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }
}
