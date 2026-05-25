import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Header from '../components/Header';
import { CheckCircle2, AlertCircle, XCircle, Thermometer, Wind, Droplet, Brain, FileText, Baby, Frown, Activity } from 'lucide-react';

const localSymptomsData = [
  { id: 1, label: 'Demam', icon: Thermometer },
  { id: 2, label: 'Batuk Kering', icon: Wind },
  { id: 3, label: 'Pilek', icon: Droplet },
  { id: 4, label: 'Sakit Tenggorokan', icon: FileText },
  { id: 5, label: 'Pusing', icon: Brain },
  { id: 6, label: 'Lemas', icon: Activity },
  { id: 7, label: 'Sesak Napas', icon: Wind },
  { id: 8, label: 'Mual', icon: Frown },
];

export default function Recommendation({ masterSymptoms }: { masterSymptoms?: any[] }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Jika masterSymptoms dari Laravel dikirim, pakai itu. Kalau tidak, fallback ke lokal.
  const displaySymptoms = masterSymptoms && masterSymptoms.length > 0 ? masterSymptoms : localSymptomsData;

  const { data, setData, post, processing, errors } = useForm({
    symptoms: [] as (number | string)[],
    usia: '',
    jenis_kelamin: ''
  });

  const toggleSymptom = (symptomId: number | string) => {
    const newSymptoms = data.symptoms.includes(symptomId)
      ? data.symptoms.filter(s => s !== symptomId)
      : [...data.symptoms, symptomId];
    
    setData('symptoms', newSymptoms);
  };

  const handleNext = () => {
    if (currentStep === 1 && data.symptoms.length > 0) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/rekomendasi/proses');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
      <Header />

      <main className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="max-w-[800px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-['Roboto_Condensed',sans-serif] font-bold text-[48px] tracking-[-1.2px] text-[#171d19] mb-4">
              Rekomendasi Cerdas
            </h1>
            <p className="font-['Inter',sans-serif] text-[18px] text-[#3e4a41] leading-relaxed max-w-[600px] mx-auto">
              Temukan solusi kesehatan yang tepat berdasarkan gejala yang Anda alami dalam 2 langkah mudah.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-12">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`flex items-center gap-3 ${currentStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-['Inter',sans-serif] text-[14px] font-bold ${
                  currentStep >= 1
                    ? 'bg-[#006a3f] text-white'
                    : 'border-2 border-[#6e7a70] text-[#171d19]'
                }`}>
                  1
                </div>
                <span className="font-['Inter',sans-serif] text-[12px] font-bold tracking-wider text-[#006a3f] uppercase">
                  GEJALA
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className={`w-12 h-px mx-4 ${currentStep >= 2 ? 'bg-[#006a3f]' : 'bg-[#bdcabe]'}`} />

            {/* Step 2 */}
            <div className="flex items-center">
              <div className={`flex items-center gap-3 ${currentStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-['Inter',sans-serif] text-[14px] font-bold ${
                  currentStep >= 2
                    ? 'bg-[#006a3f] text-white'
                    : 'border-2 border-[#6e7a70] text-[#171d19]'
                }`}>
                  2
                </div>
                <span className="font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase text-[#171d19]">
                  USIA
                </span>
              </div>
            </div>
          </div>

          {/* Step 1: Symptoms */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl p-10 border border-[#f1f5f9] shadow-sm">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-5 h-5 bg-[#2d5f9f] rounded flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-semibold text-[#171d19] mb-2">
                    Apa yang Anda rasakan?
                  </h2>
                  <p className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">
                    Pilih satu atau lebih gejala yang sedang dialami (Pilih minimal 1).
                  </p>
                </div>
              </div>

              {/* Error Validation for Symptoms (if any) */}
              {errors.symptoms && (
                <div className="mb-4 text-red-500 text-sm">{errors.symptoms}</div>
              )}

              {/* Icon Grid */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {displaySymptoms.map((symptom: any) => {
                  const Icon = symptom.icon || Activity;
                  const symptomId = symptom.id;
                  const isSelected = data.symptoms.includes(symptomId);
                  const label = symptom.nama_gejala || symptom.label;

                  return (
                    <button
                      key={symptomId}
                      onClick={() => toggleSymptom(symptomId)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-[#006a3f] bg-[rgba(0,106,63,0.05)]'
                          : 'border-[#bdcabe] hover:border-[#006a3f] bg-white'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-3 ${
                        isSelected ? 'text-[#006a3f]' : 'text-[#3e4a41]'
                      }`} />
                      <p className="font-['Inter',sans-serif] text-[14px] text-[#171d19] text-center">
                        {label}
                      </p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={data.symptoms.length === 0}
                className={`w-full py-4 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] font-medium transition-all ${
                  data.symptoms.length > 0
                    ? 'bg-[#006a3f] text-white hover:bg-[#005632] hover:shadow-lg'
                    : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                }`}
              >
                Lanjut ke Langkah 2
              </button>
            </div>
          )}

          {/* Step 2: Age & Gender */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl p-10 border border-[#f1f5f9] shadow-sm">
              <div className="flex items-start gap-3 mb-8">
                <div className="w-5 h-5 bg-[#2d5f9f] rounded flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-semibold text-[#171d19] mb-2">
                    Identitas Singkat
                  </h2>
                  <p className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">
                    Usia sangat menentukan jenis dan dosis obat yang tepat.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="font-['Inter',sans-serif] text-[12px] font-bold text-[#6e7a70] tracking-wider uppercase block mb-3">
                    USIA (TAHUN)
                  </label>
                  
                  {errors.usia && (
                    <div className="mb-2 text-red-500 text-sm">{errors.usia}</div>
                  )}
                  {errors.jenis_kelamin && (
                    <div className="mb-2 text-red-500 text-sm">{errors.jenis_kelamin}</div>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Contoh: 25"
                      value={data.usia}
                      onChange={(e) => setData('usia', e.target.value)}
                      className="col-span-1 px-5 py-4 bg-[#f9fafb] rounded-xl font-['Inter',sans-serif] text-[16px] border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/30 focus:border-[#006a3f]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setData('jenis_kelamin', 'pria')}
                      className={`px-6 py-4 rounded-xl font-['Inter',sans-serif] text-[16px] font-medium border-2 transition-all ${
                        data.jenis_kelamin === 'pria'
                          ? 'border-[#006a3f] bg-[rgba(0,106,63,0.05)] text-[#006a3f]'
                          : 'border-[#e5e7eb] bg-white text-[#171d19] hover:border-[#006a3f]'
                      }`}
                    >
                      Pria
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('jenis_kelamin', 'wanita')}
                      className={`px-6 py-4 rounded-xl font-['Inter',sans-serif] text-[16px] font-medium border-2 transition-all ${
                        data.jenis_kelamin === 'wanita'
                          ? 'border-[#006a3f] bg-[rgba(0,106,63,0.05)] text-[#006a3f]'
                          : 'border-[#e5e7eb] bg-white text-[#171d19] hover:border-[#006a3f]'
                      }`}
                    >
                      Wanita
                    </button>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 flex gap-3">
                  <div className="w-5 h-5 bg-[#2d5f9f] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 4V6M6 8H6.005M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="font-['Inter',sans-serif] text-[14px] text-[#1e40af] leading-relaxed">
                    Layanan ini hanya memberikan saran produk kesehatan umum. Jika gejala berat atau memburuk, segera hubungi dokter atau layanan darurat.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-8 py-4 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] font-medium text-[#171d19] bg-[#f9fafb] hover:bg-[#e5e7eb] transition-all"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={processing || !data.usia || !data.jenis_kelamin}
                    className="flex-1 bg-[#006a3f] text-white px-10 py-4 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] font-medium hover:bg-[#005632] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Memproses...' : 'Lihat Rekomendasi →'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
