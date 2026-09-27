import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { initialDistrictData } from '../data/mockDistrictData';
import { calculateDistance, getBrowserLocation, findNearestDistrict, findNearestFacility } from '../utils/geoUtils';

// Local search builder if API is offline
function searchLocalMedicines(query, userCoords = null, districtId = null, facilityFilter = 'ALL', transfers = []) {
  const q = (query || '').toLowerCase().trim();
  const matchedMeds = q
    ? initialDistrictData.medicines.filter(
        (m) =>
          m.generic_name.toLowerCase().includes(q) ||
          m.brand_name.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.diseases_linked.some((d) => d.toLowerCase().includes(q))
      )
    : initialDistrictData.medicines;

  return matchedMeds.map((med) => {
    let facilitiesList = initialDistrictData.facilities.filter((f) => f.type === 'PHC' || f.type === 'CHC');
    if (districtId) {
      facilitiesList = facilitiesList.filter((f) => f.district_id === districtId);
    }
    if (facilityFilter && facilityFilter !== 'ALL') {
      facilitiesList = facilitiesList.filter((f) => f.type === facilityFilter || f.id === facilityFilter);
    }

    const facilities = facilitiesList
      .map((fac) => {
        const facBatches = initialDistrictData.batches.filter(
          (b) => b.facility_id === fac.id && b.medicine_id === med.id
        );
        let totalStock = facBatches.reduce((sum, b) => sum + b.quantity, 0);

        // Account for completed P2P emergency restocks
        const incomingRestocked = transfers.filter(
          (t) => t.recipient_id === fac.id && t.medicine_id === med.id && t.status === 'RECEIVED_AND_RESTOCKED'
        );
        const restockedQty = incomingRestocked.reduce((sum, t) => sum + (t.quantity || 0), 0);
        totalStock += restockedQty;

        const inTransitTransfer = transfers.find(
          (t) => t.recipient_id === fac.id && t.medicine_id === med.id && t.status === 'APPROVED_BY_DHO'
        );

        let availabilityStatus = 'OUT_OF_STOCK';
        let badgeColor = 'red';

        if (totalStock >= med.standard_daily_baseline * 3) {
          availabilityStatus = 'AVAILABLE';
          badgeColor = 'green';
        } else if (totalStock > 0) {
          availabilityStatus = 'LIMITED_STOCK';
          badgeColor = 'amber';
        }

        // Real GPS distance if available, otherwise warehouse distance
        const distance = userCoords && fac.lat && fac.lng
          ? calculateDistance(userCoords.lat, userCoords.lng, fac.lat, fac.lng)
          : fac.distance_from_wh_km || 4.2;

        return {
          facility_id: fac.id,
          facility_name: fac.name,
          type: fac.type,
          taluk: fac.taluk,
          contact: fac.contact || '+91 20 2292 2011',
          timing: fac.timing || '09:00 AM – 02:00 PM (24x7 Emergency)',
          doctor: fac.doctor || 'Medical Officer In-Charge',
          distance_km: distance,
          stock_status: availabilityStatus,
          badge_color: badgeColor,
          total_stock_units: totalStock,
          in_transit: inTransitTransfer,
          lat: fac.lat,
          lng: fac.lng,
        };
      })
      .sort((a, b) => a.distance_km - b.distance_km);

    return {
      medicine_id: med.id,
      medicine_name: med.generic_name,
      category: med.category,
      unit: med.unit,
      nlem_class: med.nlem_class || 'NLEM Essential',
      diseases_linked: med.diseases_linked,
      facilities,
    };
  });
}

export default function CitizenFinder({
  selectedState = 'ST-MH',
  setSelectedState,
  selectedDistrict = 'DIST-MH-PUNE',
  setSelectedDistrict,
  selectedFacility = 'ALL',
  setSelectedFacility,
  onOpenLocationModal,
  transfers = [],
}) {
  const [searchQuery, setSearchQuery] = useState('Paracetamol');
  const [userCoords, setUserCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [clinicTypeFilter, setClinicTypeFilter] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchResults, setSearchResults] = useState(() => searchLocalMedicines('Paracetamol', null, selectedDistrict, 'ALL', transfers));
  const [activeRouteModal, setActiveRouteModal] = useState(null);

  const categories = [
    { label: 'All Formulations (184)', query: '', key: 'All' },
    { label: 'Fever & Outbreak', query: 'Paracetamol', key: 'Fever' },
    { label: 'Diarrhoea & ORS', query: 'Oral Rehydration', key: 'ORS' },
    { label: 'Diabetes & BP', query: 'Metformin', key: 'Chronic' },
    { label: 'Anti-Snake Venom (ASV)', query: 'Anti-Snake Venom', key: 'Snakebite' },
    { label: 'Rabies Vaccine', query: 'Rabies', key: 'Rabies' },
    { label: 'Maternal Health', query: 'Iron Folic', key: 'Maternal' },
  ];

  const detectLocation = async () => {
    setLocating(true);
    try {
      const coords = await getBrowserLocation();
      setUserCoords(coords);
      const nearestDist = findNearestDistrict(coords.lat, coords.lng, initialDistrictData.districts);
      if (nearestDist) {
        if (setSelectedDistrict) setSelectedDistrict(nearestDist.id);
        const nearestFac = findNearestFacility(coords.lat, coords.lng, initialDistrictData.facilities);
        if (nearestFac && setSelectedFacility) setSelectedFacility(nearestFac.id);
        setSearchResults(searchLocalMedicines(searchQuery, coords, nearestDist.id, clinicTypeFilter, transfers));
      } else {
        setSearchResults(searchLocalMedicines(searchQuery, coords, selectedDistrict, clinicTypeFilter, transfers));
      }
    } catch (err) {
      console.warn('Geolocation fallback failed:', err);
    } finally {
      setTimeout(() => setLocating(false), 500);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.key);
    setSearchQuery(cat.query);
  };

  useEffect(() => {
    setSearchResults(searchLocalMedicines(searchQuery, userCoords, selectedDistrict, clinicTypeFilter, transfers));
  }, [searchQuery, userCoords, selectedDistrict, clinicTypeFilter, transfers]);

  const activeDistrictObj = initialDistrictData.districts.find((d) => d.id === selectedDistrict);
  const activeStateObj = initialDistrictData.states.find((s) => s.id === (activeDistrictObj?.state_id || selectedState));
  const displayLocation = userCoords
    ? `${activeDistrictObj?.name || 'District'}, ${activeStateObj?.name || ''} (📍 GPS Fixed)`
    : `${activeDistrictObj?.name || 'District'}, ${activeStateObj?.name || ''}`;

  return (
    <div className="pb-20 font-body text-text-obsidian antialiased selection:bg-amber-soft selection:text-primary relative">
      {/* Background glow & subtle pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40 h-[1000px] z-0"></div>
      <div
        className="absolute top-0 inset-x-0 h-[600px] pointer-events-none z-0 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at top center, rgba(253, 242, 226, 0.8) 0%, rgba(250, 248, 245, 0.4) 60%, transparent 100%)',
        }}
      ></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 pt-6 space-y-8">
        {/* Section 1: Hero */}
        <section className="text-center pt-4 pb-2 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 text-text-obsidian text-xs font-semibold shadow-xs border border-[#EBE4D8]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Public Inventory
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 text-text-muted text-xs font-medium shadow-xs border border-[#EBE4D8]">
              <span className="material-symbols-outlined text-[16px] text-amber-brand">verified</span>
              100% Free Government Stock
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-5xl text-text-obsidian tracking-tight max-w-3xl mb-3">
            Check Free Government Medicine Stock <span className="editorial-serif font-normal text-amber-brand">Before</span> Leaving Home
          </h1>
          <p className="font-body text-base text-text-muted max-w-2xl font-normal leading-relaxed">
            Real-time verified stock at your local Primary Health Centres & Community Hospitals. Zero out-of-pocket expenses, updated directly from e-registers.
          </p>
        </section>

        {/* Section 2: Floating Command Search & Geolocation Deck */}
        <section className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgba(26,22,20,0.06)] border border-[#EBE4D8] p-5 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#FAF8F5] rounded-2xl p-2 border border-[#EBE4D8] focus-within:border-amber-brand focus-within:bg-white transition-all shadow-inner">
            <div className="relative flex-1 w-full flex items-center pl-3">
              <span className="material-symbols-outlined text-text-muted text-[22px] shrink-0">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicine (e.g. Paracetamol, Insulin, ORS, Snake Venom)..."
                className="w-full pl-3 pr-4 py-2.5 bg-transparent font-body text-sm sm:text-base text-text-obsidian placeholder:text-text-subtle focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-text-subtle hover:text-text-obsidian mr-2 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={detectLocation}
                disabled={locating}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-text-obsidian border border-[#EBE4D8] flex items-center justify-center gap-2 shadow-xs text-xs font-bold shrink-0 transition-all cursor-pointer"
                title="Triangulate exact GPS location"
              >
                <span className={`material-symbols-outlined text-[18px] text-amber-brand ${locating ? 'animate-spin' : ''}`}>
                  my_location
                </span>
                <span>{locating ? 'Triangulating GPS...' : 'Auto-Detect (GPS)'}</span>
              </button>

              {onOpenLocationModal && (
                <button
                  type="button"
                  onClick={onOpenLocationModal}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-amber-soft/80 text-text-obsidian border border-[#EBE4D8] hover:border-amber-brand/40 flex items-center justify-center gap-1.5 shadow-2xs text-xs font-semibold shrink-0 transition-all cursor-pointer"
                  title="Browse all 131 districts across 5 pilot states"
                >
                  <span className="material-symbols-outlined text-[17px] text-amber-brand">map</span>
                  <span className="hidden sm:inline">131 Districts</span>
                </button>
              )}
            </div>
          </div>

          {/* Location & Cascade Jurisdiction Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-text-muted">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
              <span>
                Location: <strong className="text-text-obsidian font-semibold">{displayLocation}</strong>
              </span>
              <span className="text-stone-300">•</span>
              <button
                onClick={detectLocation}
                className="text-amber-brand hover:underline font-semibold cursor-pointer"
              >
                Refresh GPS
              </button>
              {onOpenLocationModal && (
                <>
                  <span className="text-stone-300">•</span>
                  <button
                    onClick={onOpenLocationModal}
                    className="text-primary-rich hover:underline font-semibold cursor-pointer"
                  >
                    Select District (131)
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] uppercase font-bold tracking-wider text-text-subtle mr-1">Jurisdiction:</span>
              
              {/* State Filter */}
              <div className="relative inline-block">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState && setSelectedState(e.target.value)}
                  className="bg-white hover:bg-stone-50 py-1.5 pl-3 pr-7 rounded-full text-xs font-semibold text-text-obsidian border border-[#EBE4D8] appearance-none cursor-pointer focus:outline-none shadow-2xs"
                >
                  {initialDistrictData.states.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-[16px]">
                  expand_more
                </span>
              </div>

              {/* District Filter */}
              <div className="relative inline-block">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict && setSelectedDistrict(e.target.value)}
                  className="bg-white hover:bg-stone-50 py-1.5 pl-3 pr-7 rounded-full text-xs font-semibold text-text-obsidian border border-[#EBE4D8] appearance-none cursor-pointer focus:outline-none shadow-2xs"
                >
                  {initialDistrictData.districts
                    .filter((d) => d.state_id === selectedState)
                    .map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-[16px]">
                  expand_more
                </span>
              </div>

              {/* Clinic Type */}
              <div className="relative inline-block">
                <select
                  value={clinicTypeFilter}
                  onChange={(e) => setClinicTypeFilter(e.target.value)}
                  className="bg-white hover:bg-stone-50 py-1.5 pl-3 pr-7 rounded-full text-xs font-semibold text-text-obsidian border border-[#EBE4D8] appearance-none cursor-pointer focus:outline-none shadow-2xs"
                >
                  <option value="ALL">All Clinics</option>
                  <option value="PHC">Primary Health Centres</option>
                  <option value="CHC">Community Hospitals (CHC)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-[16px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Quick Category Filter Pills */}
        <section>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#181511] text-white shadow-sm font-semibold'
                      : 'bg-white hover:bg-stone-100 text-text-muted hover:text-text-obsidian border border-[#EBE4D8]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 4: Emergency Priority Lifesaving Callout */}
        <section className="rounded-3xl bg-white p-5 shadow-xs border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">emergency</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Emergency Triage
                </span>
                <span className="text-stone-300">•</span>
                <span className="font-display font-bold text-sm text-text-obsidian">
                  Anti-Snake Venom (ASV) & Rabies (ARV)
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                3 regional cold-chain emergency depots stocked 24/7. Call command dispatch for immediate hospital reservation.
              </p>
            </div>
          </div>
          <a
            href="tel:104"
            className="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold text-center transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>Call 104 Emergency</span>
          </a>
        </section>

        {/* Section 5: Live Medicine Availability Results Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="font-display font-bold text-lg text-text-obsidian">
                Verified Facilities in {activeDistrictObj?.name || 'Pune Rural'}
              </h2>
              <span className="text-xs text-text-muted">• 100% Free Dispensing</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <span>Sorted by:</span>
              <span className="text-text-obsidian font-semibold">Proximity (GPS Distance)</span>
            </div>
          </div>

          <div className="space-y-4">
            {searchResults.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#EBE4D8] space-y-2">
                <span className="material-symbols-outlined text-4xl text-amber-brand">search_off</span>
                <h3 className="font-display font-bold text-lg text-text-obsidian">No medicines matched "{searchQuery}"</h3>
                <p className="text-xs text-text-muted">Try searching generic names like Paracetamol, ORS, Metformin, or Anti-Snake Venom.</p>
              </div>
            ) : (
              searchResults.map((medResult) => (
                <div key={medResult.medicine_id} className="space-y-3">
                  {medResult.facilities.slice(0, 4).map((fac, idx) => {
                    const isAvailable = fac.stock_status === 'AVAILABLE';
                    const isLimited = fac.stock_status === 'LIMITED_STOCK';
                    const isOut = fac.stock_status === 'OUT_OF_STOCK';

                    return (
                      <article
                        key={fac.facility_id + idx}
                        className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(26,22,20,0.04)] border border-[#EBE4D8] hover:border-amber-brand/40 transition-all space-y-4"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display font-bold text-base sm:text-lg text-text-obsidian">
                                {fac.facility_name}
                              </h3>
                              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-text-muted font-medium text-xs border border-[#EBE4D8]">
                                {fac.distance_km} km away
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-text-subtle text-xs">
                                Taluk: {fac.taluk}
                              </span>
                            </div>

                            <p className="text-sm font-semibold text-primary-rich">
                              {medResult.medicine_name}
                              <span className="text-text-muted font-normal text-xs ml-2">
                                ({medResult.nlem_class || medResult.category})
                              </span>
                            </p>
                          </div>

                          {/* Stock Status Badge */}
                          <div className="shrink-0 flex flex-col items-start lg:items-end">
                            {isAvailable && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                {fac.total_stock_units} Units in Stock
                              </span>
                            )}
                            {isLimited && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                Limited: {fac.total_stock_units} Units Left
                              </span>
                            )}
                            {isOut && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                                Out of Stock
                              </span>
                            )}
                            {fac.in_transit && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full bg-blue-50 text-blue-800 text-[10.5px] font-bold border border-blue-200">
                                <span className="material-symbols-outlined text-[13px] animate-spin">sync</span>
                                <span>Emergency Restock in Transit (~{fac.in_transit.transit_time_mins}m ETA)</span>
                              </span>
                            )}
                            <span className="text-[11px] text-text-subtle mt-1">Verified via E-Aushadhi</span>
                          </div>
                        </div>

                        {/* Out of Stock Diversion Recommendation */}
                        {isOut && (
                          <div className="p-3.5 rounded-2xl bg-amber-soft/60 border border-amber-brand/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-amber-brand/10 text-primary-rich flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[18px]">alt_route</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-primary-rich block">
                                  Automatic Stock Diversion
                                </span>
                                <p className="text-xs text-text-obsidian">
                                  Nearest stocked clinic: <strong className="font-bold">Paud PHC</strong> (4.2 km away • 240 units available)
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                alert('Navigating to Paud PHC route');
                              }}
                              className="shrink-0 px-3.5 py-1.5 rounded-full bg-[#181511] text-white text-xs font-medium hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
                            >
                              Route to Paud PHC →
                            </button>
                          </div>
                        )}

                        {/* Facility Timings & Contact Info */}
                        <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-text-muted">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-text-subtle">schedule</span>
                            <span>{fac.timing}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-text-subtle">badge</span>
                            <span>{fac.doctor}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-text-subtle">call</span>
                            <span>{fac.contact}</span>
                          </div>
                        </div>

                        {/* Card Action Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                          <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Govt Counter • 100% Free
                          </span>
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${fac.contact}`}
                              className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-stone-100 text-text-obsidian text-xs font-semibold border border-[#EBE4D8] flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">call</span>
                              Call Clinic
                            </a>
                            <button
                              onClick={() => {
                                const url = `https://www.google.com/maps/dir/?api=1&destination=${fac.lat || 18.52},${fac.lng || 73.85}`;
                                window.open(url, '_blank');
                              }}
                              className="px-4 py-2 rounded-full bg-[#181511] hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">directions</span>
                              Directions
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 6: Guaranteed Healthcare Protections */}
        <section className="pt-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[11px] uppercase tracking-wider text-primary-rich font-bold block mb-1">
              Citizen Rights Charter
            </span>
            <h2 className="font-display font-bold text-2xl text-text-obsidian">
              Guaranteed Healthcare Protections
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Legally protected citizen rights regarding essential medicine distribution at all public facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#EBE4D8] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-soft flex items-center justify-center text-primary-rich border border-amber-brand/20">
                  <span className="material-symbols-outlined text-[20px]">currency_rupee_circle</span>
                </div>
                <h3 className="font-display font-bold text-base text-text-obsidian">Zero Out-of-Pocket</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  All essential medicines at PHCs, CHCs, and District Hospitals are 100% free under NHM mandate. You must never be charged.
                </p>
              </div>
              <span className="text-[10px] text-primary-rich font-bold uppercase tracking-wider pt-4 mt-2">
                NHM Section 12
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#EBE4D8] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-soft flex items-center justify-center text-primary-rich border border-amber-brand/20">
                  <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                </div>
                <h3 className="font-display font-bold text-base text-text-obsidian">QR Batch Verification</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Scan your medicine box with any smartphone camera to verify purity lab test reports and cold-chain temperature telemetry.
                </p>
              </div>
              <span className="text-[10px] text-primary-rich font-bold uppercase tracking-wider pt-4 mt-2">
                C-DAC Verified
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#EBE4D8] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-soft flex items-center justify-center text-primary-rich border border-amber-brand/20">
                  <span className="material-symbols-outlined text-[20px]">campaign</span>
                </div>
                <h3 className="font-display font-bold text-base text-text-obsidian">Instant Redressal</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Turned away despite stock availability? File a 1-click citizen grievance directly alerting the District Health Officer with timestamps.
                </p>
              </div>
              <span className="text-[10px] text-primary-rich font-bold uppercase tracking-wider pt-4 mt-2">
                Direct DHO Audit
              </span>
            </div>
          </div>
        </section>

        {/* Section 7: 24/7 Citizen Emergency Support Banner */}
        <section className="pt-2">
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(26,22,20,0.06)] border border-[#EBE4D8] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="max-w-xl space-y-2">
              <span className="text-[10px] px-3 py-1 rounded-full bg-amber-soft text-primary-rich uppercase tracking-wider font-bold inline-block border border-amber-brand/20">
                24x7 Citizen Safety Support
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian">
                Cannot find what you need or facing a life emergency?
              </h3>
              <p className="text-xs sm:text-sm text-text-muted">
                Our national dispatch command operators coordinate immediate emergency medicine delivery or direct you to the nearest operating casualty ward.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href="tel:108"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-700 transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">ambulance</span>
                <span>Ambulance: 108</span>
              </a>
              <a
                href="tel:104"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#181511] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                <span>Health Helpline: 104</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
