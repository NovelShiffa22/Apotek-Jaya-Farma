<?php
$files = [
    'app/Notifications/PrescriptionVerified.php',
    'app/Notifications/PrescriptionSubmitted.php',
    'app/Notifications/PrescriptionOrderPaid.php',
    'app/Notifications/OrderReadyToPack.php'
];

foreach ($files as $file) {
    if (!file_exists($file)) continue;
    $content = file_get_contents($file);

    // Replace role checks
    $content = preg_replace("/'admin',\s*'apoteker'/", "'admin', 'pharmacist'", $content);
    $content = preg_replace("/===\s*'apoteker'/", "=== 'pharmacist'", $content);

    file_put_contents($file, $content);
}
echo "Replaced 'apoteker' with 'pharmacist' in role checks.\n";
