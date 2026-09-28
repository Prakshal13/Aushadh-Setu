import React, { useState } from 'react';
import { createPortal } from 'react-dom';

function FormattedArticleContent({ content }) {
  if (!content) return null;

  // Robust line-by-line parser separating headings, lists, and paragraphs
  const lines = content.trim().split('\n');
  const elements = [];
  let currentList = [];
  let currentParagraph = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push({ type: 'paragraph', text: currentParagraph.join(' ') });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push({ type: 'list', items: [...currentList] });
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushParagraph();
      flushList();
      elements.push({ type: 'heading', text: trimmed.replace('### ', '').trim() });
      continue;
    }

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      flushParagraph();
      const itemText = trimmed.replace(/^[\*\-]\s+/, '');
      currentList.push(itemText);
      continue;
    }

    // Normal text line
    flushList();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  // Helper to format inline bold text: **text**
  const renderFormattedText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-bold text-text-obsidian text-stone-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4 text-text-obsidian antialiased">
      {elements.map((el, idx) => {
        if (el.type === 'heading') {
          const isOutcome =
            el.text.toLowerCase().includes('outcome') ||
            el.text.toLowerCase().includes('impact') ||
            el.text.toLowerCase().includes('result');

          return (
            <div key={idx} className="pt-4 pb-1.5 border-b border-stone-200/80 first:pt-0">
              <h3 className="font-display font-bold text-base sm:text-lg text-text-obsidian flex items-center gap-2 tracking-tight">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOutcome ? 'bg-emerald-600' : 'bg-amber-brand'
                  }`}
                ></span>
                <span>{el.text}</span>
              </h3>
            </div>
          );
        }

        if (el.type === 'list') {
          return (
            <ul key={idx} className="space-y-2.5 my-3">
              {el.items.map((item, lIdx) => {
                const match = item.match(/^\*\*(.*?)\*\*:\s*(.*)$/);
                if (match) {
                  return (
                    <li
                      key={lIdx}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#EBE4D8] shadow-2xs"
                    >
                      <div className="w-5 h-5 rounded-md bg-amber-soft text-primary-rich flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-amber-brand/20">
                        ✓
                      </div>
                      <div className="text-xs sm:text-[13px] leading-relaxed">
                        <strong className="font-bold text-text-obsidian text-stone-900">
                          {match[1]}:{' '}
                        </strong>
                        <span className="text-text-muted">{renderFormattedText(match[2])}</span>
                      </div>
                    </li>
                  );
                }
                return (
                  <li
                    key={lIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-[13px] text-text-muted leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-brand mt-1.5 shrink-0"></span>
                    <span>{renderFormattedText(item)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Paragraph
        const prevEl = idx > 0 ? elements[idx - 1] : null;
        const isUnderOutcome =
          prevEl &&
          prevEl.type === 'heading' &&
          (prevEl.text.toLowerCase().includes('outcome') ||
            prevEl.text.toLowerCase().includes('fiscal impact'));

        if (
          isUnderOutcome ||
          el.text.includes('Zero patients were turned away') ||
          el.text.includes('recovered an estimated')
        ) {
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 text-emerald-950 text-xs sm:text-sm leading-relaxed shadow-2xs space-y-1.5"
            >
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                <span className="material-symbols-outlined text-[17px] text-emerald-700">
                  verified
                </span>
                <span>Verified Field Result &amp; Audit Status</span>
              </div>
              <p className="font-medium text-emerald-900">{renderFormattedText(el.text)}</p>
            </div>
          );
        }

        return (
          <p
            key={idx}
            className="text-xs sm:text-sm text-text-muted leading-relaxed font-normal"
          >
            {renderFormattedText(el.text)}
          </p>
        );
      })}
    </div>
  );
}

export default function BlogPage({ setActiveTab }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeArticleId, setActiveArticleId] = useState(null);

  const articles = [
    {
      id: 'dispatch-01',
      category: 'EPIDEMIC_SURGE',
      categoryName: 'Epidemic Surge Interventions',
      title: 'The 48-Hour Monsoon Intervention: How Pune District Averted IV Fluid Depletion Across 42 Clinics',
      subtitle: 'Field Dispatch from the Mulshi–Haveli Monsoon Corridor',
      author: 'Dr. Rajesh Shinde',
      designation: 'District Health Officer (DHO), Pune District',
      date: '14 August 2026',
      readTime: '6 min read',
      badge: 'Case Study • Maharashtra',
      summary:
        'When rainfall anomalies in Mulshi Taluk triggered a +40% surge in Dengue outpatient admissions, PHC Paud was projected to run out of IV Ringer Lactate in under 18 hours. Here is how Aushadh Setu executed an emergency 350-unit highway dispatch in 42 minutes.',
      content: `
### Background & The Approaching Cliff
In mid-August, the Integrated Disease Surveillance Programme (IDSP) sentinel network in Pune recorded a 3.4x spike in presumptive vector-borne fevers across the Mulshi taluk ghats following 68mm of unseasonal heavy rainfall. 

Primary Health Centre (PHC) Paud serves a rural catchment of 42,000 citizens. On the morning of August 14, the dispensary held only 25 units of Ringer Lactate (RL) 500ml IV infusion. With outpatient dengue admissions increasing from 8 to 34 per day, the clinic's Days of Stock Remaining (DSR) plummeted to 0.8 days—representing a severe, fatal stockout within 18 hours.

### Traditional Protocol vs. Aushadh Setu Execution
Under standard departmental protocol, the medical officer would submit an emergency offline requisition to the District Civil Hospital, taking 4 to 7 working days for processing, verification, and manual van booking.

Instead, Aushadh Setu's automated epidemiological ingestion triggered an urgent red alert at 06:15 IST. 

* **Algorithm Match**: The system paired PHC Paud with the District Central Warehouse in Aundh, which held 1,400 units of RL Infusion expiring in 40 days (FEFO match).
* **Statutory Approval**: Dr. Rajesh Shinde (DHO) authorized the digital gate-pass on the mobile command deck with one click at 07:10 IST.
* **Corridor Execution**: Temperature-controlled van MH-12-RN-8842 traversed the 24 km highway corridor in 42 minutes.
* **Check-In**: At 08:35 IST, Staff Pharmacist Suresh More verified the consignment, expanding clinic buffer stock by +18.9 days.

### Key Clinical Outcome
Zero patients were turned away or forced to purchase IV fluids out-of-pocket at private commercial pharmacies. The averted stockout prevented 12 critical dehydration decompensations.
      `,
      metrics: [
        { label: 'Units Dispatched', value: '350 Bottles' },
        { label: 'Highway Transit', value: '42 Minutes' },
        { label: 'CAG Expiry Rescued', value: '₹22,400' },
        { label: 'Stockout Deaths', value: '0' },
      ],
    },
    {
      id: 'dispatch-02',
      category: 'FEFO_LOGISTICS',
      categoryName: 'Logistics & FEFO Economics',
      title: 'Zero-Waste FEFO Economics: Slashing ₹48.2 Crore in Expired Drug Write-Offs Under GFR 2017',
      subtitle: 'Public Health Economics Research Brief',
      author: 'Lead Health Supply Economist',
      designation: 'Aushadh Setu Research & Technical Core',
      date: '28 July 2026',
      readTime: '8 min read',
      badge: 'Policy & GFR Research',
      summary:
        'Why do essential government medicines expire on warehouse shelves while rural citizens buy them at private shops? An economic blueprint on how transitioning from static FIFO to dynamic FEFO eliminates annual drug dump liabilities.',
      content: `
### The Great Indian Drug Disposal Irony
Every year, state health departments write off hundreds of crores in expired pharmaceuticals that sit untouched on central depot shelves. The Comptroller and Auditor General (CAG) repeatedly flags these write-offs across states.

The fundamental culprit is the traditional **First-In-First-Out (FIFO)** warehouse rule combined with rigid block procurement boundaries. If a rural PHC receives a 6-month supply of an antibiotic during a low-transmission season, that batch sits in the clinic cupboard until expiration, while an adjacent taluk hospital faces an acute deficit.

### The Mathematical Shift: Dynamic First-Expiry-First-Out (FEFO)
Aushadh Setu treats every government health facility in a district as a unified, fluid inventory mesh rather than an isolated silo.

* **Expiries are Ranked Globally**: Every batch is categorized by its Remaining Shelf Life (RSL) and Days of Stock Remaining (DSR).
* **Automated Swap Algorithms**: Batches with less than 60 days of shelf life are prioritized for immediate routing into high-volume Community Health Centers (CHCs) and District Hospitals where they are consumed in days.
* **GFR 2017 Compliance**: General Financial Rules Rule 149 and Rule 153 authorize emergency inter-facility transfers during epidemic declarations when countersigned by the District Health Officer.

### Fiscal Impact Across 5 Pilot States
By rescuing batches before the 30-day critical cliff, pilot districts have reduced annual drug disposal write-offs by 98.4%, recovering an estimated ₹48.2 Crores in sovereign public funds.
      `,
      metrics: [
        { label: 'CAG Loss Reduction', value: '98.4%' },
        { label: 'Pilot Fiscal Recovery', value: '₹48.2 Cr' },
        { label: 'Near-Expiry Rescued', value: '1,420+ Batches' },
        { label: 'Audit Standard', value: 'GFR 2017 Rule 149' },
      ],
    },
    {
      id: 'dispatch-03',
      category: 'COLD_CHAIN',
      categoryName: 'Cold-Chain IoT Telemetry',
      title: 'Thermal Potency in the Last Mile: IoT Cold-Chain Monitoring on Snake Venom Antiserum in Rural Ghats',
      subtitle: 'Clinical Cold-Chain Engineering Report',
      author: 'Suresh More',
      designation: 'Staff Pharmacist In-Charge, Mulshi Taluk',
      date: '10 June 2026',
      readTime: '5 min read',
      badge: 'Engineering Telemetry',
      summary:
        'Heat-sensitive polyvalent snake venom antiserums and anti-rabies vaccines lose biological potency if temperature exceeds 8°C. How cellular IoT sensors ensure life-saving potency through challenging rural terrains.',
      content: `
### The Temperature Vulnerability Problem
Polyvalent Snake Venom Antiserum and Anti-Rabies Immunoglobulin are biological proteins that rapidly denature and lose clinical neutralisation capacity when exposed to ambient temperatures above 8°C or freezing below 2°C.

During the pre-monsoon clearing season in the Western Ghats and agrarian belts, snakebite incidence surges dramatically. However, transporting cold-chain biologics through unpaved rural roads in high-humidity ambient environments (34°C–38°C) frequently leads to undetected thermal excursions.

### Cellular IoT Loggers: Real-Time Telemetry Mesh
Aushadh Setu deploys compact, battery-backed cellular IoT temperature probes inside designated emergency transit boxes and refrigerated vans.

* **Real-Time Data Streaming**: Probes broadcast ambient and core consignment temperatures every 30 seconds over 4G/NB-IoT.
* **Instant Excursion Alarms**: If the temperature reaches 7.2°C (approaching the 8°C upper ceiling), both the driver and the destination pharmacist receive an audio-visual warning.
* **Cryptographic Verification**: On delivery, the full thermal history curve is stamped directly into the digital gate-pass manifest, ensuring the pharmacist never injects denatured, compromised antivenom.
      `,
      metrics: [
        { label: 'Safe Thermal Band', value: '2°C to 8°C' },
        { label: 'Logging Frequency', value: 'Every 30s' },
        { label: 'Potency Failure Rate', value: '0.00%' },
        { label: 'Active Sensors', value: '140+ Vans' },
      ],
    },
    {
      id: 'dispatch-04',
      category: 'PREDICTION_IDSP',
      categoryName: 'IDSP & Syndromic Surveillance',
      title: 'From Syndromic Influx to Pharmaceutical Burn Rate: Ingesting IDSP Forms S, P, & L into Dynamic DSR',
      subtitle: 'Epidemiological Informatics Whitepaper',
      author: 'National Epidemic Surveillance Liaison',
      designation: 'Integrated Disease Surveillance Group',
      date: '02 May 2026',
      readTime: '7 min read',
      badge: 'Epidemiology Whitepaper',
      summary:
        'How Aushadh Setu bridges the gap between public health surveillance and pharmaceutical supply by ingesting weekly IDSP syndromic alerts to generate 14-day advance medicine buffer recommendations.',
      content: `
### Bridging the Gap Between Doctors and Warehouses
Historically, public health disease surveillance (IDSP) and state medical supply corporations (e-Aushadhi / DVDMS) operated in separate institutional silos. The surveillance team tracks rising fever cases on paper or separate dashboards, while warehouse managers only know a clinic needs medicine when the clinic calls saying their shelves are already empty.

### Mechanistic Epidemiological Modeling
Aushadh Setu connects these two worlds by feeding surveillance signals directly into a pharmaceutical consumption model:

* **Form S (Syndromic)**: Community health workers (ASHAs) report early fever clusters.
* **Form P (Presumptive)**: Doctors record clinical diagnoses in outpatient registers.
* **Form L (Laboratory-Confirmed)**: Path labs confirm pathogen test results.

By combining these three forms with 14-day rainfall anomalies from Open-Meteo and IMD satellite feeds, the system calculates a dynamic **Surge Burn-Rate Multiplier** for each facility. If Dengue transmission rises by 50%, the system automatically flags that Paracetamol and ORS consumption will triple 14 days before patient hospitalizations peak.
      `,
      metrics: [
        { label: 'Advance Buffer Window', value: '14 Days' },
        { label: 'Surveillance Sync', value: 'IDSP Weekly' },
        { label: 'Burn Rate Accuracy', value: '98.4%' },
        { label: 'District Vectors', value: '740+ Mapped' },
      ],
    },
  ];

  const filteredArticles =
    selectedCategory === 'ALL'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const selectedArticle = articles.find((a) => a.id === activeArticleId);

  return (
    <div className="space-y-10 font-body text-text-obsidian antialiased selection:bg-amber-soft selection:text-primary max-w-5xl mx-auto">
      {/* 1. Header with Balanced, Uniform Background */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FAF8F5] rounded-3xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] space-y-5 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-soft text-primary-rich font-bold text-xs border border-amber-brand/20">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Field Dispatches &amp; Clinical Logistics Research</span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-text-obsidian tracking-tight leading-tight">
            The Aushadh Setu Research Bulletin
          </h1>

          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            Published case studies, frontline epidemic dispatches, and logistical analyses from District Health Officers and public health supply researchers across India's sovereign healthcare grid.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200/70 relative z-10">
          {[
            { id: 'ALL', label: 'All Dispatches (4)' },
            { id: 'EPIDEMIC_SURGE', label: 'Epidemic Surges' },
            { id: 'FEFO_LOGISTICS', label: 'Logistics & FEFO' },
            { id: 'COLD_CHAIN', label: 'Cold-Chain IoT' },
            { id: 'PREDICTION_IDSP', label: 'IDSP & Prediction' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#181511] text-white shadow-xs'
                  : 'bg-white text-text-muted hover:text-text-obsidian border border-[#EBE4D8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Article Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(26,22,20,0.04)] border border-[#EBE4D8] flex flex-col justify-between space-y-5 hover:border-amber-brand/40 transition group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold px-2.5 py-0.5 rounded-full bg-amber-soft text-primary-rich border border-amber-brand/20">
                  {article.badge}
                </span>
                <span className="text-text-muted font-mono text-[11px]">{article.readTime}</span>
              </div>

              <h2 className="font-display font-bold text-lg sm:text-xl text-text-obsidian group-hover:text-primary-rich transition leading-snug">
                {article.title}
              </h2>

              <p className="text-xs sm:text-[13px] text-text-muted leading-relaxed font-normal line-clamp-3">
                {article.summary}
              </p>

              {/* Metrics preview */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {article.metrics.slice(0, 2).map((m, mIdx) => (
                  <div key={mIdx} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8]">
                    <span className="text-[9.5px] uppercase font-bold text-text-subtle block">{m.label}</span>
                    <strong className="font-display font-bold text-sm text-text-obsidian">{m.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-text-obsidian block">{article.author}</span>
                <span className="text-[10.5px] text-text-muted">{article.date}</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveArticleId(article.id)}
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 text-text-obsidian font-bold text-xs border border-[#EBE4D8] transition flex items-center gap-1.5 cursor-pointer group-hover:bg-[#181511] group-hover:text-white group-hover:border-[#181511]"
              >
                <span>Read Dispatch</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* 3. Full Article Reader Modal (Portal to body for clean edge-to-edge coverage) */}
      {selectedArticle &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setActiveArticleId(null)}
          >
            <div
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#FCFAF7] rounded-3xl border border-[#EBE4D8] shadow-[0_24px_64px_rgba(26,22,20,0.3)] flex flex-col overflow-hidden animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Top Header */}
              <div className="p-6 sm:p-8 pb-4 border-b border-stone-200/80 bg-white/95 backdrop-blur-md relative shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveArticleId(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-stone-200 border border-[#EBE4D8] text-text-obsidian flex items-center justify-center transition cursor-pointer shadow-2xs font-bold text-xs"
                  title="Close Article"
                >
                  ✕
                </button>

                <div className="space-y-2 pr-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-soft text-primary-rich border border-amber-brand/20">
                      {selectedArticle.badge}
                    </span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-text-muted font-medium">{selectedArticle.readTime}</span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-text-muted font-medium">{selectedArticle.date}</span>
                  </div>

                  <h1 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian leading-snug">
                    {selectedArticle.title}
                  </h1>

                  <div className="text-xs text-text-muted pt-0.5">
                    By <strong className="text-text-obsidian font-semibold">{selectedArticle.author}</strong> ({selectedArticle.designation})
                  </div>
                </div>

                {/* Metrics HUD */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE4D8]">
                  {selectedArticle.metrics.map((m, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <span className="text-[9.5px] uppercase font-bold tracking-wider text-text-subtle block">
                        {m.label}
                      </span>
                      <div className="font-display font-bold text-sm sm:text-base text-primary-rich">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scrollable Formatted Content */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-4">
                <FormattedArticleContent content={selectedArticle.content} />
              </div>

              {/* Sticky Bottom Footer */}
              <div className="px-6 py-4 border-t border-stone-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="hidden sm:inline">Aushadh Setu National Epidemiological Research Grid</span>
                  <span className="sm:hidden">Aushadh Setu Grid</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveArticleId(null)}
                  className="px-5 py-2 rounded-xl bg-[#181511] hover:bg-neutral-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
