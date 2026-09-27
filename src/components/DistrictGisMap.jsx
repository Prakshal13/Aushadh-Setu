import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon paths in case bundlers mishandle them
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Professional, watermark-free basemap providers (No API Keys required)
const BASEMAP_PROVIDERS = {
  esriStreets: {
    id: 'esriStreets',
    name: 'National Highways & Streets',
    icon: '🛣️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ',
    maxZoom: 19,
  },
  humanitarian: {
    id: 'humanitarian',
    name: 'Health & Humanitarian (OSM)',
    icon: '🏥',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors, Humanitarian OpenStreetMap Team',
    maxZoom: 19,
  },
  esriTopo: {
    id: 'esriTopo',
    name: 'Topographic Relief',
    icon: '⛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; USGS, Intermap, increment P Corp.',
    maxZoom: 19,
  },
};

// Component to dynamically fit all facilities in the active district with smooth animation
function MapBoundsManager({ facilities, district, focusFacilityId }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (focusFacilityId) {
      const target = facilities.find((f) => f.id === focusFacilityId);
      if (target && target.lat && target.lng) {
        map.flyTo([target.lat, target.lng], 13, { duration: 1.2 });
        return;
      }
    }

    const validCoords = facilities.filter((f) => f.lat && f.lng).map((f) => [f.lat, f.lng]);

    if (validCoords.length > 1) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [55, 55], maxZoom: 12, animate: true, duration: 1.2 });
    } else if (validCoords.length === 1) {
      map.flyTo(validCoords[0], 11, { duration: 1.2 });
    } else if (district?.lat && district?.lng) {
      map.flyTo([district.lat, district.lng], 10, { duration: 1.2 });
    }
  }, [facilities, district, focusFacilityId, map]);

  return null;
}

// Generate professional high-contrast healthcare SVG Map Pins
function createFacilityIcon(type, status, isSelected = false) {
  const isWarehouse = type === 'WAREHOUSE';
  const isCritical = status === 'CRITICAL';
  const isWarning = status === 'WARNING';

  let pinColor = '#059669'; // Emerald default (surplus)
  let ringColor = 'border-emerald-500';
  let badgeText = 'Surplus';
  let badgeBg = 'bg-emerald-600 text-white';
  let pulseHtml = '';

  if (isWarehouse) {
    pinColor = '#181511';
    ringColor = 'border-amber-500';
    badgeText = 'Central WH';
    badgeBg = 'bg-stone-900 text-amber-300';
  } else if (isCritical) {
    pinColor = '#E11D48';
    ringColor = 'border-rose-500';
    badgeText = 'Deficit < 3d';
    badgeBg = 'bg-rose-600 text-white';
    pulseHtml = `
      <span class="absolute -inset-2.5 rounded-full bg-rose-500/40 animate-ping pointer-events-none"></span>
      <span class="absolute -inset-1 rounded-full bg-rose-500/30 animate-pulse pointer-events-none"></span>
    `;
  } else if (isWarning) {
    pinColor = '#D97706';
    ringColor = 'border-amber-500';
    badgeText = 'Limited';
    badgeBg = 'bg-amber-600 text-white';
  }

  const selectedClass = isSelected
    ? 'scale-125 z-50 filter drop-shadow-[0_8px_16px_rgba(217,119,6,0.4)] ring-4 ring-amber-500 ring-offset-2'
    : 'filter drop-shadow-[0_3px_8px_rgba(0,0,0,0.25)] hover:scale-110';

  const html = `
    <div class="relative flex flex-col items-center justify-center cursor-pointer transition-transform ${selectedClass}">
      ${pulseHtml}
      
      <!-- Facility Marker Body -->
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 ${ringColor} shadow-md relative z-10" style="background-color: ${pinColor}">
        ${isWarehouse ? '🏛️' : '<span style="font-size: 14px; line-height: 1;">✚</span>'}
      </div>

      <!-- Marker Pointer Tail -->
      <div class="w-2.5 h-2.5 rotate-45 -mt-1 shadow-xs border-r border-b ${ringColor} relative z-0" style="background-color: ${pinColor}"></div>

      <!-- Floating Micro Tag -->
      <div class="absolute -top-5 whitespace-nowrap px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-tight shadow-sm ${badgeBg} border border-white/40">
        ${badgeText}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-gis-facility-marker',
    iconSize: [36, 42],
    iconAnchor: [18, 38],
    popupAnchor: [0, -40],
  });
}

// Generate animated Transit Vehicle (Cold-Chain Van) Icon
function createVehicleIcon(progressPercent, vehicleReg = 'MH-12-RN-8842', isDelivered = false) {
  if (isDelivered) {
    const html = `
      <div class="relative flex flex-col items-center justify-center filter drop-shadow-[0_4px_12px_rgba(5,150,105,0.4)]">
        <div class="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-sm shadow-md">
          ✓
        </div>
        <div class="absolute -top-6 whitespace-nowrap bg-emerald-800 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-400">
          DELIVERED
        </div>
      </div>
    `;
    return L.divIcon({
      html,
      className: 'custom-transit-vehicle-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -22],
    });
  }

  const html = `
    <div class="relative flex flex-col items-center justify-center filter drop-shadow-[0_8px_20px_rgba(5,150,105,0.5)]">
      <!-- Radar Pulse Ring -->
      <span class="absolute -inset-3 rounded-full bg-emerald-500/40 animate-ping pointer-events-none"></span>
      <span class="absolute -inset-1.5 rounded-full bg-emerald-400/30 animate-pulse pointer-events-none"></span>
      
      <!-- Vehicle Cabin Badge -->
      <div class="w-10 h-10 rounded-2xl bg-[#181511] border-2 border-emerald-400 flex items-center justify-center text-white text-base shadow-xl relative z-10 transition-transform hover:scale-110">
        🚚
      </div>

      <!-- Live GPS Telemetry Tag -->
      <div class="absolute -top-6.5 whitespace-nowrap bg-emerald-800/95 backdrop-blur-sm text-white font-mono text-[9.5px] font-bold px-2.5 py-0.5 rounded-full shadow-md border border-emerald-400/60 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
        <span>${vehicleReg.split('-')[0]}-${vehicleReg.split('-')[1]} • ${Math.round(progressPercent)}%</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-transit-vehicle-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -26],
  });
}

export default function DistrictGisMap({
  district,
  facilities = [],
  selectedFacilityId,
  onSelectFacility,
  activeSurgePercent = 40,
  activeFieldCases = 56,
  approvedTransfers = {},
  transfers = [],
  onApproveTransfer,
  onReceiveTransfer,
  mode = 'dho', // 'dho' | 'pharmacist'
  height = '480px',
}) {
  const [activeBasemap, setActiveBasemap] = useState('esriStreets');
  const [transitProgress, setTransitProgress] = useState(0.42);
  const [vehicleFollowMode, setVehicleFollowMode] = useState(false);
  const [focusId, setFocusId] = useState(null);

  const centerLat = district?.lat || 18.5204;
  const centerLng = district?.lng || 73.8567;

  // Active transfer linking donor (Warehouse) to recipient (Critical PHC)
  const activeTransfer = useMemo(() => {
    if (transfers && transfers.length > 0) {
      // Prioritize in-transit approved transfer, else recommended
      const inTransit = transfers.find((t) => t.status === 'APPROVED_BY_DHO');
      if (inTransit) return inTransit;
      const recommended = transfers.find((t) => t.status === 'RECOMMENDED');
      if (recommended) return recommended;
      return transfers[0];
    }
    return null;
  }, [transfers]);

  const isCorridorApproved =
    activeTransfer?.status === 'APPROVED_BY_DHO' ||
    approvedTransfers[activeTransfer?.id] ||
    approvedTransfers['TR-01'];

  const isCorridorRestocked =
    activeTransfer?.status === 'RECEIVED_AND_RESTOCKED';

  // Find donor and recipient facilities with fallbacks to guarantee valid coordinates in any district
  const warehouse = useMemo(() => {
    return (
      facilities.find((f) => f.id === activeTransfer?.donor_id) ||
      facilities.find((f) => f.type === 'WAREHOUSE') ||
      facilities[0]
    );
  }, [facilities, activeTransfer]);

  const criticalPhc = useMemo(() => {
    return (
      facilities.find((f) => f.id === activeTransfer?.recipient_id) ||
      facilities.find((f) => f.id === selectedFacilityId) ||
      facilities.find((f) => f.type === 'PHC' && f.id !== warehouse?.id) ||
      facilities[1] ||
      facilities[0]
    );
  }, [facilities, activeTransfer, selectedFacilityId, warehouse]);

  const corridorCoords = useMemo(() => {
    if (warehouse?.lat && criticalPhc?.lat) {
      return [
        [warehouse.lat, warehouse.lng],
        [criticalPhc.lat, criticalPhc.lng],
      ];
    }
    return null;
  }, [warehouse, criticalPhc]);

  // Smooth transit animation simulation along corridor when approved
  useEffect(() => {
    if (!isCorridorApproved || isCorridorRestocked) return;

    const interval = setInterval(() => {
      setTransitProgress((prev) => {
        if (prev >= 0.96) return 0.08; // smoothly loop along corridor to reflect live transit
        return Number((prev + 0.012).toFixed(3));
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isCorridorApproved, isCorridorRestocked]);

  // Calculate live intermediate vehicle position along the trajectory
  const vehiclePosition = useMemo(() => {
    if (!corridorCoords || corridorCoords.length < 2) return null;
    if (isCorridorRestocked) {
      // Parked at recipient facility
      return corridorCoords[1];
    }
    const [start, end] = corridorCoords;
    const lat = start[0] + transitProgress * (end[0] - start[0]);
    const lng = start[1] + transitProgress * (end[1] - start[1]);
    return [lat, lng];
  }, [corridorCoords, transitProgress, isCorridorRestocked]);

  // Derived telemetry metrics
  const totalDistanceKm = activeTransfer?.distance_km || 24;
  const remainingDistanceKm = isCorridorRestocked
    ? 0
    : Math.max(1, Math.round(totalDistanceKm * (1 - transitProgress)));
  const estimatedArrivalMins = isCorridorRestocked
    ? 0
    : Math.max(2, Math.round((activeTransfer?.transit_time_mins || 42) * (1 - transitProgress)));
  const currentSpeedKmH = isCorridorRestocked ? 0 : 44;

  const currentBasemap = BASEMAP_PROVIDERS[activeBasemap] || BASEMAP_PROVIDERS.esriStreets;

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-[#EBE4D8] shadow-sm bg-[#FAF8F5] select-none"
      style={{ height }}
    >
      {/* Top Left: Government GIS HUD & Outbreak Surveillance Telemetry */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl border border-[#EBE4D8] shadow-md max-w-xs space-y-2 pointer-events-auto">
        <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <div>
              <div className="font-display font-bold text-xs text-text-obsidian leading-none">
                {district?.name || 'District'} Health Telemetry
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">NIC / DISHA Spatial Standards</div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
            +{activeSurgePercent}% Influx
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[10.5px] text-text-muted pt-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            <span>Critical (&lt; 3.5d)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Limited Buffer</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Adequate Stock</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-900"></span>
            <span>Central Depot</span>
          </span>
        </div>
      </div>

      {/* Top Right: Basemap Layer Switcher & Camera Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 pointer-events-auto">
        {/* Layer Switcher Dropdown / Pill */}
        <div className="bg-white/95 backdrop-blur-xl p-1 rounded-2xl border border-[#EBE4D8] shadow-md flex items-center gap-1">
          {Object.values(BASEMAP_PROVIDERS).map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveBasemap(layer.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                activeBasemap === layer.id
                  ? 'bg-[#181511] text-white shadow-xs'
                  : 'text-text-muted hover:text-text-obsidian hover:bg-stone-100'
              }`}
              title={layer.name}
            >
              <span>{layer.icon}</span>
              <span className="hidden sm:inline text-[11px]">{layer.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Reset Camera Button */}
        <button
          onClick={() => {
            setFocusId(null);
            // Trigger temporary toggle to re-center
            setFocusId(facilities[0]?.id || null);
            setTimeout(() => setFocusId(null), 100);
          }}
          className="w-8 h-8 rounded-2xl bg-white/95 backdrop-blur-xl hover:bg-white text-text-obsidian border border-[#EBE4D8] shadow-md flex items-center justify-center transition cursor-pointer"
          title="Fit All Facilities in View"
        >
          <span className="material-symbols-outlined text-[17px] text-amber-brand">fit_screen</span>
        </button>
      </div>

      {/* Bottom Center / Left: Live Vehicle Transit HUD Radar Card */}
      {corridorCoords && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-[1000] bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl border border-amber-brand/35 shadow-lg max-w-lg pointer-events-auto space-y-2.5">
          <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-soft text-primary-rich flex items-center justify-center font-bold text-xs border border-amber-brand/20">
                🚚
              </div>
              <div>
                <div className="font-bold text-xs text-text-obsidian flex items-center gap-1.5">
                  <span>{activeTransfer?.medicine || 'Ringer Lactate (RL) 500ml IV'}</span>
                  <span className="text-[10px] text-text-muted font-normal">({activeTransfer?.recommended_transfer || '350 units'})</span>
                </div>
                <div className="text-[10.5px] text-text-muted">
                  {warehouse?.name?.split('(')[0] || 'Central Warehouse'} ➔ {criticalPhc?.name || 'Primary Health Centre'}
                </div>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                isCorridorRestocked
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : isCorridorApproved
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}
            >
              {isCorridorRestocked
                ? '✓ RESTOCKED & SECURED'
                : isCorridorApproved
                ? 'IN TRANSIT (LIVE GPS)'
                : 'DISPATCH RECOMMENDED'}
            </span>
          </div>

          {/* Real-Time Telemetry Bar if Approved or in Transit */}
          {isCorridorApproved && !isCorridorRestocked && (
            <div className="space-y-1.5 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EBE4D8]">
              <div className="flex items-center justify-between text-[11px] font-medium text-text-obsidian">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span className="font-mono font-bold">MH-12-RN-8842</span>
                  <span className="text-text-subtle text-[10px]">• Cold-Chain Van</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700">3.8°C</span>
                  <span className="text-[10px] text-text-muted"> (Verified Safe)</span>
                </div>
              </div>

              {/* Transit Progress Bar */}
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-brand transition-all duration-300 rounded-full"
                  style={{ width: `${Math.round(transitProgress * 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-text-muted">
                <span>Distance to PHC: <strong>~{remainingDistanceKm} km</strong></span>
                <span>Speed: <strong>{currentSpeedKmH} km/h</strong></span>
                <span>ETA: <strong className="text-primary-rich">~{estimatedArrivalMins} mins</strong></span>
              </div>
            </div>
          )}

          {/* Action Trigger Buttons based on Clearance Role */}
          <div className="pt-0.5">
            {!isCorridorApproved && onApproveTransfer && (
              <button
                onClick={() => onApproveTransfer(activeTransfer?.id || 'TR-01')}
                className="w-full py-2 bg-[#181511] hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-brand">verified</span>
                <span>Authorize Emergency Redistribution ({activeTransfer?.recommended_transfer || '350 Units'})</span>
              </button>
            )}

            {isCorridorApproved && !isCorridorRestocked && onReceiveTransfer && (
              <button
                onClick={() => onReceiveTransfer(activeTransfer?.id || 'TR-01')}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-200">inventory_2</span>
                <span>Verify Physical Delivery &amp; Restock Shelf</span>
              </button>
            )}

            {isCorridorRestocked && (
              <div className="py-1 px-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1.5 border border-emerald-200">
                <span className="material-symbols-outlined text-[15px]">task_alt</span>
                <span>Consignment checked into clinic cold-chain. 0 Units Out of Stock.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={11}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ background: '#FAF8F5' }}
      >
        <MapBoundsManager
          facilities={facilities}
          district={district}
          focusFacilityId={focusId}
        />

        {/* Clean, Watermark-Free Production Basemap TileLayer */}
        <TileLayer
          key={currentBasemap.id}
          url={currentBasemap.url}
          attribution={currentBasemap.attribution}
          maxZoom={currentBasemap.maxZoom}
        />

        {/* Animated Redistribution Corridor Route Polyline */}
        {corridorCoords && (
          <Polyline
            positions={corridorCoords}
            pathOptions={{
              color: isCorridorRestocked ? '#059669' : isCorridorApproved ? '#059669' : '#D97706',
              weight: isCorridorApproved ? 5 : 4,
              dashArray: isCorridorRestocked ? undefined : isCorridorApproved ? '8, 8' : '10, 8',
              opacity: isCorridorApproved ? 0.95 : 0.75,
            }}
          />
        )}

        {/* Live GPS Transit Vehicle Marker (Moving along the Corridor) */}
        {isCorridorApproved && vehiclePosition && (
          <Marker
            position={vehiclePosition}
            icon={createVehicleIcon(transitProgress * 100, 'MH-12-RN-8842', isCorridorRestocked)}
          >
            <Popup>
              <div className="p-1 space-y-1.5 min-w-[210px] text-xs">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1">
                  <strong className="text-text-obsidian flex items-center gap-1">
                    <span>🚚</span>
                    <span>Refrigerated Medical Van</span>
                  </strong>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    MH-12-RN-8842
                  </span>
                </div>
                <div className="space-y-0.5 text-[11px] text-text-muted">
                  <div>Driver: <strong className="text-text-obsidian">Ramesh Patil</strong> (Cold-Chain Certified)</div>
                  <div>Cargo: <strong className="text-primary-rich">{activeTransfer?.medicine}</strong></div>
                  <div>Live Temperature: <strong className="text-emerald-700">3.8°C (Normal)</strong></div>
                  <div>Speed: <strong>{currentSpeedKmH} km/h</strong></div>
                  <div>Remaining: <strong>~{remainingDistanceKm} km (~{estimatedArrivalMins} mins)</strong></div>
                </div>
                {onReceiveTransfer && !isCorridorRestocked && (
                  <button
                    onClick={() => onReceiveTransfer(activeTransfer?.id || 'TR-01')}
                    className="w-full mt-1.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded transition cursor-pointer"
                  >
                    Confirm Delivery at Dispensary
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Real Facilities & PHCs plotted with accurate coordinates */}
        {facilities.map((fac) => {
          if (!fac.lat || !fac.lng) return null;

          const isWarehouse = fac.type === 'WAREHOUSE';
          const isCritical =
            !isCorridorRestocked &&
            (fac.id === criticalPhc?.id || fac.id === 'PHC-01' || fac.id === 'PHC-TN-01');
          const status = isWarehouse ? 'SURPLUS' : isCritical ? 'CRITICAL' : 'WARNING';
          const isSelected = fac.id === selectedFacilityId;

          return (
            <Marker
              key={fac.id}
              position={[fac.lat, fac.lng]}
              icon={createFacilityIcon(fac.type, status, isSelected)}
              eventHandlers={{
                click: () => {
                  if (onSelectFacility) onSelectFacility(fac.id);
                  setFocusId(fac.id);
                },
              }}
            >
              <Popup>
                <div className="p-1 space-y-1.5 min-w-[210px] text-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-1">
                    <span className="font-bold text-text-obsidian">{fac.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-text-subtle">
                      {fac.type}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-[11px] text-text-muted">
                    <div>Taluk / Block: <strong className="text-text-obsidian">{fac.taluk}</strong></div>
                    <div>Doctor / MO: <strong>{fac.doctor || 'Medical Officer In-Charge'}</strong></div>
                    <div>Emergency Phone: <strong>{fac.contact || '+91 20 2292 2011'}</strong></div>
                    <div>Timing: {fac.timing || '09:00 AM – 02:00 PM (24x7 Emergency)'}</div>
                    
                    {isCritical ? (
                      <div className="text-rose-700 font-bold pt-1 flex items-center gap-1">
                        <span>⚠️ Stockout Warning:</span>
                        <span>RL IV Infusion &lt; 24h</span>
                      </div>
                    ) : isWarehouse ? (
                      <div className="text-emerald-700 font-bold pt-1">
                        ✓ Central Depot Buffer: Surplus Batches
                      </div>
                    ) : (
                      <div className="text-emerald-700 font-medium pt-1">
                        ● Stock Status: Safe Runway
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectFacility) onSelectFacility(fac.id);
                      setFocusId(fac.id);
                    }}
                    className="w-full mt-1.5 py-1 bg-stone-100 hover:bg-amber-soft text-text-obsidian text-[11px] font-bold rounded transition cursor-pointer"
                  >
                    Focus Facility in Health Grid
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
