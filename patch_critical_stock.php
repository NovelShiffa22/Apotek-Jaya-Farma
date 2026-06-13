<?php
$file = 'e:\NGODING\Laravel\Apotek-Jaya-Farma\routes\web.php';
$content = file_get_contents($file);

$search = <<<'EOD'
        $analytics['user_counts'] = [
            'total' => $userCount,
            'admin' => $adminCount,
            'pharmacist' => $pharmacistCount,
            'customer' => $customerCount
        ];
EOD;

$replace = <<<'EOD'
        $analytics['user_counts'] = [
            'total' => $userCount,
            'admin' => $adminCount,
            'pharmacist' => $pharmacistCount,
            'customer' => $customerCount
        ];

        $analytics['critical_stock_products'] = \App\Models\Product::whereRaw('stok <= COALESCE(stok_minimum, 10)')->get();
EOD;

$content = str_replace($search, $replace, $content);
file_put_contents($file, $content);
echo "Critical stock products added to analytics in routes/web.php\n";
