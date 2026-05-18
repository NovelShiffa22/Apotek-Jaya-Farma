import { useState } from 'react';
import Header from '../components/Header';
import { Upload, Check } from 'lucide-react';

export default function Checkout() {
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [paymentUploaded, setPaymentUploaded] = useState(false);

  const deliveryMethods = [
    { id: 'pickup', label: 'Ambil di Apotek', price: 0, time: 'Hari ini' },
    { id: 'courier', label: 'Kurir Toko', price: 15000, time: '1-2 jam' },
    { id: 'ojek', label: 'Ojek Online', price: 20000, time: '30-60 menit' }
  ];

  const selectedMethod = deliveryMethods.find(m => m.id === deliveryMethod)!;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
      <Header />

      <main className="max-w-[1440px] mx-auto px-8 py-12">
        <h1 className="font-['Roboto_Condensed',sans-serif] font-light text-[48px] tracking-[-1.2px] text-[#171d19] mb-10">
          Checkout
        </h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] tracking-[-0.6px] text-[#171d19] mb-6 font-semibold">
                Ringkasan Pesanan
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#f5f7f6] to-[#e8ede9] rounded-xl"></div>
                    <div>
                      <p className="font-['Roboto_Condensed',sans-serif] text-[18px] text-[#171d19] font-medium">Paracetamol 500mg</p>
                      <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">Qty: 2</p>
                    </div>
                  </div>
                  <p className="font-['Roboto_Condensed',sans-serif] text-[18px] text-[#171d19] font-semibold">Rp 30.000</p>
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-2xl p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] tracking-[-0.6px] text-[#171d19] mb-6 font-semibold">
                Metode Pengiriman
              </h2>
              <div className="space-y-3">
                {deliveryMethods.map(method => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-5 rounded-xl cursor-pointer transition-all duration-200 ${
                      deliveryMethod === method.id
                        ? 'bg-[rgba(0,106,63,0.08)] border-2 border-[#006a3f] shadow-[0_4px_12px_rgba(0,106,63,0.15)]'
                        : 'bg-[#f9fafb] border-2 border-[#f1f5f9] hover:border-[#006a3f]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        deliveryMethod === method.id ? 'border-[#006a3f] bg-[#006a3f]' : 'border-[#6e7a70]'
                      }`}>
                        {deliveryMethod === method.id && <Check size={14} className="text-white" />}
                      </div>
                      <input
                        type="radio"
                        name="delivery"
                        value={method.id}
                        checked={deliveryMethod === method.id}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div>
                        <span className="font-['Roboto_Condensed',sans-serif] text-[16px] text-[#171d19] font-medium block">
                          {method.label}
                        </span>
                        <span className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70]">
                          Estimasi: {method.time}
                        </span>
                      </div>
                    </div>
                    <span className="font-['Roboto_Condensed',sans-serif] text-[16px] text-[#171d19] font-semibold">
                      {method.price === 0 ? 'Gratis' : `Rp ${method.price.toLocaleString('id-ID')}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Upload Sections */}
            <div className="bg-white rounded-2xl p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] tracking-[-0.6px] text-[#171d19] mb-6 font-semibold">
                Upload Dokumen
              </h2>

              <div className="space-y-6">
                {/* Prescription Upload */}
                <div>
                  <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                    Resep Fisik (diserahkan via kurir)
                  </label>
                  <div
                    onClick={() => setPrescriptionUploaded(true)}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                      prescriptionUploaded
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-[#f9fafb] border-[#e5e7eb] hover:border-[#006a3f] hover:bg-white'
                    }`}
                  >
                    {prescriptionUploaded ? (
                      <>
                        <div className="w-12 h-12 bg-emerald-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <Check className="text-white" size={24} />
                        </div>
                        <p className="font-['Inter',sans-serif] text-[14px] text-emerald-700 font-semibold">
                          Resep berhasil diupload
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="mx-auto mb-3 text-[#6e7a70]" size={36} />
                        <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                          Klik untuk upload foto resep
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Payment Proof Upload */}
                <div>
                  <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                    Bukti Pembayaran
                  </label>
                  <div
                    onClick={() => setPaymentUploaded(true)}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                      paymentUploaded
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-[#f9fafb] border-[#e5e7eb] hover:border-[#006a3f] hover:bg-white'
                    }`}
                  >
                    {paymentUploaded ? (
                      <>
                        <div className="w-12 h-12 bg-emerald-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <Check className="text-white" size={24} />
                        </div>
                        <p className="font-['Inter',sans-serif] text-[14px] text-emerald-700 font-semibold">
                          Bukti pembayaran berhasil diupload
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="mx-auto mb-3 text-[#6e7a70]" size={36} />
                        <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                          Klik untuk upload bukti transfer
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.08)] sticky top-32">
              <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] tracking-[-0.6px] text-[#171d19] mb-6 font-semibold">
                Total Pembayaran
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-[#f1f5f9]">
                <div className="flex justify-between">
                  <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">Subtotal Produk</p>
                  <p className="font-['Inter',sans-serif] text-[14px] text-[#171d19] font-medium">Rp 30.000</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">Biaya Pengiriman</p>
                  <p className="font-['Inter',sans-serif] text-[14px] text-[#171d19] font-medium">
                    {selectedMethod.price === 0 ? 'Gratis' : `Rp ${selectedMethod.price.toLocaleString('id-ID')}`}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-8">
                <p className="font-['Roboto_Condensed',sans-serif] text-[18px] text-[#171d19] font-semibold">Total</p>
                <p className="font-['Roboto_Condensed',sans-serif] text-[32px] text-[#006a3f] font-semibold tracking-[-0.8px]">
                  Rp {(30000 + selectedMethod.price).toLocaleString('id-ID')}
                </p>
              </div>

              <button className="w-full bg-[#006a3f] hover:bg-[#005632] px-6 py-4 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white hover:shadow-[0_12px_32px_rgba(0,106,63,0.3)] transition-all duration-300 hover:-translate-y-0.5 font-medium">
                Konfirmasi Pesanan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
