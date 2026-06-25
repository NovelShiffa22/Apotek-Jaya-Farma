<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin Jaya Farma',
                'phone' => '081234567890',
                'role' => 'admin',
                'password' => \Illuminate\Support\Facades\Hash::make('11223344'),
            ]
        );

        // Pharmacist
        User::updateOrCreate(
            ['email' => 'pharmacist@gmail.com'],
            [
                'name' => 'Apt. Farida Maharani, S.Farm',
                'phone' => '081234567891',
                'role' => 'pharmacist',
                'password' => \Illuminate\Support\Facades\Hash::make('11223344'),
            ]
        );

        // Standard user
        User::updateOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'User Biasa',
                'phone' => '081234567892',
                'role' => 'user',
                'password' => \Illuminate\Support\Facades\Hash::make('11223344'),
            ]
        );

        // 10 Pelanggan Dummy
        $faker = \Faker\Factory::create('id_ID');
        for ($i = 1; $i <= 10; $i++) {
            User::updateOrCreate(
                ['email' => "pelanggan{$i}@gmail.com"],
                [
                    'name' => $faker->name,
                    'phone' => preg_replace('/[^0-9]/', '', $faker->phoneNumber),
                    'role' => 'user',
                    'password' => \Illuminate\Support\Facades\Hash::make('11223344'),
                ]
            );
        }

        $users = User::where('role', 'user')->pluck('id');
        $faker = \Faker\Factory::create('id_ID');
        $bandungCount = 0;
        foreach ($users as $userId) {
            $isBandung = $bandungCount < 6;
            $kota = $isBandung ? 'Bandung' : $faker->city;
            if ($isBandung) $bandungCount++;

            \Illuminate\Support\Facades\DB::table('addresses')->insertOrIgnore([
                'user_id' => $userId, 
                'label' => 'Rumah',
                'alamat_lengkap' => $isBandung ? 'Jl. Buah Batu No. ' . rand(1, 100) . ', Bandung' : $faker->streetAddress, 
                'kota' => $kota,
                'provinsi' => $isBandung ? 'Jawa Barat' : $faker->state,
                'kode_pos' => $isBandung ? '40262' : $faker->postcode,
                'is_default' => true
            ]);
        }


    }
}
