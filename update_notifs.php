<?php
$files = [
    'app/Notifications/OrderEntered.php',
    'app/Notifications/OrderReadyToPack.php',
    'app/Notifications/PrescriptionOrderPaid.php',
    'app/Notifications/PrescriptionSubmitted.php',
    'app/Notifications/PrescriptionVerified.php',
    'app/Notifications/StockAlert.php',
    'app/Notifications/StockCritical.php',
];

foreach ($files as $file) {
    if (!file_exists($file)) continue;
    $content = file_get_contents($file);

    // OrderEntered.php
    if (strpos($file, 'OrderEntered.php') !== false) {
        $content = preg_replace("/'invoice_number' => \\\$this->invoiceNumber,/", "'invoice_number' => \$this->invoiceNumber,\n                'url' => \$notifiable->role === 'admin' ? \"/admin/orders/\" . \$this->invoiceNumber : \"/profile/orders/\" . \$this->invoiceNumber,", $content);
    }
    
    // OrderReadyToPack.php
    if (strpos($file, 'OrderReadyToPack.php') !== false) {
        $content = preg_replace("/'invoice_number' => \\\$this->invoiceNumber,/", "'invoice_number' => \$this->invoiceNumber,\n                'url' => \$notifiable->role === 'apoteker' ? \"/pharmacist/orders/\" . \$this->invoiceNumber : \"/admin/orders/\" . \$this->invoiceNumber,", $content);
    }
    
    // PrescriptionOrderPaid.php
    if (strpos($file, 'PrescriptionOrderPaid.php') !== false) {
        $content = preg_replace("/'invoice_number' => \\\$this->invoiceNumber,/", "'invoice_number' => \$this->invoiceNumber,\n                'url' => \$notifiable->role === 'apoteker' ? \"/pharmacist/orders/\" . \$this->invoiceNumber : \"/admin/orders/\" . \$this->invoiceNumber,", $content);
    }

    // PrescriptionSubmitted.php
    if (strpos($file, 'PrescriptionSubmitted.php') !== false) {
        $content = preg_replace("/'prescription_id' => \\\$this->prescriptionId,/", "'prescription_id' => \$this->prescriptionId,\n                'url' => in_array(\$notifiable->role, ['admin', 'apoteker']) ? \"/pharmacist/prescriptions/\" . \$this->prescriptionId : \"/prescriptions/\" . \$this->prescriptionId,", $content);
    }

    // PrescriptionVerified.php
    if (strpos($file, 'PrescriptionVerified.php') !== false) {
        $content = preg_replace("/'prescription_id' => \\\$this->prescriptionId,/", "'prescription_id' => \$this->prescriptionId,\n                    'url' => \"/prescriptions/\" . \$this->prescriptionId,", $content);
    }

    // StockAlert.php
    if (strpos($file, 'StockAlert.php') !== false) {
        $content = preg_replace("/'product_name' => \\\$this->productName,/", "'product_name' => \$this->productName,\n                'url' => \"/admin/products\",", $content);
    }

    // StockCritical.php
    if (strpos($file, 'StockCritical.php') !== false) {
        $content = preg_replace("/'product_name' => \\\$this->productName,/", "'product_name' => \$this->productName,\n                'url' => \"/admin/products\",", $content);
    }

    file_put_contents($file, $content);
}
echo "Notification classes updated with url.\n";
