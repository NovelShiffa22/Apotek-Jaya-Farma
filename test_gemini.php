<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Gemini\Laravel\Facades\Gemini;

try {
    $result = Gemini::generativeModel(model: 'gemini-2.5-flash')->generateContent('Hello');
    echo "SUCCESS: \n" . $result->text();
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
