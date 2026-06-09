<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $users = User::pluck('id');
        if($users->isEmpty()){ 
            $u = User::factory()->create(); 
            $users->push($u->id); 
        }

        DB::table('shipping_methods')->insertOrIgnore([
            'id' => 1, 
            'nama_metode' => 'Reguler', 
            'tipe' => 'standard',
            'biaya' => 15000,
            'estimasi_waktu' => '2-3 hari',
            'is_active' => true
        ]);

        DB::table('addresses')->insertOrIgnore([
            'id' => 1, 
            'user_id' => $users->first(), 
            'label' => 'Rumah',
            'alamat_lengkap' => 'Jl. Dummy No 1', 
            'kota' => 'Jakarta',
            'provinsi' => 'DKI Jakarta',
            'kode_pos' => '12345',
            'is_default' => true
        ]);

        for($i=0; $i<150; $i++){ 
            $date = now()->subDays(rand(0, 89))->setTime(rand(8,20), rand(0,59)); 
            Order::create([
                'kode_pesanan' => 'ORD-' . strtoupper(Str::random(6)), 
                'user_id' => $users->random(), 
                'address_id' => 1,
                'shipping_method_id' => 1,
                'status' => (rand(1, 10) > 2 ? 'selesai' : 'diproses'), 
                'subtotal_produk' => rand(5, 50) * 10000, 
                'biaya_pengiriman' => 15000, 
                'biaya_layanan' => 2000, 
                'total_biaya' => rand(6, 60) * 10000, 
                'created_at' => $date, 
                'updated_at' => $date
            ]); 
        }

        $products = Product::all();
        if ($products->isNotEmpty()) {
            $orders = Order::all();

            foreach ($orders as $order) {
                if ($order->products()->count() > 0) continue;
                
                $numItems = rand(1, 3);
                $selectedProducts = $products->random(min($numItems, $products->count()));
                
                $subtotal = 0;
                foreach ($selectedProducts as $product) {
                    $qty = rand(1, 3);
                    $harga = $product->harga;
                    $total = $qty * $harga;
                    $subtotal += $total;
                    
                    DB::table('order_items')->insert([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'kuantitas' => $qty,
                        'harga_satuan' => $harga,
                        'subtotal' => $total,
                        'created_at' => $order->created_at,
                        'updated_at' => $order->created_at,
                    ]);
                }
                
                $order->update([
                    'subtotal_produk' => $subtotal,
                    'total_biaya' => $subtotal + $order->biaya_pengiriman + $order->biaya_layanan
                ]);
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
