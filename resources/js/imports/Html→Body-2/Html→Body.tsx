import svgPaths from "./svg-9qco2bbas9";
import imgAmoxicillinBox from "./31d14a55b63b6cfa9ae936dd7da38ce66a17f514.png";

function AmoxicillinBox() {
  return (
    <div className="h-[454.66px] relative shrink-0 w-full" data-name="Amoxicillin Box">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAmoxicillinBox} />
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#ba1a1a] relative rounded-[9999px] shrink-0 size-[20px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-[3px] pt-[2px] relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white w-[7.52px]">
          <p className="leading-[15px]">G</p>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#ba1a1a] text-[10px] uppercase w-[62px]">
          <p className="leading-[15px]">OBAT KERAS</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white relative rounded-[9999px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#ba1a1a] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[13px] py-[7px] relative size-full">
          <Background />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute left-[17px] top-[17px] w-[116px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <BackgroundBorder1 />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background+Border">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <AmoxicillinBox />
        <Container1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Button() {
  return (
    <div className="col-1 relative rounded-[8px] row-1 shrink-0 size-[105.16px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#006a3f] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Button1() {
  return (
    <div className="col-2 relative rounded-[8px] row-1 shrink-0 size-[105.17px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Button2() {
  return (
    <div className="col-3 relative rounded-[8px] row-1 shrink-0 size-[105.16px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Container">
          <path d={svgPaths.p2bb32400} fill="var(--fill-0, #6E7A70)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#eff5ee] col-4 content-stretch flex items-center justify-center justify-self-start pb-[40.6px] pl-[40.58px] pr-[40.57px] pt-[40.57px] relative rounded-[8px] row-1 self-start shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container4 />
    </div>
  );
}

function Container3() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_105.17px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container() {
  return (
    <div className="col-[1/span_5] content-stretch flex flex-col gap-[24px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <BackgroundBorder />
      <Container3 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#006a3f] text-[16px] tracking-[1.6px] uppercase w-full">
        <p className="leading-[24px]">ANTIBIOTIK PENICILLIN</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Container8 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#171d19] text-[32px] tracking-[-0.64px] w-full">
        <p className="leading-[40px]">Amoxicillin Trihydrate 500 mg</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[32px] leading-[0] relative shrink-0 tracking-[-0.24px] w-[219.86px]" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Manrope:SemiBold',sans-serif] font-semibold h-[32px] justify-center left-0 text-[#006a3f] text-[24px] top-[15.5px] w-[113.33px]">
        <p className="leading-[32px]">{`Rp 12.500 `}</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[20px] justify-center left-[113.32px] text-[#6e7a70] text-[14px] top-[19.5px] w-[106.53px]">
        <p className="leading-[20px]">/ Strip (10 Tablet)</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Paragraph />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Heading />
      <Container9 />
    </div>
  );
}

function Container10() {
  return (
    <div className="relative self-stretch shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="h-[19px] relative shrink-0 w-[22px]" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19">
            <path d={svgPaths.p7555480} fill="var(--fill-0, #BA1A1A)" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#93000a] text-[16px] w-[152.14px]">
        <p className="leading-[24px]">Wajib Resep Dokter</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[72px] justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[16px] w-[520.49px]">
        <p className="leading-[24px] mb-0">Obat ini termasuk kategori Obat Keras. Pembelian memerlukan resep</p>
        <p className="leading-[24px] mb-0">dokter yang sah dan akan divalidasi oleh Apoteker kami sebelum</p>
        <p className="leading-[24px]">pengiriman.</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative self-stretch shrink-0 w-[520.49px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(255,218,214,0.3)] h-[150px] relative rounded-[12px] shrink-0 w-full" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(186,26,26,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex gap-[15.99px] items-start p-[25px] relative size-full">
        <Container10 />
        <Container11 />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[9px] relative shrink-0 w-full" data-name="Heading 3">
      <div aria-hidden="true" className="absolute border-[#bdcabe] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Manrope:SemiBold',sans-serif] font-semibold h-[28px] justify-center leading-[0] relative shrink-0 text-[#171d19] text-[20px] w-[159.14px]">
        <p className="leading-[28px]">Deskripsi Produk</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[16px] w-full">
        <p className="leading-[26px] mb-0">Amoxicillin adalah obat antibiotik golongan penicillin yang digunakan untuk mengobati</p>
        <p className="leading-[26px] mb-0">berbagai macam infeksi bakteri, seperti infeksi saluran pernapasan, infeksi saluran</p>
        <p className="leading-[26px] mb-0">kemih, dan infeksi kulit. Obat ini bekerja dengan cara menghentikan pertumbuhan</p>
        <p className="leading-[26px]">bakteri.</p>
      </div>
    </div>
  );
}

function Section() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading1 />
      <Container15 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[9px] relative shrink-0 w-full" data-name="Heading 3">
      <div aria-hidden="true" className="absolute border-[#bdcabe] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Manrope:SemiBold',sans-serif] font-semibold h-[28px] justify-center leading-[0] relative shrink-0 text-[#171d19] text-[20px] w-[138.67px]">
        <p className="leading-[28px]">Indikasi Umum</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[16px] w-full">
        <p className="leading-[26px] mb-0">Infeksi yang disebabkan oleh bakteri</p>
        <p className="leading-[26px] mb-0">gram positif dan gram negatif yang peka</p>
        <p className="leading-[26px] mb-0">terhadap amoxicillin, seperti infeksi</p>
        <p className="leading-[26px] mb-0">saluran nafas, kulit, jaringan lunak, dan</p>
        <p className="leading-[26px]">saluran kemih.</p>
      </div>
    </div>
  );
}

function Section1() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[12px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Section">
      <Heading2 />
      <Container17 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[9px] relative shrink-0 w-full" data-name="Heading 3">
      <div aria-hidden="true" className="absolute border-[#bdcabe] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Manrope:SemiBold',sans-serif] font-semibold h-[28px] justify-center leading-[0] relative shrink-0 text-[#171d19] text-[20px] w-[97.8px]">
        <p className="leading-[28px]">Komposisi</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[16px] w-full">
        <p className="leading-[24px] mb-0">Amoxicillin trihydrate setara dengan</p>
        <p className="leading-[24px]">amoxicillin anhidrat 500 mg.</p>
      </div>
    </div>
  );
}

function Section2() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[12px] items-start justify-self-stretch pb-[82px] relative row-1 self-start shrink-0" data-name="Section">
      <Heading3 />
      <Container18 />
    </div>
  );
}

function Container16() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[_179px] relative shrink-0 w-full" data-name="Container">
      <Section1 />
      <Section2 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[9px] relative shrink-0 w-full" data-name="Heading 3">
      <div aria-hidden="true" className="absolute border-[#bdcabe] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Manrope:SemiBold',sans-serif] font-semibold h-[28px] justify-center leading-[0] relative shrink-0 text-[#171d19] text-[20px] w-[193.19px]">
        <p className="leading-[28px]">{`Dosis & Aturan Pakai`}</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[16px] w-[243.22px]">
        <p className="leading-[24px]">{`Dewasa dan anak-anak > 20 kg`}</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[16px] w-[204.27px]">
        <p className="leading-[24px]">250 - 500 mg setiap 8 jam.</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[243.22px]" data-name="Container">
      <Container21 />
      <Container22 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex gap-[11.99px] items-start relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 size-[20px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <path d={svgPaths.p256e1340} fill="var(--fill-0, #006A3F)" id="Icon" />
        </svg>
      </div>
      <Container20 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[16px] w-[125.23px]">
        <p className="leading-[24px]">Saran Penyajian</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[16px] w-[558.49px]">
        <p className="leading-[24px] mb-0">Dapat dikonsumsi bersama atau tanpa makanan. Konsumsi setelah makan</p>
        <p className="leading-[24px]">untuk mengurangi rasa tidak nyaman pada perut.</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 w-[558.49px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container24 />
        <Container25 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="content-stretch flex gap-[11.99px] items-start pt-[25px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#bdcabe] border-solid border-t inset-0 pointer-events-none" />
      <div className="h-[20px] relative shrink-0 w-[15px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 20">
          <path d={svgPaths.p23cfd7c0} fill="var(--fill-0, #006A3F)" id="Icon" />
        </svg>
      </div>
      <Container23 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#eaefe8] relative rounded-[12px] shrink-0 w-full" data-name="Background">
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
        <Container19 />
        <HorizontalBorder />
      </div>
    </div>
  );
}

function Section3() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading4 />
      <Background1 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[9px] relative shrink-0 w-full" data-name="Heading 3">
      <div aria-hidden="true" className="absolute border-[#bdcabe] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Manrope:SemiBold',sans-serif] font-semibold h-[28px] justify-center leading-[0] relative shrink-0 text-[#171d19] text-[20px] w-[128.84px]">
        <p className="leading-[28px]">Efek Samping</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[16px] w-full">
        <p className="leading-[24px] mb-0">Mual, muntah, diare, ruam kulit, atau reaksi alergi lainnya. Segera hubungi dokter jika</p>
        <p className="leading-[24px]">terjadi reaksi alergi berat (anafilaksis).</p>
      </div>
    </div>
  );
}

function Section4() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Section">
      <Heading5 />
      <Container26 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start pt-[12px] relative shrink-0 w-full" data-name="Container">
      <Section />
      <Container16 />
      <Section3 />
      <Section4 />
    </div>
  );
}

function Container5() {
  return (
    <div className="col-[6/span_7] content-stretch flex flex-col gap-[24px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Container6 />
      <OverlayBorder />
      <Container14 />
    </div>
  );
}

function Main() {
  return (
    <div className="gap-x-[40px] gap-y-[40px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[_1145px] relative shrink-0 w-[1152px]" data-name="Main">
      <Container />
      <Container5 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex flex-col gap-[8.5px] items-start leading-[0] not-italic relative shrink-0" data-name="Paragraph">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center relative shrink-0 text-[#047857] text-[18px] w-[168.77px]">
        <p className="leading-[28px]">Apotek Jaya Farma</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center relative shrink-0 text-[#64748b] text-[14px] w-[409.39px]">
        <p className="leading-[20px]">© 2024 Apotek Jaya Farma. Lisensi Kemenkes RI No. 123456.</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[90.61px]">
        <p className="leading-[20px]">Tentang Kami</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[119.77px]">
        <p className="leading-[20px]">Hubungi Apoteker</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[112.17px]">
        <p className="leading-[20px]">Kebijakan Privasi</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[126.14px]">
        <p className="leading-[20px]">{`Syarat & Ketentuan`}</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[24px] h-[20px] items-start justify-center relative shrink-0" data-name="Container">
      <Link />
      <Link1 />
      <Link2 />
      <Link3 />
    </div>
  );
}

function Container27() {
  return (
    <div className="max-w-[1200px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between max-w-[inherit] relative size-full">
        <Paragraph1 />
        <Container28 />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[#f8fafc] relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[48px] pt-[49px] px-[40px] relative size-full">
        <Container27 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p300a1100} fill="var(--fill-0, #171D19)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container30 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#059669] text-[20px] tracking-[-0.5px] w-[179.02px]">
        <p className="leading-[28px]">Apotek Jaya Farma</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button4 />
        <Container31 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[20px] relative shrink-0 w-[19.982px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9815 20">
        <g id="Container">
          <path d={svgPaths.pb5c2400} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container33 />
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p164b49c0} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container34 />
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p3de21300} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container35 />
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button5 />
        <Button6 />
        <Button7 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex h-[64px] items-center justify-between left-0 max-w-[1536px] pb-px px-[48px] top-0 w-[1280px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#f1f5f9] border-b border-solid inset-0 pointer-events-none" />
      <Container29 />
      <Container32 />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6e7a70] text-[14px] w-[105.13px]">
        <p className="leading-[20px]">Total Pembelian</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:SemiBold',sans-serif] font-semibold h-[28px] justify-center leading-[0] relative shrink-0 text-[#171d19] text-[20px] w-[92.44px]">
        <p className="leading-[28px]">Rp 12.500</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[105.13px]" data-name="Container">
      <Container38 />
      <Container39 />
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p3ffd6800} fill="var(--fill-0, #2D5F9F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex gap-[19.62px] items-center justify-center pl-[25px] pr-[36.64px] py-[13px] relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#2d5f9f] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container41 />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[48px] justify-center leading-[0] not-italic relative shrink-0 text-[#2d5f9f] text-[16px] text-center w-[72.05px]">
        <p className="leading-[24px] mb-0">Tanya</p>
        <p className="leading-[24px]">Apoteker</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p11fdd840} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#2d5f9f] content-stretch flex gap-[7.99px] items-center justify-center pl-[78.64px] pr-[78.66px] py-[25px] relative rounded-[12px] shrink-0" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.02px_0_0] rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(45,95,159,0.2),0px_4px_6px_-4px_rgba(45,95,159,0.2)]" data-name="Button:shadow" />
      <Container42 />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[113.36px]">
        <p className="leading-[24px]">Unggah Resep</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="Container">
      <Button8 />
      <Button9 />
    </div>
  );
}

function Container36() {
  return (
    <div className="max-w-[1200px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between max-w-[inherit] relative size-full">
        <Container37 />
        <Container40 />
      </div>
    </div>
  );
}

function OverlayHorizontalBorderOverlayBlur() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(255,255,255,0.8)] bottom-[-0.5px] content-stretch flex flex-col items-start left-0 pb-[16px] pt-[17px] px-[48px] w-[1280px]" data-name="Overlay+HorizontalBorder+OverlayBlur">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <Container36 />
    </div>
  );
}

export default function HtmlBody() {
  return (
    <div className="content-stretch flex flex-col gap-[192px] items-center py-[96px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(245, 251, 243) 0%, rgb(245, 251, 243) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <Main />
      <Footer />
      <Header />
      <OverlayHorizontalBorderOverlayBlur />
    </div>
  );
}