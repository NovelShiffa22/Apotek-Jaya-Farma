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
                if ($request->transaction_status == 'capture' || $request->transaction_status == 'settlement') {
                    $transaction->update(['status' => 'Lunas']);
                } else if ($request->transaction_status == 'expire') {
                    $transaction->update(['status' => 'Expired']);
                } else if ($request->transaction_status == 'cancel' || $request->transaction_status == 'deny') {
                    $transaction->update(['status' => 'Dibatalkan']);
                } else if ($request->transaction_status == 'pending') {
                    $transaction->update(['status' => 'Pending']);
                }
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
