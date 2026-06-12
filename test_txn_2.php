<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$txn = \App\Models\VirtualTransaction::latest()->first();
if ($txn) {
    echo "Latest Transaction ID: " . $txn->id . "\n";
    echo "Snap Token: " . ($txn->snap_token ? $txn->snap_token : "NULL/EMPTY") . "\n";
    echo "Status: " . $txn->status . "\n";
} else {
    echo "No transactions found.\n";
}
