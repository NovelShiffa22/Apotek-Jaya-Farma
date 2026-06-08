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
        User::create([
            'name' => 'Admin Jaya Farma',
            'email' => 'admin@gmail.com',
            'phone' => '081234567890',
            'role' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('11223344'),
        ]);

        // Pharmacist
        User::create([
            'name' => 'Apoteker Jaya Farma',
            'email' => 'pharmacist@gmail.com',
            'phone' => '081234567891',
            'role' => 'pharmacist',
            'password' => \Illuminate\Support\Facades\Hash::make('11223344'),
        ]);

        // Standard user
        User::create([
            'name' => 'User Biasa',
            'email' => 'user@gmail.com',
            'phone' => '081234567892',
            'role' => 'user',
            'password' => \Illuminate\Support\Facades\Hash::make('11223344'),
        ]);

        $this->call([
            MasterDataSeeder::class,
            ProductSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
