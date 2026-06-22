<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
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
                'name' => 'Apt. Nida Hijria Almany, S.Farm.',
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

        $this->call([
            SettingSeeder::class,
            MasterDataSeeder::class,
            ProductSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
