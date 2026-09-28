import React, { useState } from 'react';
import { initialDistrictData } from '../data/mockDistrictData';

export default function LandingPage({
  setActiveTab,
  onOpenLocationModal,
  selectedDistrict = 'DIST-MH-PUNE',
  selectedState = 'ST-MH',
}) {
  const [activeStep, setActiveStep] = useState(1);
  const currentDist = initialDistrictData.districts.find((d) => d.id === selectedDistrict);
  const currentState = initialDistrictData.states.find((s) => s.id === selectedState);

  const switchStep = (stepIndex) => {
    setActiveStep(stepIndex);
  };

  return (
    <div className="bg-surface-warm font-body text-text-obsidian antialiased selection:bg-amber-soft selection:text-primary min-h-screen flex flex-col justify-between overflow-x-hidden relative">
      
{/**/}
<div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40 h-[1200px] z-0"></div>
{/**/}
<div className="absolute top-0 inset-x-0 h-[1150px] pointer-events-none z-0 overflow-hidden" style={{"background":"linear-gradient(rgb(252, 251, 249) 0%, rgb(250, 246, 238) 24%, rgb(252, 232, 211) 52%, rgb(248, 203, 158) 78%, rgb(242, 172, 116) 100%)"}}><div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"></div><div className="absolute bottom-0 inset-x-0 h-[650px] pointer-events-none" style={{"background":"radial-gradient(110% 75% at 50% 100%, rgba(243, 168, 108, 0.75) 0%, rgba(248, 198, 150, 0.45) 45%, rgba(252, 235, 218, 0) 80%)"}}></div><div className="absolute top-[420px] left-1/2 -translate-x-1/2 w-[1400px] h-[580px] blur-[60px] pointer-events-none" style={{"background":"radial-gradient(ellipse at center, rgba(249, 185, 126, 0.5) 0%, rgba(254, 218, 180, 0.3) 50%, transparent 75%)"}}></div></div>
{/**/}
<div className="absolute top-[2800px] left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-[#FADBB8]/20 blur-[130px] pointer-events-none z-0"></div>
{/**/}
<main className="w-full pt-28 md:pt-36 flex-1 flex flex-col relative z-10">
{/**/}
<section className="w-full px-5 md:px-8 max-w-5xl mx-auto flex flex-col items-center text-center pt-6 pb-14 md:pb-20 relative">
{/**/}
<div className="inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-white/90 border border-amber-brand/20 shadow-[0_2px_14px_rgba(217,119,6,0.07)] backdrop-blur-md mb-8">
<div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-100 flex items-center justify-center text-amber-900 text-[11px] font-bold shadow-xs">
<span className="material-symbols-outlined text-[14px]">local_hospital</span>
</div>
<span className="text-[12px] font-medium text-text-umber tracking-tight">Pilot Deployment Grid across 5 Sovereign States</span>
</div>
{/**/}
<h1 className="font-display font-bold text-4xl sm:text-6xl md:text-[66px] leading-[1.09] tracking-[-0.03em] text-text-obsidian max-w-4xl mb-6">
        What if epidemic medicine arrived <span className="editorial-serif font-normal text-amber-brand text-[1.14em] tracking-normal">before</span> the outbreak peaked?
      </h1>
{/**/}
<p className="font-body text-base sm:text-lg md:text-[18px] text-text-muted max-w-2xl leading-relaxed mb-10 font-normal">
        Scale your frontline clinic resilience without the drug expiry overhead — an outbreak-aware medicine grid that synchronizes IDSP surveillance with district health supply.
      </p>
{/**/}
<div className="relative inline-flex items-center justify-center gap-3.5 mb-10">
<a className="group inline-flex items-center pl-7 pr-2.5 py-2.5 rounded-full bg-[#181511] text-white hover:bg-neutral-800 transition-all duration-200 shadow-[0_8px_30px_rgba(24,21,19,0.18)] hover:shadow-xl shrink-0 cursor-pointer" href="#request-access" onClick={(e) => { e.preventDefault(); setActiveTab && setActiveTab('citizen'); }}>
<span className="font-medium text-[15px] tracking-tight mr-4">Find Live Medicine Stock</span>
<span className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#94816C] via-[#5C5248] to-[#998D80] flex items-center justify-center text-white font-bold text-sm shadow-inner group-hover:scale-105 transition-transform duration-200">
<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
</span>
</a>
{/**/}
<div className="hidden sm:flex absolute left-full top-1/2 -translate-y-1/2 ml-3 items-center select-none pointer-events-none whitespace-nowrap"><svg className="w-24 h-10 text-stone-900 shrink-0 -translate-x-1.5 translate-y-1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 92 42">
  <path d="M 16 19 L 2 19 M 2 19 L 10 11 M 2 19 L 10 27"></path>
  <path d="M 16 19 C 45 15, 65 20, 52 28 C 42 34, 46 39, 66 38 C 76 37, 85 34, 88 31"></path>
</svg>
<span className="font-handwriting text-[23px] text-stone-900 font-bold rotate-[10deg] tracking-tight ml-0.5 mt-2 select-none">Click here</span></div>
</div>
{/**/}
<div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-text-subtle font-medium mb-12">
{/**/}
<div className="flex -space-x-2">
<div className="w-7 h-7 rounded-full bg-[#E6D4BD] border-2 border-surface-warm flex items-center justify-center text-[10px] font-bold text-amber-950">MH</div>
<div className="w-7 h-7 rounded-full bg-[#D1E0D7] border-2 border-surface-warm flex items-center justify-center text-[10px] font-bold text-[#143E26]">RJ</div>
<div className="w-7 h-7 rounded-full bg-[#D0DDF0] border-2 border-surface-warm flex items-center justify-center text-[10px] font-bold text-[#1E3A5F]">TN</div>
<div className="w-7 h-7 rounded-full bg-[#EBDAD2] border-2 border-surface-warm flex items-center justify-center text-[10px] font-bold text-[#572B17]">DL</div>
</div>
{/**/}
<div className="flex items-center text-amber-500 gap-0.5">
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
</div>
<span className="text-text-muted font-medium">Loved by health officers &amp; state missions globally ❤</span>
</div>
{/**/}
<div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 mt-8 mb-6 max-w-5xl mx-auto w-full px-4 text-center md:text-left"><div className="flex items-center gap-3 text-sm md:text-base font-medium text-text-obsidian"><span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-text-obsidian text-white flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 shadow-xs">✓</span><span className="leading-snug">Frontline clinical leadership (not static PDF spreadsheets)</span></div><div className="flex items-center gap-3 text-sm md:text-base font-medium text-text-obsidian"><span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-text-obsidian text-white flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 shadow-xs">✓</span><span className="leading-snug">14-day early warning: clarity + quick rebalance before hospital surge</span></div><div className="flex items-center gap-3 text-sm md:text-base font-medium text-text-obsidian"><span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-text-obsidian text-white flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 shadow-xs">✓</span><span className="leading-snug">Human-first, audit-compliant (systems district officers actually use)</span></div></div>
</section>
{/**/}
<section className="w-full py-3 mb-10 overflow-hidden relative z-10">
<div className="marquee-mask w-full overflow-hidden">
<div className="marquee-track flex items-center gap-4 text-xs font-medium text-text-umber">
<div className="flex items-center gap-4 shrink-0">
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-border-soft shadow-xs backdrop-blur-sm">
<span className="text-amber-brand font-bold text-sm">✓</span> District inventory that prevents stock-outs (not chaos)
            </span>
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-border-soft shadow-xs backdrop-blur-sm">
<span className="text-amber-brand font-bold text-sm">✓</span> Redistribute faster with automated FEFO matching
            </span>
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-border-soft shadow-xs backdrop-blur-sm">
<span className="text-amber-brand font-bold text-sm">✓</span> Keep vital medicines clear, auditable, and cold-chain verified
            </span>
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-border-soft shadow-xs backdrop-blur-sm">
<span className="text-amber-brand font-bold text-sm">✓</span> Stay ahead of monsoon &amp; vector surges
            </span>
</div>
{/**/}
<div aria-hidden="true" className="flex items-center gap-4 shrink-0">
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-border-soft shadow-xs backdrop-blur-sm">
<span className="text-amber-brand font-bold text-sm">✓</span> District inventory that prevents stock-outs (not chaos)
            </span>
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-border-soft shadow-xs backdrop-blur-sm">
<span className="text-amber-brand font-bold text-sm">✓</span> Redistribute faster with automated FEFO matching
            </span>
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-border-soft shadow-xs backdrop-blur-sm">
<span className="text-amber-brand font-bold text-sm">✓</span> Keep vital medicines clear, auditable, and cold-chain verified
            </span>
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-border-soft shadow-xs backdrop-blur-sm">
<span className="text-amber-brand font-bold text-sm">✓</span> Stay ahead of monsoon &amp; vector surges
            </span>
</div>
</div>
</div>
</section>
{/**/}
<section className="w-full px-5 md:px-8 py-20 md:py-28 bg-[#F6F1E8]/70 relative border-y border-border-soft/60" id="start-where-you-are">
<div className="max-w-6xl mx-auto flex flex-col items-center">
{/**/}
<div className="text-center mb-16 max-w-3xl mx-auto">
  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-soft text-primary-rich font-bold text-xs border border-amber-brand/20 mb-4 shadow-2xs">
    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
    <span>About Aushadh Setu • Sovereign Mission</span>
  </div>
  <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-obsidian tracking-tight mb-4">
    Bridging Frontline Medicine Chaos with Autonomous Supply
  </h2>
  <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
    Aushadh Setu is India’s sovereign outbreak-aware medicine supply and redistribution grid—collapsing the 21-day procurement lag into real-time algorithmic rebalancing.
  </p>
  <div className="mt-4 flex justify-center">
    <button
      onClick={() => {
        setActiveTab && setActiveTab('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-amber-50 text-primary-rich text-xs font-bold border border-amber-brand/30 transition shadow-2xs cursor-pointer"
    >
      <span>Read Our Sovereign Mission &amp; National Architecture</span>
      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
    </button>
  </div>
</div>
{/**/}
<div className="grid grid-cols-1 md:grid-cols-3 gap-7 w-full items-stretch">
{/**/}
<div className="bg-white rounded-[2rem] p-7 sm:p-8 border border-border-soft shadow-[0_4px_24px_rgba(26,22,20,0.03)] flex flex-col justify-between hover:shadow-[0_12px_36px_rgba(217,119,6,0.08)] hover:border-amber-brand/35 transition-all duration-300">
<div>
<h3 className="font-display font-bold text-xl sm:text-[22px] text-text-obsidian mb-3 leading-snug">
                I'm feeling frontline medicine chaos
              </h3>
<p className="font-body text-sm text-text-muted leading-relaxed mb-6 font-normal">
                Clinics run dry during surges, delivery expectations are fuzzy, and drug write-offs are ad hoc.
              </p>
{/**/}
<a className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-full border border-neutral-300 text-xs font-semibold text-text-obsidian hover:bg-neutral-50 transition-colors mb-8 cursor-pointer" href="#how-it-works" onClick={(e) => { e.preventDefault(); setActiveTab && setActiveTab('forecast'); }}>
                Read: What is Autonomous Redistribution?
              </a>
</div>
{/**/}
<div className="w-full h-56 rounded-2xl bg-[#FCFAF7] border border-border-soft/70 relative overflow-hidden card-floor-glow p-4 flex flex-col items-center justify-center gap-2.5">
{/**/}
<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-border-soft text-xs font-medium text-text-umber -rotate-3 hover:rotate-0 transition-transform">
<span className="">Stock-out risk</span>
<span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">✕</span>
</div>
{/**/}
<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-xs border border-border-soft text-xs font-medium text-text-umber rotate-2 hover:rotate-0 transition-transform">
<span className="">Messy procurement</span>
<span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">✕</span>
</div>
{/**/}
<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-border-soft text-xs font-medium text-text-umber -rotate-2 hover:rotate-0 transition-transform">
<span className="">Pharmacist overload</span>
<span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">✕</span>
</div>
{/**/}
<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-xs border border-border-soft text-xs font-medium text-text-umber rotate-3 hover:rotate-0 transition-transform">
<span className="">Slow emergency transfer</span>
<span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">✕</span>
</div>
</div>
</div>
{/**/}
<div className="bg-white rounded-[2rem] p-7 sm:p-8 border border-border-soft shadow-[0_4px_24px_rgba(26,22,20,0.03)] flex flex-col justify-between hover:shadow-[0_12px_36px_rgba(217,119,6,0.08)] hover:border-amber-brand/35 transition-all duration-300">
<div>
<h3 className="font-display font-bold text-xl sm:text-[22px] text-text-obsidian mb-3 leading-snug">
                I want to see what you actually do
              </h3>
<p className="font-body text-sm text-text-muted leading-relaxed mb-6 font-normal">
                Explore how Aushadh Setu supports disease surveillance, 14-day burn rates, cold chain, and FEFO matching.
              </p>
{/**/}
<a className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-full border border-neutral-300 text-xs font-semibold text-text-obsidian hover:bg-neutral-50 transition-colors mb-8" href="#how-it-works">
                Explore system capabilities →
              </a>
</div>
{/**/}
<div className="w-full h-56 rounded-2xl bg-[#FCFAF7] border border-border-soft/70 relative overflow-hidden card-floor-glow p-4 flex flex-col justify-center">
<div className="flex flex-col gap-3 relative">
{/**/}
<div className="absolute left-3.5 top-3 bottom-3 w-0.5 border-l-2 border-dashed border-amber-300 pointer-events-none"></div>
{/**/}
<div className="flex items-start gap-3 relative z-10">
<div className="w-7 h-7 rounded-full bg-[#E08316] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                    1
                  </div>
<div>
<div className="text-[12px] font-bold text-text-obsidian">Discovery &amp; Baseline Audit</div>
<div className="text-[10.5px] text-text-muted leading-tight">Geographic mapping &amp; seasonal disease vectors</div>
</div>
</div>
{/**/}
<div className="flex items-start gap-3 relative z-10">
<div className="w-7 h-7 rounded-full bg-[#E08316] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                    2
                  </div>
<div>
<div className="text-[12px] font-bold text-text-obsidian">14-Day Outbreak Model</div>
<div className="text-[10.5px] text-text-muted leading-tight">Burn velocity &amp; FEFO surplus thresholds</div>
</div>
</div>
{/**/}
<div className="flex items-start gap-3 relative z-10">
<div className="w-7 h-7 rounded-full bg-[#E08316] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                    3
                  </div>
<div>
<div className="text-[12px] font-bold text-text-obsidian">1-Click Peer-to-Peer Dispatch</div>
<div className="text-[10.5px] text-text-muted leading-tight">Digital vouchers &amp; cold-chain telemetry</div>
</div>
</div>
</div>
</div>
</div>
{/**/}
<div className="bg-white rounded-[2rem] p-7 sm:p-8 border border-border-soft shadow-[0_4px_24px_rgba(26,22,20,0.03)] flex flex-col justify-between hover:shadow-[0_12px_36px_rgba(217,119,6,0.08)] hover:border-amber-brand/35 transition-all duration-300">
<div>
<h3 className="font-display font-bold text-xl sm:text-[22px] text-text-obsidian mb-3 leading-snug">
                I'm ready to fix this now
              </h3>
<p className="font-body text-sm text-text-muted leading-relaxed mb-6 font-normal">
                Receive a customized epidemiological simulation and cold-chain route map for your district.
              </p>
{/**/}
<a className="group inline-flex items-center justify-between w-full pl-5 pr-2 py-2 rounded-full bg-[#181513] text-white hover:bg-neutral-800 transition-all mb-8 shadow-sm cursor-pointer" href="#request-access" onClick={(e) => { e.preventDefault(); setActiveTab && setActiveTab('dho'); }}>
<span className="text-xs font-semibold">Request District Deployment Plan</span>
<span className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#B2762A] to-[#F1B96B] flex items-center justify-center text-neutral-900 font-bold text-xs shadow-inner group-hover:scale-105 transition-transform">
                  &gt;
                </span>
</a>
</div>
{/**/}
<div className="w-full h-56 rounded-2xl bg-[#FCFAF7] border border-border-soft/70 relative overflow-hidden card-floor-glow p-3.5 flex flex-col justify-between">
{/**/}
<div className="grid grid-cols-2 gap-2 flex-1">
{/* Dr. Verma (DHO) */}
<div className="rounded-xl bg-stone-800 p-2.5 flex flex-col justify-between text-white relative overflow-hidden shadow-inner group">
  <img
    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"
    alt="Dr. Verma (DHO)"
    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none"></div>
  <div className="flex items-center justify-between relative z-10">
    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
    <span className="material-symbols-outlined text-[13px] text-white/90 bg-black/40 px-1 py-0.5 rounded backdrop-blur-xs">mic</span>
  </div>
  <div className="relative z-10 text-[10px] font-semibold tracking-tight text-white drop-shadow-sm">
    Dr. Verma (DHO)
  </div>
</div>

{/* Setu Lead Analyst */}
<div className="rounded-xl bg-stone-700 p-2.5 flex flex-col justify-between text-white relative overflow-hidden shadow-inner group">
  <img
    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
    alt="Setu Lead Analyst"
    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none"></div>
  <div className="flex items-center justify-between relative z-10">
    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
    <span className="material-symbols-outlined text-[13px] text-white/90 bg-black/40 px-1 py-0.5 rounded backdrop-blur-xs">mic</span>
  </div>
  <div className="relative z-10 text-[10px] font-semibold tracking-tight text-white drop-shadow-sm">
    Setu Lead Analyst
  </div>
</div>
</div>
{/**/}
<div className="pt-2 flex items-center justify-between px-1">
{/**/}
<div className="flex -space-x-1.5">
  <img
    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    alt="Attendee"
    className="w-5 h-5 rounded-full border border-white object-cover"
  />
  <img
    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    alt="Attendee"
    className="w-5 h-5 rounded-full border border-white object-cover"
  />
</div>
{/**/}
<div className="flex items-center gap-1.5">
<span className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-stone-700">
<span className="material-symbols-outlined text-[12px]">mic</span>
</span>
<span className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-stone-700">
<span className="material-symbols-outlined text-[12px]">videocam</span>
</span>
<span className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center text-white">
<span className="material-symbols-outlined text-[12px]">call_end</span>
</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
{/**/}
<section className="w-full px-5 md:px-8 py-20 md:py-28 relative" id="how-it-works">
<div className="max-w-6xl mx-auto flex flex-col items-center">
{/**/}
<div className="text-center mb-14 md:mb-18 max-w-3xl mx-auto">
<span className="text-[11px] font-bold tracking-[0.2em] text-primary-rich uppercase mb-3 block">Autonomous Orchestration</span>
<h2 className="font-display font-bold text-3xl sm:text-4xl md:text-[42px] leading-tight text-text-obsidian tracking-tight">
          A four-step loop from syndromic signal to replenished clinic
        </h2>
<p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto mt-3 font-normal leading-relaxed">
          How Aushadh Setu closes the operational gap within hours rather than waiting for bureaucratic re-ordering cycles.
        </p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              setActiveTab && setActiveTab('how-it-works');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-soft hover:bg-amber-100 text-primary-rich text-xs font-bold border border-amber-brand/30 transition shadow-2xs cursor-pointer"
          >
            <span>Explore Complete Operational Framework &amp; Deployment Tiers</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>
</div>
{/**/}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
{/**/}
<div className="lg:col-span-7 w-full rounded-[2.5rem] border border-[#EADBCC] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EAD9]/80 showcase-stage-glow relative overflow-hidden p-6 sm:p-8 md:p-10 flex items-center justify-center shadow-[0_16px_40px_rgba(26,22,20,0.06)] min-h-[500px] md:min-h-[540px]">

{/* Visual 1: Surveillance Signal Ingestion (Humanto Video Call Archetype) */}
{activeStep === 1 && (
  <div className="w-full h-full flex items-center justify-center relative animate-fade-in py-4">
    {/* Floating Top-Left Alert Card */}
    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl py-2.5 px-3.5 shadow-[0_16px_36px_rgba(35,25,5,0.12)] border border-stone-200/80 flex items-center gap-3 max-w-[270px] sm:max-w-[290px] animate-fade-in">
      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-amber-400/40 shadow-xs">
        <img
          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80"
          alt="Analyst"
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-[11.5px] font-bold text-text-obsidian tracking-tight">Surge Vector Detected</span>
        </div>
        <p className="text-[10px] text-text-muted mt-0.5 font-medium leading-tight">
          Mulshi Block • +41.8% syndromic spike (14-Day Advance Window)
        </p>
      </div>
    </div>

    {/* Video Call Window */}
    <div className="w-[300px] sm:w-[330px] md:w-[350px] bg-stone-900/85 backdrop-blur-md rounded-[26px] p-2.5 shadow-[0_24px_60px_rgba(26,22,20,0.22)] border border-stone-700/60 relative flex flex-col gap-2.5">
      {/* Top Feed: Dr. R. Kulkarni (IDSP Lead) */}
      <div className="w-full h-[150px] sm:h-[165px] rounded-2xl overflow-hidden relative bg-stone-800 shadow-inner group">
        <img
          src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80"
          alt="Dr. R. Kulkarni - IDSP Surveillance Lead"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10.5px] font-semibold border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Dr. R. Kulkarni • IDSP Lead</span>
        </div>
        <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md p-1 rounded-full text-white/90">
          <span className="material-symbols-outlined text-[13px] block">mic</span>
        </div>
      </div>

      {/* Bottom Feed: Dr. S. Nair (District Health Officer) */}
      <div className="w-full h-[150px] sm:h-[165px] rounded-2xl overflow-hidden relative bg-stone-800 shadow-inner group">
        <img
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80"
          alt="Dr. S. Nair - DHO Pune"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10.5px] font-semibold border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Dr. S. Nair • Pune DHO</span>
        </div>
        <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md p-1 rounded-full text-white/90">
          <span className="material-symbols-outlined text-[13px] block">mic</span>
        </div>
      </div>

      {/* Call Controls Bar at Bottom with Red Hangup Button */}
      <div className="pt-1 pb-1.5 flex items-center justify-center gap-4">
        <button type="button" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-[15px]">videocam</span>
        </button>
        {/* The Humanto Call End Button */}
        <button
          type="button"
          className="w-11 h-11 rounded-full bg-[#FB4245] shadow-[0_8px_20px_rgba(251,66,69,0.4)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
          title="End Consultation"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19.05 15.63c-.2-.25-.47-.43-.78-.52-.3-.08-.63-.07-.93.05l-4.55 1.61c-.23.09-.43.24-.59.43-.16.19-.27.41-.32.65l-.58 2.76c-1.5-.5-3.12-1.5-4.62-3-1.5-1.5-2.5-3.12-3-4.62l2.76-.58c.24-.05.46-.16.65-.32.19-.16.34-.36.43-.59l1.61-4.55c.12-.3.13-.63.05-.93-.09-.31-.27-.58-.52-.78C7.59 3.65 4.85 3.83 3.32 5.36c-2.34 2.34-2.34 6.14 0 8.48 2.34 2.34 6.14 2.34 8.48 0 1.53-1.53 1.71-4.27.25-5.21z" fill="white" />
            <line x1="2" y1="2" x2="22" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <button type="button" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-[15px]">volume_up</span>
        </button>
      </div>
    </div>
  </div>
)}

{/* Visual 2: Predictive Frontline Burn-Rate Modeling (Humanto Gantt Timeline Archetype) */}
{activeStep === 2 && (
  <div className="w-full h-full flex items-center justify-center animate-fade-in py-4">
    <div className="w-full max-w-[440px] bg-white/95 rounded-[26px] border border-black/15 shadow-[0_20px_50px_rgba(26,22,20,0.06)] p-6 flex flex-col gap-4 relative overflow-hidden">
      {/* Top Column Day Headers */}
      <div className="grid grid-cols-6 border-b border-black/[0.08] pb-3 text-center">
        {['12', '13', '14', '15', '16', '17'].map((day) => (
          <div
            key={day}
            className={`flex flex-col items-center justify-center relative ${
              day === '14' ? 'font-bold text-text-obsidian' : 'font-medium text-text-muted/70'
            }`}
          >
            <span className="text-[17px] tracking-tight">{day}</span>
            {day === '14' && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#231905] mt-1 shadow-xs"></div>
            )}
          </div>
        ))}
      </div>

      {/* Vertical Dividing Lines Across Columns */}
      <div className="absolute inset-x-6 top-16 bottom-6 pointer-events-none grid grid-cols-6 z-0">
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className={`border-r h-full ${
              idx === 2 ? 'border-dashed border-stone-800/30' : 'border-stone-200/40'
            }`}
          ></div>
        ))}
      </div>

      {/* 4 Pastel Horizontal Gantt Bars (Humanto Palette) */}
      <div className="relative z-10 flex flex-col gap-3 py-1">
        {/* Bar 1: Strategy / Alert */}
        <div className="w-[85%] bg-[#FFEBCD] border border-[#231905]/15 rounded-xl py-2 px-2.5 flex items-center gap-2 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-[#FFC16A]/70 text-[#231905] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[15px]">crisis_alert</span>
          </div>
          <span className="text-[12.5px] font-semibold text-[#231905] tracking-tight">
            Surveillance Signal Detected
          </span>
        </div>

        {/* Bar 2: Frontline Burn Velocity */}
        <div className="w-[92%] ml-auto bg-[#FFF3E3] border border-[#231905]/15 rounded-xl py-2 px-2.5 flex items-center gap-2 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-[#F8C88A]/60 text-[#231905] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[15px]">trending_up</span>
          </div>
          <span className="text-[12.5px] font-semibold text-[#231905] tracking-tight">
            Frontline Runway Velocity (4.2x)
          </span>
        </div>

        {/* Bar 3: Buffer Stock Breach */}
        <div className="w-[80%] bg-[#FFEADB] border border-[#231905]/15 rounded-xl py-2 px-2.5 flex items-center gap-2 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-[#FFB38A]/60 text-[#231905] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[15px]">inventory_2</span>
          </div>
          <span className="text-[12.5px] font-semibold text-[#231905] tracking-tight">
            Buffer Breach Warning (&lt;18h)
          </span>
        </div>

        {/* Bar 4: Autonomous FEFO Trigger */}
        <div className="w-[96%] ml-auto bg-[#FFF8E7] border border-[#231905]/15 rounded-xl py-2 px-2.5 flex items-center gap-2 shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-[#FAD02C]/50 text-[#231905] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[15px]">local_shipping</span>
          </div>
          <span className="text-[12.5px] font-semibold text-[#231905] tracking-tight">
            Autonomous FEFO Transfer Trigger
          </span>
        </div>
      </div>

      {/* Subtext Footer */}
      <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-text-muted">
        <span className="flex items-center gap-1 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          GFR Rule 153 Compliant
        </span>
        <span className="font-semibold text-text-obsidian">0 Bureaucratic Latency</span>
      </div>
    </div>
  </div>
)}

{/* Visual 3: Automated FEFO Surplus Matching (Humanto Concentric Rings Archetype) */}
{activeStep === 3 && (
  <div className="w-full h-full flex items-center justify-center relative animate-fade-in py-6 overflow-hidden min-h-[420px]">
    {/* 4 Concentric Circles Background (Humanto Exact) */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
      <div className="w-[200px] h-[200px] rounded-full border border-black absolute"></div>
      <div className="w-[280px] h-[280px] rounded-full border border-black absolute"></div>
      <div className="w-[360px] h-[360px] rounded-full border border-black absolute"></div>
      <div className="w-[440px] h-[440px] rounded-full border border-black absolute"></div>
    </div>

    {/* Floating Speech Bubble 1: Deficit Node (Top-Left) */}
    <div className="absolute top-6 left-3 sm:left-6 z-20 bg-white rounded-3xl rounded-br-sm border border-black/15 shadow-[0_12px_36px_rgba(35,25,5,0.08)] py-3 px-4 flex items-center gap-3 max-w-[310px] sm:max-w-[340px]">
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-rose-200">
        <img
          src="https://framerusercontent.com/images/ednY3uVtongDK5cUEF6JxHBCEg.png?width=208&height=204"
          alt="Dr. Joshi"
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="text-[12px] font-semibold text-[#231905] leading-snug">
          "Paud PHC: RL stock critically low (&lt;18 hrs). Need buffer."
        </p>
        <span className="text-[9.5px] font-extrabold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full mt-1 inline-block">
          Deficit • 350 Units
        </span>
      </div>
    </div>

    {/* Center FEFO Matching Badge */}
    <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border border-black/15 shadow-[0_16px_36px_rgba(35,25,5,0.12)] flex flex-col items-center justify-center text-center p-2">
      <span className="material-symbols-outlined text-[24px] text-amber-600 animate-spin" style={{ animationDuration: '6s' }}>
        sync
      </span>
      <span className="text-[8.5px] font-extrabold text-[#231905] uppercase tracking-tighter mt-0.5">
        FEFO 4.2s
      </span>
    </div>

    {/* Floating Speech Bubble 2: Surplus Donor Node (Bottom-Right) */}
    <div className="absolute bottom-6 right-3 sm:right-6 z-20 bg-white rounded-3xl rounded-tl-sm border border-black/15 shadow-[0_12px_36px_rgba(35,25,5,0.08)] py-3 px-4 flex items-center gap-3 max-w-[320px] sm:max-w-[360px]">
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-emerald-200">
        <img
          src="https://framerusercontent.com/images/pJ4hocTeIBc8D9KheyljRZGz3TY.png?width=208&height=204"
          alt="Pharmacist Shinde"
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="text-[12px] font-semibold text-[#231905] leading-snug">
          "Aundh Depot: Matched 350 Units surplus. 38-day expiry saved."
        </p>
        <span className="text-[9.5px] font-extrabold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
          Optimal Donor • 24.2 km Corridor
        </span>
      </div>
    </div>
  </div>
)}

{/* Visual 4: 1-Click Dispatch & Scale (Exact Humanto Circular Loop Archetype from Screenshot) */}
{activeStep === 4 && (
  <div className="w-full h-full flex items-center justify-center relative animate-fade-in py-6 overflow-hidden min-h-[440px]">
    {/* Looping Continuous Circular Arrows SVG */}
    <div className="relative flex items-center justify-center">
      <svg width="340" height="370" viewBox="0 0 370 405" fill="none" className="max-w-[290px] sm:max-w-[340px] drop-shadow-sm">
        <path
          d="M152.586 57.1992C87.1848 72.5543 36.3672 132.917 36.3672 202.064C36.3674 271.826 86.5268 331.661 152.19 346.928V333.264L191.324 368.867L152.19 404.471V384.053C66.5554 368.203 0.000200851 291.718 0 202.064C0 113.223 67.3972 36.0294 152.586 20.0791V57.1992ZM217.81 19.9688C304.331 35.4543 370 111.089 370 202.064C370 293.178 304.131 368.906 217.415 384.231V347.148C283.914 332.357 333.633 273.018 333.633 202.064C333.633 131.251 284.11 72.0078 217.81 57.0693V71.3008L178.676 35.6973L217.81 0.09375V19.9688Z"
          fill="#FFD292"
        />
      </svg>

      {/* Centered Square Badge with Layered Shadows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[116px] h-[116px] sm:w-[128px] sm:h-[128px] rounded-[30px] sm:rounded-[32px] bg-white border border-black/10 shadow-[0_30px_60px_rgba(0,0,0,0.08),0_12px_24px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center p-4 z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[26px]">all_inclusive</span>
        </div>
        <span className="text-[10px] font-extrabold uppercase text-[#231905] tracking-wider mt-2">
          Zero Waste
        </span>
      </div>
    </div>

    {/* Top-Right Speech Bubble (Exact Text & Avatar from Screenshot) */}
    <div className="absolute top-3 sm:top-5 right-2 sm:right-6 z-20 bg-white rounded-full border border-black/15 shadow-[0_12px_30px_rgba(0,0,0,0.06)] py-2.5 px-4 flex items-center gap-3 max-w-[320px]">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-black/10">
        <img
          src="https://framerusercontent.com/images/DnrLiXHhzaWEg4Drt7GS7KIF40.png?width=112&height=112"
          alt="Officer"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-[12px] sm:text-[12.5px] font-medium text-[#231905] tracking-tight">
        Things finally feel smoother. Stockout zero.
      </span>
    </div>

    {/* Bottom-Left Speech Bubble (Exact Text & Avatar from Screenshot) */}
    <div className="absolute bottom-3 sm:bottom-5 left-2 sm:left-6 z-20 bg-white rounded-full border border-black/15 shadow-[0_12px_30px_rgba(0,0,0,0.06)] py-2.5 px-4 flex items-center gap-3 max-w-[380px]">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-black/10">
        <img
          src="https://framerusercontent.com/images/qfvwg4IzoYaYLRShGIsDU5Rb7M.png?width=112&height=112"
          alt="Operations Lead"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-[12px] sm:text-[12.5px] font-medium text-[#231905] tracking-tight">
        Great - now we'll fine-tune and scale what's working.
      </span>
    </div>
  </div>
)}

</div>

{/**/}
<div className="lg:col-span-5 flex flex-col gap-3.5 w-full">
  {/* Step 1 */}
  <button
    type="button"
    onClick={() => switchStep(1)}
    className={`step-nav-item cursor-pointer text-left transition-all duration-200 rounded-3xl p-5 sm:p-6 relative ${
      activeStep === 1
        ? 'bg-white shadow-[0_12px_36px_rgba(26,22,20,0.08)] border-l-[4.5px] border-l-stone-900 border-y border-r border-stone-200/90'
        : 'hover:bg-white/60 border border-transparent hover:border-border-soft'
    }`}
  >
    <div className="flex items-center gap-3 mb-1.5">
      <span className={`step-badge w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        activeStep === 1 ? 'bg-text-obsidian text-white' : 'bg-stone-200 text-text-obsidian'
      }`}>1</span>
      <h3 className={`step-title font-display ${
        activeStep === 1 ? 'font-bold text-lg sm:text-[19px] text-text-obsidian' : 'font-semibold text-base sm:text-[17px] text-text-muted'
      }`}>Surveillance Signal Ingestion</h3>
    </div>
    <p className={`step-sub font-body text-xs sm:text-[13px] leading-relaxed pl-9 font-normal ${
      activeStep === 1 ? 'text-text-muted' : 'text-text-subtle'
    }`}>
      Connects to IDSP disease surveillance &amp; IMD climate telemetry to detect surge vectors 10–14 days ahead.
    </p>
    {activeStep === 1 && (
      <div className="ml-9 mt-3 h-1 w-24 bg-stone-900 rounded-full animate-fade-in"></div>
    )}
  </button>

  {/* Step 2 */}
  <button
    type="button"
    onClick={() => switchStep(2)}
    className={`step-nav-item cursor-pointer text-left transition-all duration-200 rounded-3xl p-5 sm:p-6 relative ${
      activeStep === 2
        ? 'bg-white shadow-[0_12px_36px_rgba(26,22,20,0.08)] border-l-[4.5px] border-l-stone-900 border-y border-r border-stone-200/90'
        : 'hover:bg-white/60 border border-transparent hover:border-border-soft'
    }`}
  >
    <div className="flex items-center gap-3 mb-1.5">
      <span className={`step-badge w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        activeStep === 2 ? 'bg-text-obsidian text-white' : 'bg-stone-200 text-text-obsidian'
      }`}>2</span>
      <h3 className={`step-title font-display ${
        activeStep === 2 ? 'font-bold text-lg sm:text-[19px] text-text-obsidian' : 'font-semibold text-base sm:text-[17px] text-text-muted'
      }`}>Predictive Frontline Burn-Rate Modeling</h3>
    </div>
    <p className={`step-sub font-body text-xs sm:text-[13px] leading-relaxed pl-9 font-normal ${
      activeStep === 2 ? 'text-text-muted' : 'text-text-subtle'
    }`}>
      Calculates daily stock depletion velocities across every PHC, SC, and CHC in the block.
    </p>
    {activeStep === 2 && (
      <div className="ml-9 mt-3 h-1 w-24 bg-stone-900 rounded-full animate-fade-in"></div>
    )}
  </button>

  {/* Step 3 */}
  <button
    type="button"
    onClick={() => switchStep(3)}
    className={`step-nav-item cursor-pointer text-left transition-all duration-200 rounded-3xl p-5 sm:p-6 relative ${
      activeStep === 3
        ? 'bg-white shadow-[0_12px_36px_rgba(26,22,20,0.08)] border-l-[4.5px] border-l-stone-900 border-y border-r border-stone-200/90'
        : 'hover:bg-white/60 border border-transparent hover:border-border-soft'
    }`}
  >
    <div className="flex items-center gap-3 mb-1.5">
      <span className={`step-badge w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        activeStep === 3 ? 'bg-text-obsidian text-white' : 'bg-stone-200 text-text-obsidian'
      }`}>3</span>
      <h3 className={`step-title font-display ${
        activeStep === 3 ? 'font-bold text-lg sm:text-[19px] text-text-obsidian' : 'font-semibold text-base sm:text-[17px] text-text-muted'
      }`}>Automated FEFO Surplus Matching</h3>
    </div>
    <p className={`step-sub font-body text-xs sm:text-[13px] leading-relaxed pl-9 font-normal ${
      activeStep === 3 ? 'text-text-muted' : 'text-text-subtle'
    }`}>
      Identifies nearby facilities holding surplus medicines nearing expiry (&lt;60 days) and routes them zero-waste.
    </p>
    {activeStep === 3 && (
      <div className="ml-9 mt-3 h-1 w-24 bg-stone-900 rounded-full animate-fade-in"></div>
    )}
  </button>

  {/* Step 4 */}
  <button
    type="button"
    onClick={() => switchStep(4)}
    className={`step-nav-item cursor-pointer text-left transition-all duration-200 rounded-3xl p-5 sm:p-6 relative ${
      activeStep === 4
        ? 'bg-white shadow-[0_12px_36px_rgba(26,22,20,0.08)] border-l-[4.5px] border-l-stone-900 border-y border-r border-stone-200/90'
        : 'hover:bg-white/60 border border-transparent hover:border-border-soft'
    }`}
  >
    <div className="flex items-center gap-3 mb-1.5">
      <span className={`step-badge w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        activeStep === 4 ? 'bg-text-obsidian text-white' : 'bg-stone-200 text-text-obsidian'
      }`}>4</span>
      <h3 className={`step-title font-display ${
        activeStep === 4 ? 'font-bold text-lg sm:text-[19px] text-text-obsidian' : 'font-semibold text-base sm:text-[17px] text-text-muted'
      }`}>1-Click Dispatch &amp; Cold-Chain Telemetry</h3>
    </div>
    <p className={`step-sub font-body text-xs sm:text-[13px] leading-relaxed pl-9 font-normal ${
      activeStep === 4 ? 'text-text-muted' : 'text-text-subtle'
    }`}>
      Chief Medical Officer approves digital gate-passes with verified 2°C–8°C thermal tracking.
    </p>
    {activeStep === 4 && (
      <div className="ml-9 mt-3 h-1 w-24 bg-stone-900 rounded-full animate-fade-in"></div>
    )}
  </button>
</div>
</div>
</div>
</section>
{/**/}
<section className="w-full px-5 md:px-8 py-20 md:py-28 relative" id="impact">
<div className="max-w-5xl mx-auto rounded-[2.5rem] bg-[#181511] text-white p-8 sm:p-12 md:py-16 md:px-14 relative overflow-hidden shadow-2xl border border-white/10">
{/**/}
<svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" fill="none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 600">
<path d="M50 100 L250 50 L450 120 L650 40 L780 180 L700 420 L520 540 L280 500 L80 430 Z" stroke="#F59E0B" strokeDasharray="4 6" strokeWidth="1"></path>
<path d="M250 50 L280 500 M450 120 L520 540 M50 100 L700 420 M650 40 L280 500 M780 180 L80 430" stroke="#F59E0B" strokeDasharray="2 4" strokeWidth="0.7"></path>
<circle cx="250" cy="50" fill="#F59E0B" r="3"></circle>
<circle cx="450" cy="120" fill="#F59E0B" r="3"></circle>
<circle cx="650" cy="40" fill="#F59E0B" r="3"></circle>
<circle cx="700" cy="420" fill="#F59E0B" r="3"></circle>
<circle cx="280" cy="500" fill="#F59E0B" r="3"></circle>
</svg>
{/**/}
<div className="absolute top-0 right-1/4 w-[450px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
<div className="absolute bottom-0 left-10 w-[300px] h-[250px] bg-[#C27814]/15 rounded-full blur-[90px] pointer-events-none"></div>
<div className="relative z-10 flex flex-col items-center text-center">
<span className="text-[11px] font-bold tracking-[0.22em] text-amber-accent uppercase mb-3 block">
  Field Dispatches &amp; Research • The Aushadh Setu Blog
</span>
<h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white max-w-2xl tracking-tight mb-4 leading-tight">
  The Triple Zero Benchmark: Operational Case Studies &amp; Field Reports
</h2>
<p className="font-body text-neutral-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-10 font-normal">
  Published clinical analyses, GFR 2017 audit case studies, and cold-chain telemetry dispatches across active epidemic corridors.
</p>
{/**/}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-10 py-6 px-6 bg-white/[0.04] rounded-2xl border border-white/10 backdrop-blur-md">
<div className="flex flex-col items-center">
<span className="font-display font-bold text-3xl sm:text-4xl text-[#FED7AA] mb-1 tracking-tight">0</span>
<span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-0.5">Zero Tolerance</span>
<span className="text-xs text-neutral-300 font-medium">Stock-Out Mortalities</span>
</div>
<div className="flex flex-col items-center md:border-x md:border-white/10">
<span className="font-display font-bold text-3xl sm:text-4xl text-[#FED7AA] mb-1 tracking-tight">₹48.2 Cr</span>
<span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-0.5">Fiscal Recovery</span>
<span className="text-xs text-neutral-300 font-medium">Expired Drug Write-offs Rescued</span>
</div>
<div className="flex flex-col items-center">
<span className="font-display font-bold text-3xl sm:text-4xl text-[#FED7AA] mb-1 tracking-tight">100%</span>
<span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-0.5">Auditable Telemetry</span>
<span className="text-xs text-neutral-300 font-medium">Verifiable Frontline Visibility</span>
</div>
</div>
{/**/}
<div className="w-full max-w-xl text-left mb-10">
<span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-3 text-center sm:text-left">What you'll leave with:</span>
<ul className="space-y-3 text-xs sm:text-sm text-neutral-200 font-normal">
<li className="flex items-start gap-3">
<span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
<span className="">Build an outbreak-ready buffer stock grid that absorbs surge (not panic shortages)</span>
</li>
<li className="flex items-start gap-3">
<span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
<span className="">Rebalance faster with 1-click FEFO surplus transfer &amp; digital gate-passes</span>
</li>
<li className="flex items-start gap-3">
<span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
<span className="">Make drug expiry audit logs clear, statutory-compliant, and zero-waste</span>
</li>
</ul>
</div>
{/**/}
<div className="flex flex-col sm:flex-row items-center gap-3">
  <button
    className="group inline-flex items-center pl-7 pr-2.5 py-2.5 rounded-full bg-white text-text-obsidian hover:bg-neutral-100 transition-all duration-200 shadow-xl cursor-pointer"
    onClick={() => {
      setActiveTab && setActiveTab('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
  >
    <span className="font-medium text-sm sm:text-[15px] tracking-tight mr-4 text-text-obsidian">Read All 4 Operational Dispatches</span>
    <span className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform duration-200">
      &gt;
    </span>
  </button>
  <button
    className="inline-flex items-center px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
    onClick={() => {
      setActiveTab && setActiveTab('dho');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
  >
    Launch Command Console
  </button>
</div>
<p className="text-xs text-neutral-400 mt-3 font-normal tracking-wide">
  Published peer-reviewed case studies from active Maharashtra and Uttarakhand pilot corridors.
</p>
</div>
</div>
{/**/}
<div className="max-w-6xl mx-auto mt-20 md:mt-24">
<div className="flex items-center justify-between mb-8 px-2">
<h3 className="font-display font-bold text-2xl sm:text-3xl text-text-obsidian tracking-tight">
        What health officers &amp; missions say
      </h3>
{/**/}
<div className="flex items-center gap-2">
<button aria-label="Previous review" className="w-9 h-9 rounded-full bg-text-obsidian text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-sm text-sm">
          &lt;
        </button>
<button aria-label="Next review" className="w-9 h-9 rounded-full bg-text-obsidian text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-sm text-sm">
          &gt;
        </button>
</div>
</div>
{/**/}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/**/}
<div className="bg-white rounded-2xl p-6 sm:p-7 border border-border-soft shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
<div>
<div className="flex items-center text-amber-500 gap-0.5 mb-4">
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
</div>
<p className="font-body text-xs sm:text-sm text-text-muted leading-relaxed mb-6 font-normal">
            "Aushadh Setu completely eliminated monsoon antibiotic stock-outs across 36 talukas. The digital vouchers transformed statutory audits from months of painful ledger reconciliation into a 10-minute automated review."
          </p>
</div>
<div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
<div className="w-9 h-9 rounded-full bg-[#E6D4BD] flex items-center justify-center text-xs font-bold text-amber-950 shrink-0">
            PS
          </div>
<div>
<div className="text-xs font-bold text-text-obsidian">Dr. Pooja Sharma</div>
<div className="text-[11px] text-text-muted">Director, State Health Mission, Maharashtra</div>
</div>
</div>
</div>
{/**/}
<div className="bg-white rounded-2xl p-6 sm:p-7 border border-border-soft shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
<div>
<div className="flex items-center text-amber-500 gap-0.5 mb-4">
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
</div>
<p className="font-body text-xs sm:text-sm text-text-muted leading-relaxed mb-6 font-normal">
            "The 14-day early warning model and automated FEFO matching gave us the confidence to rebalance critical antivenom and pediatric IV fluids weeks before peak vector season hit our remote rural primary clinics."
          </p>
</div>
<div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
<div className="w-9 h-9 rounded-full bg-[#D1E0D7] flex items-center justify-center text-xs font-bold text-[#143E26] shrink-0">
            RV
          </div>
<div>
<div className="text-xs font-bold text-text-obsidian">Rajesh K. Verma</div>
<div className="text-[11px] text-text-muted">District Health Officer, Pune District</div>
</div>
</div>
</div>
{/**/}
<div className="bg-white rounded-2xl p-6 sm:p-7 border border-border-soft shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
<div>
<div className="flex items-center text-amber-500 gap-0.5 mb-4">
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
<span className="material-symbols-outlined text-[16px] fill-current">star</span>
</div>
<p className="font-body text-xs sm:text-sm text-text-muted leading-relaxed mb-6 font-normal">
            "Verifiable cold-chain telemetry paired with near-expiry redistribution brought our annual expired drug write-offs to absolute zero. Every vial and unit is tracked and accounted for without manual friction."
          </p>
</div>
<div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
<div className="w-9 h-9 rounded-full bg-[#D0DDF0] flex items-center justify-center text-xs font-bold text-[#1E3A5F] shrink-0">
            AD
          </div>
<div>
<div className="text-xs font-bold text-text-obsidian">Anita Deshmukh</div>
<div className="text-[11px] text-text-muted">Chief Medical Officer, Uttarakhand NHM</div>
</div>
</div>
</div>
</div>
{/**/}
<div className="flex items-center justify-center gap-1.5 mt-8">
<span className="w-6 h-1.5 rounded-full bg-text-obsidian"></span>
<span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
<span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
</div>
</div>
</section>
{/**/}
<section className="w-full px-5 md:px-8 py-20 md:py-28 bg-[#F6F1E8]/70 relative">
<div className="max-w-3xl mx-auto flex flex-col items-center">
<div className="text-center mb-14">
<span className="text-[11px] font-bold tracking-[0.2em] text-primary-rich uppercase mb-3 block">Governance &amp; Operational FAQs</span>
<h2 className="font-display font-bold text-3xl sm:text-4xl text-text-obsidian tracking-tight">
            Everything state missions ask us.
          </h2>
<p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto mt-2">
            Clear, transparent protocols designed for statutory audit compliance.
          </p>
</div>
<div className="w-full flex flex-col gap-3.5">
{/**/}
<details className="group bg-white p-6 rounded-2xl border border-border-soft transition-all duration-200 shadow-xs">
<summary className="flex justify-between items-center cursor-pointer list-none select-none">
<span className="font-display font-bold text-base sm:text-lg text-text-obsidian pr-4">Does this replace existing e-Aushadhi or state inventory software?</span>
<span className="w-8 h-8 rounded-full bg-amber-soft flex items-center justify-center group-open:rotate-180 transition-transform duration-200 text-primary-rich shrink-0">
<span className="material-symbols-outlined text-[19px]">expand_more</span>
</span>
</summary>
<p className="font-body text-sm sm:text-[15px] text-text-muted mt-4 leading-relaxed pt-3 border-t border-border-soft/60">
              No. Aushadh Setu acts as an intelligent overlay orchestration engine. It interfaces directly with CDAC's e-Aushadhi, state-specific portals (like Rajasthan's RMSCL or Maharashtra's e-Upkaran), and IDSP surveillance via read/write APIs, enhancing existing systems without requiring double data entry.
            </p>
</details>
{/**/}
<details className="group bg-white p-6 rounded-2xl border border-border-soft transition-all duration-200 shadow-xs">
<summary className="flex justify-between items-center cursor-pointer list-none select-none">
<span className="font-display font-bold text-base sm:text-lg text-text-obsidian pr-4">How are medicines verified for cold-chain transit?</span>
<span className="w-8 h-8 rounded-full bg-amber-soft flex items-center justify-center group-open:rotate-180 transition-transform duration-200 text-primary-rich shrink-0">
<span className="material-symbols-outlined text-[19px]">expand_more</span>
</span>
</summary>
<p className="font-body text-sm sm:text-[15px] text-text-muted mt-4 leading-relaxed pt-3 border-t border-border-soft/60">
              Every temperature-sensitive consignment (vaccines, anti-rabies sera, insulin, and antivenom) is paired with IoT BLE data-loggers. If a consignment breaches safe thermal bands during transit, the receiving PHC is automatically flagged to initiate quarantine verification before absorption.
            </p>
</details>
{/**/}
<details className="group bg-white p-6 rounded-2xl border border-border-soft transition-all duration-200 shadow-xs">
<summary className="flex justify-between items-center cursor-pointer list-none select-none">
<span className="font-display font-bold text-base sm:text-lg text-text-obsidian pr-4">What is the typical deployment timeline for a pilot district?</span>
<span className="w-8 h-8 rounded-full bg-amber-soft flex items-center justify-center group-open:rotate-180 transition-transform duration-200 text-primary-rich shrink-0">
<span className="material-symbols-outlined text-[19px]">expand_more</span>
</span>
</summary>
<p className="font-body text-sm sm:text-[15px] text-text-muted mt-4 leading-relaxed pt-3 border-t border-border-soft/60">
              District onboarding takes 14 to 21 calendar days. Week 1 maps facility geospatial buffers and historical consumption ledgers; Week 2 conducts hands-on DHO and pharmacist orientation; by Week 3, live automated reallocation recommendations go into effect.
            </p>
</details>
{/**/}
<details className="group bg-white p-6 rounded-2xl border border-border-soft transition-all duration-200 shadow-xs">
<summary className="flex justify-between items-center cursor-pointer list-none select-none">
<span className="font-display font-bold text-base sm:text-lg text-text-obsidian pr-4">How is statutory drug auditing handled during inter-facility transfers?</span>
<span className="w-8 h-8 rounded-full bg-amber-soft flex items-center justify-center group-open:rotate-180 transition-transform duration-200 text-primary-rich shrink-0">
<span className="material-symbols-outlined text-[19px]">expand_more</span>
</span>
</summary>
<p className="font-body text-sm sm:text-[15px] text-text-muted mt-4 leading-relaxed pt-3 border-t border-border-soft/60">
              All transfers generate a cryptographically tamper-evident Digital Transfer Voucher (DTV) compliant with General Financial Rules (GFR) 2017 and State Audit norms, reconciling ledgers automatically without manual paper register overhead.
            </p>
</details>
</div>
</div>
</section>
{/**/}
<section className="w-full px-5 md:px-8 py-20 md:py-24 text-center relative" id="request-access">
{/**/}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[350px] bg-gradient-to-r from-transparent via-[#F7C693]/35 to-transparent blur-[90px] pointer-events-none"></div>
<div className="max-w-6xl mx-auto rounded-[2.5rem] bg-[#FCFBF8] border border-[#E8E2D5] shadow-[0_8px_36px_rgba(26,22,20,0.04)] relative overflow-hidden py-16 md:py-24 px-6 md:px-14 flex flex-col items-center justify-center text-center">
{/**/}
<div className="absolute inset-x-0 bottom-0 h-[280px] pointer-events-none bg-gradient-to-t from-[#F8C896]/60 via-[#FDDDB8]/35 to-transparent"></div>
<div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[800px] h-[220px] pointer-events-none bg-[#F5A85A]/25 blur-[75px] rounded-full"></div>
{/**/}
<div className="absolute inset-0 pointer-events-none overflow-hidden">
{/**/}
<svg className="absolute -bottom-6 left-4 md:left-12 w-64 md:w-80 h-48 md:h-60 text-amber-700/15" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 240 180">
<polygon points="30,140 80,40 160,50 120,150" strokeDasharray="3 3"></polygon>
<polygon points="80,40 160,50 210,110 120,150"></polygon>
<polygon points="30,140 120,150 70,170"></polygon>
<line x1="80" x2="120" y1="40" y2="150"></line>
<line x1="30" x2="160" y1="140" y2="50"></line>
<line x1="160" x2="70" y1="50" y2="170"></line>
</svg>
{/**/}
<svg className="absolute -bottom-8 right-4 md:right-12 w-64 md:w-80 h-48 md:h-60 text-amber-700/15" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 240 180">
<polygon points="120,30 200,90 170,160 80,150 40,80"></polygon>
<polygon points="120,30 170,160 80,150" strokeDasharray="2 4"></polygon>
<line x1="120" x2="80" y1="30" y2="150"></line>
<line x1="40" x2="170" y1="80" y2="160"></line>
<line x1="200" x2="40" y1="90" y2="80"></line>
<polygon points="120,30 210,40 200,90"></polygon>
</svg>
</div>
{/**/}
<div className="relative z-10 max-w-3xl flex flex-col items-center">
  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-soft text-primary-rich font-bold text-xs border border-amber-brand/20 mb-4 shadow-2xs">
    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
    <span>Institutional Liaison &amp; 24/7 Nodal Hotline • Contact Us</span>
  </div>
  <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-[44px] leading-[1.12] tracking-tight text-text-obsidian max-w-2xl mb-4">
    Connect with the National Health Logistics Command
  </h2>
  <p className="font-body text-base sm:text-[17px] text-[#666057] max-w-xl mx-auto leading-relaxed mb-6 font-normal">
    Direct liaison for State Health Mission Directors, District Collectors, and Chief Medical Officers. Emergency medicine deficit hotline: <strong className="text-text-obsidian font-mono">1800-AUSHADH (24x7)</strong>.
  </p>
{/**/}
<div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
  <button
    className="group inline-flex items-center pl-7 pr-2.5 py-2.5 rounded-full bg-[#181513] text-white hover:bg-neutral-800 transition-all duration-200 shadow-[0_6px_20px_rgba(24,21,19,0.14)] hover:shadow-lg w-full sm:w-auto justify-center sm:justify-start cursor-pointer"
    onClick={() => {
      setActiveTab && setActiveTab('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
  >
    <span className="font-medium text-[14px] sm:text-[15px] tracking-tight mr-4 text-white">Contact &amp; 24/7 Nodal Hotline</span>
    <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B2762A] via-[#E8B264] to-[#FDE7B8] flex items-center justify-center text-neutral-900 font-bold text-xs shadow-inner group-hover:scale-105 transition-transform duration-200">
      &gt;
    </span>
  </button>
  <button
    className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white/80 hover:bg-white text-text-obsidian font-medium text-[14px] sm:text-[15px] border border-[#D9D2C5] hover:border-text-subtle transition-all duration-200 shadow-xs w-full sm:w-auto cursor-pointer"
    onClick={() => {
      setActiveTab && setActiveTab('dho');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
  >
    Launch Command Console
  </button>
</div>
</div>
</div>
</section>
</main>
{/**/}
<footer className="w-full bg-[#F3EDE2] border-t border-border-soft/80 pt-16 pb-12 mt-12 relative z-10">
<div className="max-w-6xl mx-auto px-5 md:px-8">
<div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-border-soft">
{/**/}
<div className="md:col-span-5 flex flex-col items-start">
<div className="flex items-center gap-2.5 mb-4">
<div className="w-7 h-7 rounded-full bg-amber-soft flex items-center justify-center text-primary-rich border border-amber-brand/25">
<span className="material-symbols-outlined text-[16px]">emergency</span>
</div>
<span className="font-display font-bold text-lg text-text-obsidian tracking-tight">Aushadh Setu</span>
<span className="text-xs text-text-subtle font-medium">औषध सेतु</span>
</div>
<p className="font-body text-sm text-text-muted leading-relaxed max-w-sm mb-6">
            The federated digital backbone orchestrating real-time life-saving medicine availability, buffer stocks, and cold-chain integrity across India's sovereign healthcare ecosystem.
          </p>
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-border-soft text-xs text-text-muted font-medium">
<span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Architecture Aligned: ABDM Standards • MoHFW Guidelines • C-DAC e-Aushadhi Compatible
          </div>
</div>
{/**/}
<div className="md:col-span-2 md:col-start-7 flex flex-col gap-3">
<span className="text-xs font-bold uppercase tracking-wider text-text-subtle">Architecture</span>
<nav className="flex flex-col gap-2 text-sm text-text-muted font-medium text-left">
<button type="button" onClick={() => { setActiveTab && setActiveTab('forecast'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">Surveillance Engine</button>
<button type="button" onClick={() => { setActiveTab && setActiveTab('simulation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">Cold-Chain IoT</button>
<button type="button" onClick={() => { setActiveTab && setActiveTab('how-it-works'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">4-Tier Framework</button>
<button type="button" onClick={() => { setActiveTab && setActiveTab('pharmacist'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">Verifiable Audit Logs</button>
</nav>
</div>
{/**/}
<div className="md:col-span-2 flex flex-col gap-3">
<span className="text-xs font-bold uppercase tracking-wider text-text-subtle">Ecosystem</span>
<nav className="flex flex-col gap-2 text-sm text-text-muted font-medium text-left">
<button type="button" onClick={() => { setActiveTab && setActiveTab('dho'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">State Missions</button>
<button type="button" onClick={() => { setActiveTab && setActiveTab('dho'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">District Command</button>
<button type="button" onClick={() => { setActiveTab && setActiveTab('pharmacist'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">Pharma Desk</button>
<button type="button" onClick={() => { setActiveTab && setActiveTab('citizen'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">Citizen Stock Finder</button>
</nav>
</div>
{/**/}
<div className="md:col-span-2 flex flex-col gap-3">
<span className="text-xs font-bold uppercase tracking-wider text-text-subtle">Governance</span>
<nav className="flex flex-col gap-2 text-sm text-text-muted font-medium text-left">
<button type="button" onClick={() => { setActiveTab && setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">About Mission</button>
<button type="button" onClick={() => { setActiveTab && setActiveTab('how-it-works'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">MoHFW Guidelines</button>
<button type="button" onClick={() => { setActiveTab && setActiveTab('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">Statutory Audit (GFR)</button>
<button type="button" onClick={() => { setActiveTab && setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-text-obsidian transition-colors cursor-pointer">24/7 SOS Escalation</button>
</nav>
</div>
</div>
{/**/}
<div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtle">
<p className="">© 2025 Aushadh Setu (औषध सेतु). National Medicine Supply Grid initiative under Digital Health Mission. All rights reserved.</p>
<div className="flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
<span className="font-medium text-text-muted">National Grid Architecture • 5 Flagship Pilot Corridors Active</span>
</div>
</div>
</div>
</footer>
{/**/}




    </div>
  );
}
