import svgPaths from "./svg-2f3r3t25je";

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[40px] justify-center leading-[0] relative shrink-0 text-[#171d19] text-[32px] text-center tracking-[-0.64px] w-[314.31px]">
        <p className="leading-[40px]">Rekomendasi Cerdas</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[512px] relative shrink-0 w-[512px]" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[56px] justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[18px] text-center w-[486.8px]">
        <p className="leading-[28px] mb-0">Temukan solusi kesehatan yang tepat berdasarkan gejala</p>
        <p className="leading-[28px]">yang Anda alami dalam 2 langkah mudah.</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Container2 />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#1e5b53] content-stretch flex items-center justify-center pb-[6.5px] pt-[5.5px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[6.05px]">
        <p className="leading-[20px]">1</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#1e5b53] text-[12px] tracking-[0.6px] w-[51.39px]">
        <p className="leading-[16px]">GEJALA</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Background />
      <Margin />
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col h-px items-start pl-[16px] relative shrink-0 w-[64px]" data-name="Margin">
      <div className="bg-[#bdcabe] h-px shrink-0 w-[48px]" data-name="Horizontal Divider" />
    </div>
  );
}

function Border() {
  return (
    <div className="content-stretch flex items-center justify-center pb-[6.5px] pt-[5.5px] px-[2px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Border">
      <div aria-hidden="true" className="absolute border-2 border-[#6e7a70] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[14px] text-center w-[8.83px]">
        <p className="leading-[20px]">2</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[12px] tracking-[0.6px] w-[31.38px]">
        <p className="leading-[16px]">USIA</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex items-center opacity-40 relative shrink-0" data-name="Container">
      <Border />
      <Margin3 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[16px] relative shrink-0" data-name="Margin">
      <Container5 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Margin1 />
      <Margin2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p111d6a00} fill="var(--fill-0, #2D5F9F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading3Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Heading 3:margin">
      <div className="flex flex-col font-['Manrope:SemiBold',sans-serif] font-semibold h-[28px] justify-center leading-[0] relative shrink-0 text-[#171d19] text-[20px] w-[230.02px]">
        <p className="leading-[28px]">Apa yang Anda rasakan?</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Heading3Margin />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[14px] w-full">
        <p className="leading-[20px]">Pilih satu atau lebih gejala yang sedang dialami (Pilih minimal 1).</p>
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div className="h-[33px] relative shrink-0 w-[12.5px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5 33">
        <g id="Margin">
          <path d={svgPaths.p1e449300} fill="var(--fill-0, #3E4A41)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[14px] text-center w-[50.66px]">
          <p className="leading-[20px]">Demam</p>
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[25px] py-[35px] relative size-full">
          <Margin4 />
          <Container10 />
          <div className="absolute bg-white left-[77.25px] opacity-0 size-[16px] top-[59px]" data-name="Input">
            <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
          </div>
          <div className="absolute inset-px rounded-[8px]" data-name="Border">
            <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div className="h-[28px] relative shrink-0 w-[21.563px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5625 28">
        <g id="Margin">
          <path d={svgPaths.p14276f80} fill="var(--fill-0, #3E4A41)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[14px] text-center w-[84.17px]">
          <p className="leading-[20px]">Batuk Kering</p>
        </div>
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[25px] py-[35px] relative size-full">
          <Margin5 />
          <Container11 />
          <div className="absolute bg-white left-[77.25px] opacity-0 size-[16px] top-[59px]" data-name="Input">
            <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
          </div>
          <div className="absolute inset-px rounded-[8px]" data-name="Border">
            <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="h-[33px] relative shrink-0 w-[20px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 33">
        <g id="Margin">
          <path d={svgPaths.p17c33a80} fill="var(--fill-0, #3E4A41)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[14px] text-center w-[31.58px]">
          <p className="leading-[20px]">Pilek</p>
        </div>
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="col-3 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[25px] py-[35px] relative size-full">
          <Margin6 />
          <Container12 />
          <div className="absolute bg-white left-[77.25px] opacity-0 size-[16px] top-[59px]" data-name="Input">
            <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
          </div>
          <div className="absolute inset-px rounded-[8px]" data-name="Border">
            <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Margin7() {
  return (
    <div className="h-[34.25px] relative shrink-0 w-[27.5px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.5 34.25">
        <g id="Margin">
          <path d={svgPaths.p396be480} fill="var(--fill-0, #3E4A41)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pl-[16.64px] pr-[16.66px] relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[40px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[14px] text-center w-[87.2px]">
          <p className="leading-[20px] mb-0">Sakit</p>
          <p className="leading-[20px]">Tenggorokan</p>
        </div>
      </div>
    </div>
  );
}

function Label3() {
  return (
    <div className="col-4 justify-self-stretch relative rounded-[8px] row-1 self-start shrink-0" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[25px] relative size-full">
          <Margin7 />
          <Container13 />
          <div className="absolute bg-white left-[77.25px] opacity-0 size-[16px] top-[59px]" data-name="Input">
            <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
          </div>
          <div className="absolute inset-[1px_1px_1.25px_1px] rounded-[8px]" data-name="Border">
            <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Margin8() {
  return (
    <div className="h-[33px] relative shrink-0 w-[23.765px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.7647 33">
        <g id="Margin">
          <path d={svgPaths.p3f5d9a00} fill="var(--fill-0, #3E4A41)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[14px] text-center w-[44.86px]">
          <p className="leading-[20px]">Pusing</p>
        </div>
      </div>
    </div>
  );
}

function Label4() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[8px] row-2 self-start shrink-0" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[25px] relative size-full">
          <Margin8 />
          <Container14 />
          <div className="absolute bg-white left-[77.25px] opacity-0 size-[16px] top-[49px]" data-name="Input">
            <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
          </div>
          <div className="absolute inset-px rounded-[8px]" data-name="Border">
            <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Margin9() {
  return (
    <div className="h-[25.5px] relative shrink-0 w-[25px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25.5">
        <g id="Margin">
          <path d={svgPaths.pf125a00} fill="var(--fill-0, #3E4A41)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[14px] text-center w-[43.59px]">
          <p className="leading-[20px]">Lemas</p>
        </div>
      </div>
    </div>
  );
}

function Label5() {
  return (
    <div className="col-2 justify-self-stretch relative rounded-[8px] row-2 self-start shrink-0" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[25px] relative size-full">
          <Margin9 />
          <Container15 />
          <div className="absolute bg-white left-[77.25px] opacity-0 size-[16px] top-[49px]" data-name="Input">
            <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
          </div>
          <div className="absolute inset-[1px_1px_0.5px_1px] rounded-[8px]" data-name="Border">
            <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Margin10() {
  return (
    <div className="h-[31.75px] relative shrink-0 w-[24.969px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.9688 31.75">
        <g id="Margin">
          <path d={svgPaths.p1bc0c280} fill="var(--fill-0, #3E4A41)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[14px] text-center w-[86.39px]">
          <p className="leading-[20px]">Sesak Napas</p>
        </div>
      </div>
    </div>
  );
}

function Label6() {
  return (
    <div className="col-3 justify-self-stretch relative rounded-[8px] row-2 self-start shrink-0" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[25px] relative size-full">
          <Margin10 />
          <Container16 />
          <div className="absolute bg-white left-[77.25px] opacity-0 size-[16px] top-[49px]" data-name="Input">
            <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
          </div>
          <div className="absolute inset-[1px_1px_0.75px_1px] rounded-[8px]" data-name="Border">
            <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Margin11() {
  return (
    <div className="h-[33px] relative shrink-0 w-[26.031px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.0312 33">
        <g id="Margin">
          <path d={svgPaths.p55d7280} fill="var(--fill-0, #3E4A41)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[14px] text-center w-[32.19px]">
          <p className="leading-[20px]">Mual</p>
        </div>
      </div>
    </div>
  );
}

function Label7() {
  return (
    <div className="col-4 justify-self-stretch relative rounded-[8px] row-2 self-start shrink-0" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[25px] relative size-full">
          <Margin11 />
          <Container17 />
          <div className="absolute bg-white left-[77.25px] opacity-0 size-[16px] top-[49px]" data-name="Input">
            <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none" />
          </div>
          <div className="absolute inset-px rounded-[8px]" data-name="Border">
            <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[__134px_114px] relative shrink-0 w-full" data-name="Container">
      <Label />
      <Label1 />
      <Label2 />
      <Label3 />
      <Label4 />
      <Label5 />
      <Label6 />
      <Label7 />
    </div>
  );
}

function Section() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative size-full">
        <Container6 />
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="h-px opacity-50 relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#bdcabe] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[20px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
        <g id="Container">
          <path d={svgPaths.p24bdda0} fill="var(--fill-0, #2D5F9F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading3Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Heading 3:margin">
      <div className="flex flex-col font-['Manrope:SemiBold',sans-serif] font-semibold h-[28px] justify-center leading-[0] relative shrink-0 text-[#171d19] text-[20px] w-[174.28px]">
        <p className="leading-[28px]">Berapa usia Anda?</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Heading3Margin1 />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[14px] w-full">
        <p className="leading-[20px]">Usia sangat menentukan jenis dan dosis obat yang tepat.</p>
      </div>
    </div>
  );
}

function Label8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[16px]">USIA (TAHUN)</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[17px] overflow-clip right-[32px] top-[14px]" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[16px] w-[83.23px]">
        <p className="leading-[normal]">Contoh: 25</p>
      </div>
    </div>
  );
}

function Container25() {
  return <div className="flex-[1_0_0] h-[20px] min-w-px" data-name="Container" />;
}

function RectangleAlignStretch() {
  return (
    <div className="content-stretch flex h-full items-start relative shrink-0" data-name="Rectangle:align-stretch">
      <div className="h-full min-w-[15px] opacity-0 shrink-0 w-[15px]" data-name="Rectangle" />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex items-center left-[17px] right-[17px] top-[14px]" data-name="Container">
      <Container25 />
      <div className="flex flex-row items-center self-stretch">
        <RectangleAlignStretch />
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Container23 />
        <Container24 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[192px]" data-name="Container">
      <Label8 />
      <Input />
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[14px] w-[25.61px]">
          <p className="leading-[20px]">Pria</p>
        </div>
      </div>
    </div>
  );
}

function Label9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[48px] items-center justify-center min-w-px p-px relative rounded-[8px]" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container27 />
      <div className="absolute bg-white left-[114.5px] opacity-0 rounded-[16px] size-[16px] top-[16px]" data-name="Input">
        <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
      <div className="absolute inset-px rounded-[8px]" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[14px] w-[45.13px]">
          <p className="leading-[20px]">Wanita</p>
        </div>
      </div>
    </div>
  );
}

function Label10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[48px] items-center justify-center min-w-px p-px relative rounded-[8px]" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container28 />
      <div className="absolute bg-white left-[114.5px] opacity-0 rounded-[16px] size-[16px] top-[16px]" data-name="Input">
        <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
      <div className="absolute inset-px rounded-[8px]" data-name="Border">
        <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-start justify-center min-w-px relative" data-name="Container">
      <Label9 />
      <Label10 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[24px] items-end relative shrink-0 w-full" data-name="Container">
      <Container22 />
      <Container26 />
    </div>
  );
}

function Section1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Section">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative size-full">
        <Container18 />
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[2.55px] relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[45px] justify-center leading-[0] not-italic relative shrink-0 text-[#084786] text-[12px] w-[383.43px]">
          <p className="leading-[15px] mb-0">Layanan ini hanya memberikan saran produk kesehatan umum. Jika</p>
          <p className="leading-[15px] mb-0">gejala berlanjut atau memburuk, segera hubungi dokter atau</p>
          <p className="leading-[15px]">layanan darurat.</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(45,95,159,0.05)] content-stretch flex gap-[12px] items-start max-w-[448px] p-[13px] relative rounded-[8px] shrink-0" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(45,95,159,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative shrink-0 size-[20px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <path d={svgPaths.p7c9be00} fill="var(--fill-0, #2D5F9F)" id="Icon" />
        </svg>
      </div>
      <Container30 />
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p1a406200} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#1e5b53] content-stretch flex gap-[25.35px] items-center justify-center pl-[57.36px] pr-[40px] py-[16px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.02px_0_0] rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
      <div className="flex flex-col font-['Manrope:Regular',sans-serif] font-normal h-[48px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white w-[99.27px]">
        <p className="leading-[24px] mb-0">Lihat</p>
        <p className="leading-[24px]">Rekomendasi</p>
      </div>
      <Container31 />
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pt-[24px] relative size-full">
        <OverlayBorder />
        <Button />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[40px] items-start p-[41px] relative size-full">
        <Section />
        <Separator />
        <Section1 />
        <Container29 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p2e0f2ff0} fill="var(--fill-0, #1E5B53)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#ecfdf5] h-[48px] relative rounded-[9999px] shrink-0 w-[39.03px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container33 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[48px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[16px] w-[88.69px]">
        <p className="leading-[24px] mb-0">{`Aman &`}</p>
        <p className="leading-[24px]">Terpercaya</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[36px] justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[12px] w-[107.47px]">
        <p className="leading-[18px] mb-0">Obat asli berlisensi</p>
        <p className="leading-[18px]">Kemenkes RI</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0 w-[107.47px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container35 />
        <Container36 />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-white col-1 h-[134px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[25px] relative size-full">
          <Background1 />
          <Container34 />
        </div>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[20px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
        <g id="Container">
          <path d={svgPaths.p31130500} fill="var(--fill-0, #1E5B53)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#ecfdf5] h-[48px] relative rounded-[9999px] shrink-0 w-[36.66px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container37 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[48px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[16px] w-[123.21px]">
        <p className="leading-[24px] mb-0">Apoteker</p>
        <p className="leading-[24px]">Berpengalaman</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[36px] justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[12px] w-[131.11px]">
        <p className="leading-[18px] mb-0">Saran berbasis standar</p>
        <p className="leading-[18px]">klinis</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 w-[131.11px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container39 />
        <Container40 />
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white col-2 h-[134px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[11.99px] items-center p-[25px] relative size-full">
          <Background2 />
          <Container38 />
        </div>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[16px] relative shrink-0 w-[19.977px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9767 16">
        <g id="Container">
          <path d={svgPaths.p25d5bd2c} fill="var(--fill-0, #1E5B53)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#ecfdf5] h-[48px] relative rounded-[9999px] shrink-0 w-[36px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container41 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#171d19] text-[16px] w-[91.27px]">
        <p className="leading-[24px]">Hasil Instan</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[36px] justify-center leading-[0] not-italic relative shrink-0 text-[#3e4a41] text-[12px] w-[139.19px]">
        <p className="leading-[18px] mb-0">Algoritma cerdas kurang</p>
        <p className="leading-[18px]">dari 1 detik</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0 w-[139.19px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container43 />
        <Container44 />
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-white col-3 h-[134px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#bdcabe] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[25px] relative size-full">
          <Background3 />
          <Container42 />
        </div>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[_134px] relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder />
      <BackgroundBorder1 />
      <BackgroundBorder2 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start max-w-[800px] relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container3 />
      <BackgroundBorderShadow />
      <Container32 />
    </div>
  );
}

function Main() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main">
      <div className="content-stretch flex flex-col items-start pb-[128px] pt-[96px] px-[240px] relative size-full">
        <Container />
      </div>
    </div>
  );
}

function Margin12() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] w-[409.39px]">
        <p className="leading-[20px]">© 2024 Apotek Jaya Farma. Lisensi Kemenkes RI No. 123456.</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#047857] text-[18px] w-[168.77px]">
          <p className="leading-[28px]">Apotek Jaya Farma</p>
        </div>
        <Margin12 />
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
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[119.77px]">
        <p className="leading-[20px]">Hubungi Apoteker</p>
      </div>
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[24px] relative self-stretch shrink-0" data-name="Link:margin">
      <Link1 />
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] w-[112.17px]">
        <p className="leading-[20px]">Kebijakan Privasi</p>
      </div>
    </div>
  );
}

function LinkMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[24px] relative self-stretch shrink-0" data-name="Link:margin">
      <Link2 />
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[20px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Link />
        <LinkMargin />
        <LinkMargin1 />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-[#f8fafc] relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[48px] pt-[49px] px-[32px] relative size-full">
          <Container45 />
          <Container46 />
        </div>
      </div>
    </div>
  );
}

function Container47() {
  return <div className="absolute bottom-[40px] right-[40px] size-[56px]" data-name="Container" />;
}

function Container48() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#059669] text-[20px] tracking-[-0.5px] w-[179.02px]">
          <p className="leading-[28px]">Apotek Jaya Farma</p>
        </div>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[2px] relative self-stretch shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#059669] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#059669] text-[16px] tracking-[-0.4px] w-[60.25px]">
        <p className="leading-[24px]">Beranda</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[16px] tracking-[-0.4px] w-[54.52px]">
        <p className="leading-[24px]">Katalog</p>
      </div>
    </div>
  );
}

function LinkMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[16px] relative self-stretch shrink-0" data-name="Link:margin">
      <Link4 />
    </div>
  );
}

function Link5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[16px] tracking-[-0.4px] w-[44.97px]">
        <p className="leading-[24px]">Resep</p>
      </div>
    </div>
  );
}

function LinkMargin3() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[16px] relative self-stretch shrink-0" data-name="Link:margin">
      <Link5 />
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex h-[26px] items-start relative shrink-0" data-name="Nav">
      <Link3 />
      <LinkMargin2 />
      <LinkMargin3 />
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[20px] relative shrink-0 w-[19.982px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9815 20">
        <g id="Container">
          <path d={svgPaths.pb5c2400} fill="var(--fill-0, #059669)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin14() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 20">
        <g id="Margin">
          <path d={svgPaths.p26c82d80} fill="var(--fill-0, #059669)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin15() {
  return (
    <div className="h-[20px] relative shrink-0 w-[32px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 20">
        <g id="Margin">
          <path d={svgPaths.p9f89e80} fill="var(--fill-0, #059669)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container51 />
      <Margin14 />
      <Margin15 />
    </div>
  );
}

function Margin13() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[24px] relative shrink-0" data-name="Margin">
      <Container50 />
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Nav />
        <Margin13 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex h-[64px] items-center justify-between left-0 max-w-[1536px] pb-px px-[48px] top-0 w-[1280px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <Container48 />
      <Container49 />
    </div>
  );
}

export default function Rekomendasi() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(245, 251, 243) 0%, rgb(245, 251, 243) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Rekomendasi">
      <Main />
      <Footer />
      <Container47 />
      <Header />
    </div>
  );
}