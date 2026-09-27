import React, { useState } from 'react';
import { initialDistrictData } from '../data/mockDistrictData';
import { getBrowserLocation, findNearestDistrict, findNearestFacility } from '../utils/geoUtils';

export default function LocationModal({
  isOpen,
  onClose,
  selectedState,
  onSelectState,
  selectedDistrict,
  onSelectDistrict,
  selectedFacility,
  onSelectFacility,
  onLocationDetected,
}) {
  const [locating, setLocating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const states = initialDistrictData.states;
  const districts = initialDistrictData.districts;
  const facilities = initialDistrictData.facilities;

  const currentDistrictObj = districts.find((d) => d.id === selectedDistrict);
  const currentStateObj = states.find((s) => s.id === selectedState);

  // Quick flagship presets
  const popularPresets = [
    { name: 'Pune, Maharashtra', stateId: 'ST-MH', districtId: 'DIST-MH-PUNE', icon: '🏛️' },
    { name: 'Jaipur, Rajasthan', stateId: 'ST-RJ', districtId: 'DIST-RJ-JAIPUR', icon: '🏰' },
    { name: 'New Delhi (Central)', stateId: 'ST-DL', districtId: 'DIST-DL-CENTRAL', icon: '🏙️' },
    { name: 'Dehradun, Uttarakhand', stateId: 'ST-UK', districtId: 'DIST-UK-DEHRADUN', icon: '🏔️' },
    { name: 'Chennai, Tamil Nadu', stateId: 'ST-TN', districtId: 'DIST-TN-CHENNAI', icon: '🌊' },
  ];

  const handleAutoDetectGPS = async () => {
    setLocating(true);
    setStatusMessage({ type: 'info', text: 'Connecting to device GPS satellite fix...' });

    try {
      const coords = await getBrowserLocation();
      const nearestDist = findNearestDistrict(coords.lat, coords.lng, districts);

      if (nearestDist) {
        if (onSelectDistrict) {
          onSelectDistrict(nearestDist.id);
        } else if (onSelectState && nearestDist.state_id) {
          onSelectState(nearestDist.state_id);
        }

        // Find nearest facility
        const nearestFac = findNearestFacility(coords.lat, coords.lng, facilities);
        if (nearestFac && onSelectFacility) {
          onSelectFacility(nearestFac.id);
        }

        const stateObj = states.find((s) => s.id === nearestDist.state_id);
        setStatusMessage({
          type: 'success',
          text: `📍 GPS Fix Verified: Nearest district is ${nearestDist.name}, ${stateObj?.name} (~${nearestDist.distance_km} km away). Healthcare grid updated!`,
        });

        if (onLocationDetected) {
          onLocationDetected({
            coords,
            district: nearestDist,
            state: stateObj,
            facility: nearestFac,
          });
        }

        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.warn('GPS location error:', err);
      setStatusMessage({
        type: 'error',
        text: 'GPS permission was blocked or unavailable. Please choose your district manually from the list below.',
      });
    } finally {
      setLocating(false);
    }
  };

  const handleSelectPreset = (preset) => {
    if (onSelectDistrict) {
      onSelectDistrict(preset.districtId);
    } else if (onSelectState) {
      onSelectState(preset.stateId);
    }
    const distFacs = facilities.filter((f) => f.district_id === preset.districtId);
    const firstPhc = distFacs.find((f) => f.type === 'PHC') || distFacs[0];
    if (firstPhc && onSelectFacility) onSelectFacility(firstPhc.id);
    onClose();
  };

  const filteredDistricts = districts.filter(
    (d) =>
      d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      states.find((s) => s.id === d.state_id)?.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-[#EBE4D8] shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white hover:bg-stone-100 border border-[#EBE4D8] text-text-subtle hover:text-text-obsidian flex items-center justify-center transition cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-rich bg-amber-soft px-2.5 py-0.5 rounded-full border border-amber-brand/20">
              National Geospatial Triangulation
            </span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-text-obsidian">
            Set Your Health Grid Location
          </h2>
          <p className="text-xs text-text-muted leading-relaxed">
            Personalize local medicine availability, district outbreak alerts, and travel distances down to your exact location.
          </p>
        </div>

        {/* Primary Action: One-Click GPS Auto-Detect */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-soft via-white to-amber-soft/50 border border-amber-brand/30 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#1C1917] text-amber-300 flex items-center justify-center text-lg shadow-sm">
                🛰️
              </div>
              <div>
                <span className="font-display font-bold text-sm text-text-obsidian block">
                  Automatic GPS Satellite Triangulation
                </span>
                <span className="text-[11px] text-text-muted">
                  Instant device coordinates via HTML5 Geolocation API
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleAutoDetectGPS}
            disabled={locating}
            className="w-full py-2.5 rounded-xl bg-[#181511] hover:bg-neutral-800 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[17px] text-amber-brand ${locating ? 'animate-spin' : ''}`}>
              {locating ? 'refresh' : 'my_location'}
            </span>
            <span>{locating ? 'Acquiring Satellite Fix...' : 'Fetch My Exact GPS Location'}</span>
          </button>

          {statusMessage && (
            <div
              className={`p-2.5 rounded-xl text-xs font-medium border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-amber-50 text-primary-rich border-amber-brand/20'
              }`}
            >
              {statusMessage.text}
            </div>
          )}
        </div>

        {/* Flagship State & District Presets */}
        <div className="space-y-2">
          <span className="text-[10.5px] font-bold text-text-subtle uppercase tracking-wider block">
            Popular Pilot District Presets:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {popularPresets.map((preset) => {
              const isSelected = selectedDistrict === preset.districtId;
              return (
                <button
                  key={preset.districtId}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-amber-brand text-white border-amber-brand shadow-xs'
                      : 'bg-white hover:bg-stone-50 border-[#EBE4D8] text-text-obsidian'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 truncate">
                    <span>{preset.icon}</span>
                    <span className="truncate">{preset.name.split(',')[0]}</span>
                  </div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-amber-100' : 'text-text-muted'}`}>
                    {preset.name.split(',')[1]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual 131 Districts Dropdown Filter */}
        <div className="space-y-2 pt-2 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-text-subtle uppercase tracking-wider">
              Or Choose from All 131 Districts:
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              131 LGD Districts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={selectedState}
              onChange={(e) => {
                const sId = e.target.value;
                if (onSelectState) onSelectState(sId);
                const firstD = districts.find((d) => d.state_id === sId);
                if (firstD && onSelectDistrict) onSelectDistrict(firstD.id);
              }}
              className="bg-white p-2.5 rounded-xl border border-[#EBE4D8] text-xs font-semibold text-text-obsidian focus:outline-none cursor-pointer"
            >
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.total_districts} Districts)</option>
              ))}
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => {
                const dId = e.target.value;
                if (onSelectDistrict) onSelectDistrict(dId);
                const targetD = districts.find((d) => d.id === dId);
                if (targetD && targetD.state_id !== selectedState && onSelectState) {
                  onSelectState(targetD.state_id);
                }
              }}
              className="bg-white p-2.5 rounded-xl border border-[#EBE4D8] text-xs font-semibold text-primary-rich focus:outline-none cursor-pointer"
            >
              {districts
                .filter((d) => d.state_id === selectedState)
                .map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
          <div className="text-text-muted text-[11px]">
            Currently active: <strong className="text-text-obsidian">{currentDistrictObj?.name}, {currentStateObj?.name}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#181511] hover:bg-neutral-800 text-white font-bold rounded-xl transition cursor-pointer text-xs"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
