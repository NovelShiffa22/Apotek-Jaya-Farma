<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VirtualTransaction;
use Illuminate\Support\Facades\Log;

class MidtransController extends Controller
{
    public function callback(Request $request)
    {
        $serverKey = config('midtrans.server_key');
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);
        
        if ($hashed == $request->signature_key) {
            $transaction = VirtualTransaction::find($request->order_id);
            
            if ($transaction) {
                try {
                    if (isset($request->va_numbers) && is_array($request->va_numbers) && count($request->va_numbers) > 0) {
                        $transaction->bank_name = strtoupper($request->va_numbers[0]['bank'] ?? '');
                        $transaction->va_number = $request->va_numbers[0]['va_number'] ?? null;
                    } elseif ($request->payment_type == 'cstore') {
                        $transaction->bank_name = strtoupper($request->store ?? 'GERAI RETAIL');
                        $transaction->va_number = $request->payment_code ?? null;
                    } elseif ($request->payment_type == 'echannel' || $request->has('bill_key')) {
                        $transaction->bank_name = 'MANDIRI BILL';
                        $transaction->va_number = ($request->biller_code ?? '') . ' - ' . ($request->bill_key ?? '');
                    } else {
                        $transaction->bank_name = strtoupper($request->payment_type ?? 'E-WALLET');
                        $transaction->va_number = $request->transaction_id ?? null;
                    }
                } catch (\Exception $e) {
                    // Safe fallback
                    Log::error("Midtrans universal parsing error: " . $e->getMessage());
                }

                if ($request->transaction_status == 'capture' || $request->transaction_status == 'settlement') {
                    $transaction->status = 'Lunas';
                    if ($transaction->prescription_id) {
                        \App\Models\Prescription::where('id', $transaction->prescription_id)
                            ->update(['status_validasi' => 'telah_dipesan']);
                    }
                } else if ($request->transaction_status == 'expire') {
                    $transaction->status = 'Expired';
                } else if ($request->transaction_status == 'cancel' || $request->transaction_status == 'deny') {
                    $transaction->status = 'Dibatalkan';
                } else if ($request->transaction_status == 'pending') {
                    $transaction->status = 'Pending';
                }
                
                $transaction->save();
            } else {
                Log::warning("Midtrans callback received for unknown order_id: " . $request->order_id);
            }
        } else {
            Log::error("Midtrans callback signature mismatch for order_id: " . $request->order_id);
            return response()->json(['status' => 'error', 'message' => 'Invalid signature'], 403);
        }
        
        return response()->json(['status' => 'success']);
    }
}
