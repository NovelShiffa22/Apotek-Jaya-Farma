import { useState } from 'react';
import Header from '../components/Header';
import { CheckCircle2, AlertCircle, XCircle, Thermometer, Wind, Droplet, Brain, FileText, Baby, Frown, Activity } from 'lucide-react';

const symptomsData = [
  { id: 'demam', label: 'Demam', icon: Thermometer },
  { id: 'batuk-kering', label: 'Batuk Kering', icon: Wind },
  { id: 'pilek', label: 'Pilek', icon: Droplet },
  { id: 'sakit-tenggorokan', label: 'Sakit Tenggorokan', icon: FileText },
  { id: 'pusing', label: 'Pusing', icon: Brain },
  { id: 'lemas', label: 'Lemas', icon: Activity },
  { id: 'sesak-napas', label: 'Sesak Napas', icon: Wind },
  { id: 'mual', label: 'Mual', icon: Frown },
];

export default function Recommendation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [ageInput, setAgeInput] = useState('');
  const [gender, setGender] = useState('');
  const [showResults, setShowResults] = useState(false);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedSymptoms.length > 0) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const recommendations = {
    recommended: [
      { name: 'Paracetamol 500mg', reason: 'Efektif untuk demam dan sakit kepala', price: 15000 },
      { name: 'Vitamin C 1000mg', reason: 'Meningkatkan daya tahan tubuh', price: 85000 },
    ],
    considered: [
      { name: 'Ibuprofen 400mg', reason: 'Alternatif untuk nyeri dan demam', price: 20000 },
    ],
    notRecommended: [
      { name: 'Aspirin', reason: 'Tidak direkomendasikan untuk usia di bawah 18 tahun', price: 18000 },
    ]
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

          {/* Step Indicator - From Figma */}
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

              {/* Icon Grid - From Figma */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {symptomsData.map(symptom => (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      selectedSymptoms.includes(symptom.id)
                        ? 'border-[#006a3f] bg-[rgba(0,106,63,0.05)]'
                        : 'border-[#bdcabe] hover:border-[#006a3f] bg-white'
                    }`}
                  >
                    <symptom.icon className={`w-8 h-8 mx-auto mb-3 ${
                      selectedSymptoms.includes(symptom.id) ? 'text-[#006a3f]' : 'text-[#3e4a41]'
                    }`} />
                    <p className="font-['Inter',sans-serif] text-[14px] text-[#171d19] text-center">
                      {symptom.label}
                    </p>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={selectedSymptoms.length === 0}
                className={`w-full py-4 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] font-medium transition-all ${
                  selectedSymptoms.length > 0
                    ? 'bg-[#006a3f] text-white hover:bg-[#005632] hover:shadow-lg'
                    : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                }`}
              >
                Lanjut ke Langkah 2
              </button>
            </div>
          )}

          {/* Step 2: Age & Gender */}
          {currentStep === 2 && !showResults && (
            <div className="bg-white rounded-2xl p-10 border border-[#f1f5f9] shadow-sm">
              <div className="flex items-start gap-3 mb-8">
                <div className="w-5 h-5 bg-[#2d5f9f] rounded flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-semibold text-[#171d19] mb-2">
                    Berapa usia Anda?
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
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Contoh: 25"
                      value={ageInput}
                      onChange={(e) => setAgeInput(e.target.value)}
                      className="col-span-1 px-5 py-4 bg-[#f9fafb] rounded-xl font-['Inter',sans-serif] text-[16px] border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/30 focus:border-[#006a3f]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setGender('pria')}
                      className={`px-6 py-4 rounded-xl font-['Inter',sans-serif] text-[16px] font-medium border-2 transition-all ${
                        gender === 'pria'
                          ? 'border-[#006a3f] bg-[rgba(0,106,63,0.05)] text-[#006a3f]'
                          : 'border-[#e5e7eb] bg-white text-[#171d19] hover:border-[#006a3f]'
                      }`}
                    >
                      Pria
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('wanita')}
                      className={`px-6 py-4 rounded-xl font-['Inter',sans-serif] text-[16px] font-medium border-2 transition-all ${
                        gender === 'wanita'
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
                    className="flex-1 bg-[#006a3f] text-white px-10 py-4 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] font-medium hover:bg-[#005632] hover:shadow-lg transition-all"
                  >
                    Lihat Rekomendasi →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className="space-y-6">
              <h2 className="font-['Roboto_Condensed',sans-serif] text-[32px] font-semibold text-[#171d19] mb-8">
                Hasil Rekomendasi
              </h2>

              {/* Recommended */}
              <div className="bg-white rounded-2xl p-8 border-2 border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="text-white" size={22} />
                  </div>
                  <h3 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-semibold text-[#171d19]">
                    Direkomendasikan
                  </h3>
                </div>
                <div className="space-y-4">
                  {recommendations.recommended.map((item, idx) => (
                    <div key={idx} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19]">{item.name}</p>
                        <p className="font-['Inter',sans-serif] text-[16px] text-emerald-600 font-bold">
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <p className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Considered */}
              <div className="bg-white rounded-2xl p-8 border border-amber-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="text-white" size={22} />
                  </div>
                  <h3 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-semibold text-[#171d19]">
                    Dipertimbangkan
                  </h3>
                </div>
                <div className="space-y-4">
                  {recommendations.considered.map((item, idx) => (
                    <div key={idx} className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19]">{item.name}</p>
                        <p className="font-['Inter',sans-serif] text-[16px] text-amber-600 font-bold">
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <p className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Not Recommended */}
              <div className="bg-white rounded-2xl p-8 border border-red-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                    <XCircle className="text-white" size={22} />
                  </div>
                  <h3 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-semibold text-[#171d19]">
                    Tidak Disarankan
                  </h3>
                </div>
                <div className="space-y-4">
                  {recommendations.notRecommended.map((item, idx) => (
                    <div key={idx} className="bg-red-50 rounded-xl p-6 border border-red-100">
                      <p className="font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19] mb-2">{item.name}</p>
                      <p className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
