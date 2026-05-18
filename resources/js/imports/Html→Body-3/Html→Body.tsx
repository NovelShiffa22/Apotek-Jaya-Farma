import svgPaths from "./svg-ox37fqiu42";
import imgContohResepMedisYangJelas from "./586c6d08653270d8025af8e3edf8cb4d33f99c03.png";

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#065f46] text-[14px] w-[249.7px]">
        <p className="leading-[20px]">Status: Menunggu Validasi Apoteker</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <div className="bg-[#10b981] rounded-[9999px] shrink-0 size-[10px]" data-name="Background" />
        <Container1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p3dc33e00} fill="var(--fill-0, #059669)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function StatusIndicator() {
  return (
    <div className="bg-[#ecfdf5] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[12px] shrink-0 w-full" data-name="Status Indicator">
      <div aria-hidden="true" className="absolute border border-[#d1fae5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[17px] py-[13px] relative size-full">
          <Container />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#171d19] text-[36px] w-full">
        <p className="leading-[40px]">Unggah Resep Dokter</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[672px] relative shrink-0 w-[672px]" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[56px] justify-center leading-[0] not-italic relative shrink-0 text-[#6e7a70] text-[18px] w-[662.03px]">
        <p className="leading-[28px] mb-0">Kirimkan foto resep Anda untuk diproses oleh apoteker berlisensi kami secara</p>
        <p className="leading-[28px]">cepat dan aman.</p>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Page Header">
      <Heading1 />
      <Container3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[30px] relative shrink-0 w-[24px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 30">
        <g id="Container">
          <path d={svgPaths.p2eac5a80} fill="var(--fill-0, #2D5F9F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundShadow() {
  return (
    <div className="bg-[#d5e3ff] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center relative rounded-[9999px] shrink-0 size-[80px]" data-name="Background+Shadow">
      <Container4 />
    </div>
  );
}

function Margin() {
  return (
    <div className="h-[104px] relative shrink-0 w-[80px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[24px] relative size-full">
        <BackgroundShadow />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#2d5f9f] text-[20px] text-center w-[222.45px]">
        <p className="leading-[28px]">Klik untuk Unggah Foto</p>
      </div>
    </div>
  );
}

function Heading3Margin() {
  return (
    <div className="relative shrink-0" data-name="Heading 3:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[8px] relative size-full">
        <Heading2 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6e7a70] text-[14px] text-center w-[275.25px]">
        <p className="leading-[20px]">Format: JPG, PNG, atau PDF (Maks. 5MB)</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[32px] relative size-full">
        <Container5 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Container">
          <path d={svgPaths.p15b83880} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#2d5f9f] relative rounded-[9999px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center px-[32px] py-[14px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.02px_0_0] rounded-[9999px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
        <Container6 />
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[161.88px]">
          <p className="leading-[24px]">Ambil Foto / Pilih File</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[16px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border-2 border-[#8ab8fe] border-dashed inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[66px] py-[140.25px] relative size-full">
          <Margin />
          <Heading3Margin />
          <Margin1 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function UploadSection() {
  return (
    <div className="col-[1/span_7] content-stretch flex flex-col items-start justify-center justify-self-stretch relative row-1 self-start shrink-0" data-name="Upload Section">
      <BackgroundBorderShadow />
    </div>
  );
}

function Background() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Background">
          <rect fill="var(--fill-0, #8CF8B7)" height="40" rx="12" width="40" />
          <path d={svgPaths.p2b6f9500} fill="var(--fill-0, #006A3F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#171d19] text-[16px] w-[147.94px]">
        <p className="leading-[24px]">Pastikan Foto Jelas</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[69px] justify-center leading-[0] not-italic relative shrink-0 text-[#6e7a70] text-[14px] w-[236.14px]">
        <p className="leading-[22.75px] mb-0">Seluruh bagian resep harus terbaca</p>
        <p className="leading-[22.75px] mb-0">dengan jelas, tidak blur, dan tidak</p>
        <p className="leading-[22.75px]">terpotong.</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[2.75px] items-start relative shrink-0 w-[236.14px]" data-name="Container">
      <Heading3 />
      <Container9 />
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start relative size-full">
        <Background />
        <Container8 />
      </div>
    </div>
  );
}

function OverlayBorderShadowOverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.7)] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[16px] shrink-0 w-full" data-name="Overlay+Border+Shadow+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="h-[41px] relative shrink-0 w-[42px]" data-name="Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 41">
        <g id="Background">
          <rect fill="var(--fill-0, #8CF8B7)" height="41" rx="12" width="42" />
          <path d={svgPaths.p28682e00} fill="var(--fill-0, #006A3F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] relative shrink-0 text-[#171d19] text-[16px] w-[194.27px]">
        <p className="leading-[24px]">{`Identitas Dokter & Pasien`}</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[69px] justify-center leading-[0] not-italic relative shrink-0 text-[#6e7a70] text-[14px] w-[249.37px]">
        <p className="leading-[22.75px] mb-0">Nama dokter, SIP, tanda tangan, serta</p>
        <p className="leading-[22.75px] mb-0">nama pasien harus terlihat sesuai</p>
        <p className="leading-[22.75px]">standar medis.</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[2.75px] items-start relative shrink-0 w-[249.37px]" data-name="Container">
      <Heading4 />
      <Container12 />
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start relative size-full">
        <Background1 />
        <Container11 />
      </div>
    </div>
  );
}

function OverlayBorderShadowOverlayBlur1() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.7)] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[16px] shrink-0 w-full" data-name="Overlay+Border+Shadow+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative size-full">
        <Container10 />
      </div>
    </div>
  );
}

function CardsContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Cards Container">
      <OverlayBorderShadowOverlayBlur />
      <OverlayBorderShadowOverlayBlur1 />
    </div>
  );
}

function ContohResepMedisYangJelas() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Contoh resep medis yang jelas">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[191.67%] left-0 max-w-none top-[-45.83%] w-full" src={imgContohResepMedisYangJelas} />
      </div>
    </div>
  );
}

function OverlayOverlayBlur() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(0,106,63,0.9)] content-stretch flex flex-col items-start px-[20px] py-[10px] relative rounded-[9999px] shrink-0" data-name="Overlay+OverlayBlur">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[9999px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Overlay+Shadow" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[132.64px]">
        <p className="leading-[20px]">Lihat Contoh Resep</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="absolute bg-[rgba(0,106,63,0.6)] content-stretch flex inset-0 items-center justify-center opacity-0" data-name="Overlay">
      <OverlayOverlayBlur />
    </div>
  );
}

function ExamplePreview() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-col h-[192px] items-start justify-center overflow-clip relative rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Example Preview">
      <ContohResepMedisYangJelas />
      <Overlay />
    </div>
  );
}

function AsideInformationSection() {
  return (
    <div className="col-[8/span_5] content-stretch flex flex-col gap-[24px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Aside - Information Section">
      <CardsContainer />
      <ExamplePreview />
    </div>
  );
}

function ContentGrid() {
  return (
    <div className="gap-x-[32px] gap-y-[32px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[_524.50px] pb-[16px] pt-[8px] relative shrink-0 w-full" data-name="Content Grid">
      <UploadSection />
      <AsideInformationSection />
    </div>
  );
}

function Overlay1() {
  return (
    <div className="h-[49px] relative shrink-0 w-[44px]" data-name="Overlay">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 49">
        <g id="Overlay">
          <rect fill="var(--fill-0, #006A3F)" fillOpacity="0.1" height="49" rx="22" width="44" />
          <path d={svgPaths.p27dfad80} fill="var(--fill-0, #006A3F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[16px] w-[130.73px]">
        <p className="leading-[24px]">Data Anda Aman</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6e7a70] text-[12px] w-[432.06px]">
        <p className="leading-[16px]">Apotek Jaya Farma menjamin kerahasiaan data medis sesuai UU Kesehatan.</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[432.06px]" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Overlay1 />
      <Container14 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#006a3f] content-stretch flex flex-col items-center justify-center opacity-50 px-[48px] py-[16px] relative rounded-[12px] shrink-0" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-white w-[193.19px]">
        <p className="leading-[28px]">Kirim Resep Sekarang</p>
      </div>
    </div>
  );
}

function StickyReadyActionFooter() {
  return (
    <div className="bg-[#e4eae2] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[16px] shrink-0 w-full" data-name="Sticky-ready Action Footer">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[32px] relative size-full">
          <Container13 />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function MainPageContent() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] inset-[64px_0_137px_0] items-start max-w-[1152px] p-[48px]" data-name="Main Page Content">
      <StatusIndicator />
      <PageHeader />
      <ContentGrid />
      <StickyReadyActionFooter />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] relative shrink-0" data-name="Paragraph">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center relative shrink-0 text-[#047857] text-[18px] w-[161.39px]">
        <p className="leading-[28px]">Apotek Jaya Farma</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center not-italic relative shrink-0 text-[#64748b] text-[14px] w-[409.39px]">
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

function Container18() {
  return (
    <div className="content-stretch flex gap-[32px] h-[20px] items-start justify-center relative shrink-0" data-name="Container">
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

function Container17() {
  return (
    <div className="max-w-[1152px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between max-w-[inherit] relative size-full">
        <Paragraph />
        <Container18 />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-[#f8fafc] content-stretch flex flex-col items-start left-0 pb-[40px] pt-[41px] px-[32px] right-0 top-[1086px]" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <Container17 />
    </div>
  );
}

function Heading() {
  return (
    <div className="relative shrink-0" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Manrope:ExtraBold',sans-serif] font-extrabold h-[28px] justify-center leading-[0] relative shrink-0 text-[#059669] text-[20px] tracking-[-0.5px] w-[173.73px]">
          <p className="leading-[28px]">Apotek Jaya Farma</p>
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p2500af80} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] w-full">
        <p className="leading-[normal]">Cari obat, vitamin...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Input">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[10px] pt-[9px] px-[12px] relative size-full">
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex gap-[8px] items-center px-[17px] py-[7px] relative rounded-[9999px] shrink-0 w-[256px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container20 />
      <Input />
    </div>
  );
}

function Container23() {
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

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container23 />
    </div>
  );
}

function Container24() {
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

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container24 />
    </div>
  );
}

function Container25() {
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

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container25 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <BackgroundBorder />
        <Container22 />
      </div>
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(255,255,255,0.8)] content-stretch flex h-[64px] items-center justify-between left-0 pb-px px-[32px] right-0 top-0" data-name="Header - TopAppBar">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <Heading />
      <Container19 />
    </div>
  );
}

function MainContentWrapper() {
  return (
    <div className="flex-[1_0_0] min-h-[1223px] min-w-px relative self-stretch" data-name="Main Content Wrapper">
      <MainPageContent />
      <Footer />
      <HeaderTopAppBar />
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#0f172a] text-[18px] w-full">
        <p className="leading-[28px]">Panel Apoteker</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#64748b] text-[12px] w-full">
        <p className="leading-[16px]">Apotek Jaya Farma</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[32px] relative size-full">
        <Heading5 />
        <Container27 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p20793584} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#475569] text-[16px] w-[80.45px]">
        <p className="leading-[24px]">Dashboard</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container28 />
          <Container29 />
        </div>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p643d217} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#475569] text-[16px] w-[72.91px]">
        <p className="leading-[24px]">Stok Obat</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container30 />
          <Container31 />
        </div>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Container">
          <path d={svgPaths.p9c26380} fill="var(--fill-0, #047857)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#047857] text-[16px] w-[105.44px]">
          <p className="leading-[24px]">Validasi Resep</p>
        </div>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="bg-[#ecfdf5] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#059669] border-r-4 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pl-[16px] pr-[20px] py-[12px] relative size-full">
          <Container32 />
          <Container33 />
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#475569] text-[16px] w-[135.8px]">
        <p className="leading-[24px]">Laporan Penjualan</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container34 />
          <Container35 />
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative shrink-0 text-[#475569] text-[16px] w-[86.34px]">
        <p className="leading-[24px]">Pengaturan</p>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container36 />
          <Container37 />
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Nav">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start px-[16px] relative size-full">
        <Link3 />
        <Link4 />
        <Link5 />
        <Link6 />
        <Link7 />
      </div>
    </div>
  );
}

function AsideSideNavBarDesktop() {
  return (
    <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[1223px] items-start left-0 pr-px top-0 w-[256px]" data-name="Aside - SideNavBar (Desktop)">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-r border-solid inset-0 pointer-events-none" />
      <Container26 />
      <Nav />
    </div>
  );
}

export default function HtmlBody() {
  return (
    <div className="content-stretch flex items-start justify-center pl-[256px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(245, 251, 243) 0%, rgb(245, 251, 243) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <MainContentWrapper />
      <AsideSideNavBarDesktop />
    </div>
  );
}