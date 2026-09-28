import React, { useEffect, useMemo, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getBrowserLocation } from '../utils/geoUtils';

// Fix default Leaflet icon paths in case bundlers mishandle them
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// High-resolution Google Maps and Satellite basemap providers (Live Production CDN)
const BASEMAP_PROVIDERS = {
  googleRoadmap: {
    id: 'googleRoadmap',
    name: 'Roads',
    fullName: 'Google Maps (Roads)',
    icon: '🗺️',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps',
    maxZoom: 20,
  },
  googleHybrid: {
    id: 'googleHybrid',
    name: 'Satellite',
    fullName: 'Google Satellite (Earth)',
    icon: '🛰️',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps & Maxar',
    maxZoom: 20,
  },
  googleTerrain: {
    id: 'googleTerrain',
    name: 'Terrain',
    fullName: 'Google Terrain (Relief)',
    icon: '⛰️',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps',
    maxZoom: 20,
  },
  esriStreets: {
    id: 'esriStreets',
    name: 'Esri',
    fullName: 'Esri National Highway',
    icon: '🛣️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  },
};

// Continuous 60fps gesture handler for Mac trackpad pinch-to-zoom (wheel + ctrlKey & Safari gestures)
function SmoothPinchZoomHandler() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (typeof window !== 'undefined') {
      window.__LEAFLET_MAP__ = map;
    }
    const container = map.getContainer();

    const handleWheel = (e) => {
      // ctrlKey is true when trackpad pinch gesture occurs on macOS
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        // High-responsiveness continuous trackpad zoom delta
        const delta = -e.deltaY * 0.045;
        const currentZoom = map.getZoom();
        const targetZoom = Math.min(20, Math.max(2, currentZoom + delta));
        map.setZoom(targetZoom, { animate: false });
      }
    };

    const handleGestureChange = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.scale) {
        const delta = Math.log2(e.scale);
        const currentZoom = map.getZoom();
        map.setZoom(Math.min(20, Math.max(2, currentZoom + delta * 0.6)), { animate: false });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('gesturechange', handleGestureChange, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('gesturechange', handleGestureChange);
    };
  }, [map]);

  return null;
}

// Component to dynamically fit all facilities in the active district with smooth animation
// Triggers ONLY when district changes or explicit reset — NEVER on transit timer re-renders
function MapBoundsManager({ facilities, district, focusFacilityId, resetTrigger }) {
  const map = useMap();
  const prevDistrictIdRef = useRef(null);
  const prevFocusIdRef = useRef(null);
  const prevResetTriggerRef = useRef(resetTrigger);

  // Focus specific facility if clicked
  useEffect(() => {
    if (!map || !focusFacilityId || focusFacilityId === prevFocusIdRef.current) return;
    prevFocusIdRef.current = focusFacilityId;
    const target = (facilities || []).find((f) => f.id === focusFacilityId);
    if (target && target.lat && target.lng) {
      map.flyTo([target.lat, target.lng], 14, { duration: 1.0 });
    }
  }, [focusFacilityId, facilities, map]);

  // Handle explicit reset click
  useEffect(() => {
    if (!map || resetTrigger === prevResetTriggerRef.current) return;
    prevResetTriggerRef.current = resetTrigger;
    const validCoords = (facilities || []).filter((f) => f.lat && f.lng).map((f) => [f.lat, f.lng]);
    if (validCoords.length > 1) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [55, 55], maxZoom: 12, animate: true, duration: 1.0 });
    } else if (district?.lat && district?.lng) {
      map.flyTo([district.lat, district.lng], 10, { duration: 1.0 });
    }
  }, [resetTrigger, facilities, district, map]);

  // Auto-fit ONLY on initial load or when district ID changes (e.g. Pune -> Chengalpattu)
  useEffect(() => {
    if (!map || !district?.id) return;
    if (district.id === prevDistrictIdRef.current) return; // Never snap back if already in same district!
    prevDistrictIdRef.current = district.id;

    const validCoords = (facilities || []).filter((f) => f.lat && f.lng).map((f) => [f.lat, f.lng]);
    if (validCoords.length > 1) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [55, 55], maxZoom: 12, animate: true, duration: 1.0 });
    } else if (district?.lat && district?.lng) {
      map.flyTo([district.lat, district.lng], 10, { duration: 1.0 });
    }
  }, [district?.id, map]);

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

// High-visibility Google Maps style pulsating blue GPS dot for real user location
function createUserLocationIcon() {
  const html = `
    <div class="relative flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(37,99,235,0.6)]">
      <span class="absolute -inset-3.5 rounded-full bg-blue-500/30 animate-ping pointer-events-none"></span>
      <span class="absolute -inset-1.5 rounded-full bg-blue-400/40 animate-pulse pointer-events-none"></span>
      <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
        <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
      </div>
      <div class="absolute -top-6 whitespace-nowrap bg-blue-700 text-white font-sans text-[9px] font-bold px-2 py-0.5 rounded-full border border-blue-300 shadow">
        YOU ARE HERE
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-user-location-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

// Helper to capture Leaflet map reference outside MapContainer
function LeafletMapRefBinder({ onMapReady }) {
  const map = useMap();
  useEffect(() => {
    if (map) onMapReady(map);
  }, [map, onMapReady]);
  return null;
}

// Google Maps floating action controls (+ / − / India View / My Location / Re-center)
function MapActionControls({
  viewEngine,
  leafletMap,
  googleZoom,
  setGoogleZoom,
  setGoogleCenter,
  onLocateUser,
  isLocating,
  onResetDistrict,
  districtCoords,
}) {
  const handleZoomIn = () => {
    if (viewEngine === 'google') {
      setGoogleZoom((z) => Math.min(19, z + 1));
    } else if (leafletMap) {
      const cur = leafletMap.getZoom();
      leafletMap.setZoom(Math.min(20, Math.floor(cur + 1)), { animate: true });
    }
  };

  const handleZoomOut = () => {
    if (viewEngine === 'google') {
      setGoogleZoom((z) => Math.max(3, z - 1));
    } else if (leafletMap) {
      const cur = leafletMap.getZoom();
      leafletMap.setZoom(Math.max(2, Math.ceil(cur - 1)), { animate: true });
    }
  };

  const handleZoomIndia = () => {
    if (viewEngine === 'google') {
      setGoogleCenter({ lat: 21.7679, lng: 78.8718 });
      setGoogleZoom(5);
    } else if (leafletMap) {
      leafletMap.flyTo([21.7679, 78.8718], 4.5, { duration: 1.2 });
    }
  };

  const handleLocate = () => {
    onLocateUser(leafletMap);
  };

  const handleReset = () => {
    if (viewEngine === 'google') {
      setGoogleCenter({ lat: districtCoords.lat, lng: districtCoords.lng });
      setGoogleZoom(12);
    } else if (leafletMap) {
      onResetDistrict(leafletMap);
    }
  };

  return (
    <div className="absolute bottom-5 right-4 z-20 flex flex-col items-center gap-2 pointer-events-auto">
      {/* Zoom In & Zoom Out Buttons */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-[#EBE4D8] overflow-hidden flex flex-col">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center text-text-obsidian hover:bg-stone-100 active:bg-stone-200 transition border-b border-stone-200/70 font-bold cursor-pointer"
          title="Zoom In"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center text-text-obsidian hover:bg-stone-100 active:bg-stone-200 transition font-bold cursor-pointer"
          title="Zoom Out"
        >
          <span className="material-symbols-outlined text-[20px]">remove</span>
        </button>
      </div>

      {/* 1-Click All India View Button */}
      <button
        type="button"
        onClick={handleZoomIndia}
        className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#EBE4D8] flex items-center justify-center transition cursor-pointer hover:bg-stone-50 active:bg-stone-100 text-sm font-bold shadow-md hover:scale-105"
        title="Zoom Out to All India (1-Click India View)"
      >
        🇮🇳
      </button>

      {/* Live GPS "My Location" Button with prominent pulsing state and label tooltip */}
      <button
        type="button"
        onClick={handleLocate}
        disabled={isLocating}
        className={`w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-blue-200 flex items-center justify-center transition cursor-pointer hover:bg-blue-50 active:bg-blue-100 group relative ${
          isLocating ? 'animate-pulse text-blue-600 ring-2 ring-blue-400' : 'text-blue-600 hover:text-blue-700'
        }`}
        title="Go to My Current Real Location (Live GPS)"
      >
        <span className={`material-symbols-outlined text-[22px] ${isLocating ? 'animate-spin' : ''}`}>
          {isLocating ? 'progress_activity' : 'my_location'}
        </span>
        <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-neutral-900 text-white text-[11px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none shadow-md">
          Go to My Location (Live GPS)
        </span>
      </button>

      {/* Re-center District Bounds Button */}
      <button
        type="button"
        onClick={handleReset}
        className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[#EBE4D8] flex items-center justify-center transition cursor-pointer hover:bg-stone-50 active:bg-stone-100 text-amber-brand"
        title="Re-center District Facilities"
      >
        <span className="material-symbols-outlined text-[20px]">crop_free</span>
      </button>
    </div>
  );
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
  const [viewEngine, setViewEngine] = useState('gis'); // 'gis' | 'google'
  const [activeBasemap, setActiveBasemap] = useState('googleRoadmap');
  const [transitProgress, setTransitProgress] = useState(0.42);
  const [vehicleFollowMode, setVehicleFollowMode] = useState(false);
  const [focusId, setFocusId] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState(null);
  const [leafletMap, setLeafletMap] = useState(null);

  const centerLat = district?.lat || 18.5204;
  const centerLng = district?.lng || 73.8567;

  const [googleCenter, setGoogleCenter] = useState({ lat: centerLat, lng: centerLng });
  const [googleZoom, setGoogleZoom] = useState(13);

  // Sync Google Center when district changes
  useEffect(() => {
    if (district?.lat && district?.lng) {
      setGoogleCenter({ lat: district.lat, lng: district.lng });
    }
  }, [district?.lat, district?.lng]);

  // Manual reset of view back to district bounds
  const handleResetDistrict = (mapInstance) => {
    setFocusId(null);
    setResetTrigger((prev) => prev + 1);
    const targetMap = mapInstance || leafletMap;
    if (targetMap) {
      const validCoords = facilities.filter((f) => f.lat && f.lng).map((f) => [f.lat, f.lng]);
      if (validCoords.length > 1) {
        const bounds = L.latLngBounds(validCoords);
        targetMap.fitBounds(bounds, { padding: [55, 55], maxZoom: 12, animate: true, duration: 1.2 });
      } else if (validCoords.length === 1) {
        targetMap.flyTo(validCoords[0], 11, { duration: 1.2 });
      } else if (district?.lat && district?.lng) {
        targetMap.flyTo([district.lat, district.lng], 10, { duration: 1.2 });
      }
    }
  };

  // Real device GPS / IP location fetch
  const handleLocateUser = async (mapInstance) => {
    setIsLocating(true);
    setLocationNotice({ type: 'info', text: 'Fetching your real GPS coordinates from device...' });
    try {
      const loc = await getBrowserLocation();
      if (loc && loc.lat && loc.lng) {
        setUserLocation(loc);
        if (viewEngine === 'google') {
          setGoogleCenter({ lat: loc.lat, lng: loc.lng });
          setGoogleZoom(15);
        } else {
          const target = mapInstance || leafletMap;
          if (target) {
            target.flyTo([loc.lat, loc.lng], 14, { duration: 1.5 });
          }
        }
        const sourceLabel = loc.source === 'DEVICE_GPS' ? 'Satellite GPS' : 'IP Geolocation';
        setLocationNotice({
          type: 'success',
          text: `📍 Located your position: ${loc.lat.toFixed(4)}° N, ${loc.lng.toFixed(4)}° E (${sourceLabel})`,
        });
        setTimeout(() => setLocationNotice(null), 6000);
      } else {
        throw new Error('Coordinates missing');
      }
    } catch (err) {
      console.warn('Geolocation request failed, centering on district capital:', err);
      const fallbackLat = district?.lat || centerLat;
      const fallbackLng = district?.lng || centerLng;
      setUserLocation({ lat: fallbackLat, lng: fallbackLng, source: 'DISTRICT_DEFAULT' });
      if (viewEngine === 'google') {
        setGoogleCenter({ lat: fallbackLat, lng: fallbackLng });
        setGoogleZoom(14);
      } else {
        const target = mapInstance || leafletMap;
        if (target) target.flyTo([fallbackLat, fallbackLng], 12, { duration: 1.2 });
      }
      setLocationNotice({
        type: 'info',
        text: `📍 Centered on ${district?.name || 'District'} Health Node (${fallbackLat.toFixed(4)}° N, ${fallbackLng.toFixed(4)}° E)`,
      });
      setTimeout(() => setLocationNotice(null), 5000);
    } finally {
      setIsLocating(false);
    }
  };

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
      className="relative w-full rounded-3xl overflow-hidden border border-[#EBE4D8] shadow-sm bg-[#FAF8F5] select-none isolate"
      style={{ height }}
    >
      {/* Top Bar: Telemetry Badge (Left) & Map Controls (Right) — Single Responsive Flex Row (Zero Overlap) */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Compact Health Telemetry HUD Badge */}
        <div className="bg-white/95 backdrop-blur-xl px-3.5 py-1.5 rounded-2xl border border-[#EBE4D8] shadow-md flex items-center gap-2 pointer-events-auto shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-xs text-text-obsidian leading-none">
              {district?.name || 'District'} Health Telemetry
            </span>
            <span className="text-[10px] text-text-muted hidden md:inline">• NIC/DISHA</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
            +{activeSurgePercent}% Influx
          </span>
        </div>

        {/* Right: Engine Switcher & Map Mode Controls */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto ml-auto">
          {/* Map Engine Switcher: GIS Radar vs Live Google Maps */}
          <div className="bg-white/95 backdrop-blur-xl p-1 rounded-2xl border border-[#EBE4D8] shadow-md flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewEngine('gis')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewEngine === 'gis'
                  ? 'bg-[#181511] text-white shadow-xs'
                  : 'text-text-muted hover:text-text-obsidian hover:bg-stone-100'
              }`}
              title="Redistribution Fleet Grid & Outbreak Radar"
            >
              <span>🛰️</span>
              <span className="hidden sm:inline">GIS Radar</span>
            </button>
            <button
              type="button"
              onClick={() => setViewEngine('google')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewEngine === 'google'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-700 hover:bg-blue-50'
              }`}
              title="Official Google Maps with Native Mac Trackpad Pinch-to-Zoom"
            >
              <span>🗺️</span>
              <span>Google Maps</span>
            </button>
          </div>

          {viewEngine === 'gis' && (
            /* Streamlined Basemap Toggle: Roads vs Satellite */
            <div className="bg-white/95 backdrop-blur-xl p-1 rounded-2xl border border-[#EBE4D8] shadow-md flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveBasemap('googleRoadmap')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                  activeBasemap === 'googleRoadmap'
                    ? 'bg-[#181511] text-white shadow-xs'
                    : 'text-text-muted hover:text-text-obsidian hover:bg-stone-100'
                }`}
                title="Google Roads Basemap"
              >
                <span>🗺️</span>
                <span className="hidden sm:inline text-[11px]">Roads</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveBasemap('googleHybrid')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                  activeBasemap === 'googleHybrid'
                    ? 'bg-[#181511] text-white shadow-xs'
                    : 'text-text-muted hover:text-text-obsidian hover:bg-stone-100'
                }`}
                title="Google Satellite Earth"
              >
                <span>🛰️</span>
                <span className="hidden sm:inline text-[11px]">Satellite</span>
              </button>
            </div>
          )}

          {/* Labeled Live GPS "Locate Me" Button */}
          <button
            type="button"
            onClick={() => handleLocateUser(leafletMap)}
            disabled={isLocating}
            className="bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-blue-200 shadow-md flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 active:bg-blue-100 transition cursor-pointer shrink-0"
            title="Go to My Real Current Location (Live GPS)"
          >
            <span className={`material-symbols-outlined text-[16px] text-blue-600 ${isLocating ? 'animate-spin' : ''}`}>
              {isLocating ? 'progress_activity' : 'my_location'}
            </span>
            <span>{isLocating ? 'Locating...' : '📍 Locate Me'}</span>
          </button>

          {/* External Google Maps App Link */}
          <a
            href={`https://www.google.com/maps/@${userLocation?.lat || centerLat},${userLocation?.lng || centerLng},14z`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-2xl bg-white/95 backdrop-blur-xl hover:bg-stone-50 text-text-obsidian border border-[#EBE4D8] shadow-md flex items-center gap-1 text-xs font-semibold transition cursor-pointer"
            title="Open in official Google Maps app"
          >
            <span className="text-[12px]">↗️</span>
            <span className="hidden md:inline text-[11px] font-bold text-blue-700">App</span>
          </a>
        </div>
      </div>

      {/* Floating GPS Location Notification Toast */}
      {locationNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 max-w-md pointer-events-auto transition-all">
          <div
            className={`px-3.5 py-2 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2 backdrop-blur-md ${
              locationNotice.type === 'success'
                ? 'bg-emerald-950/90 text-white border-emerald-500'
                : locationNotice.type === 'error'
                ? 'bg-rose-950/90 text-white border-rose-500'
                : 'bg-[#181511]/90 text-white border-stone-600'
            }`}
          >
            <span>{locationNotice.text}</span>
            <button
              onClick={() => setLocationNotice(null)}
              className="ml-1 text-white/70 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bottom Center / Left: Live Vehicle Transit HUD Radar Card */}
      {corridorCoords && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl border border-amber-brand/35 shadow-lg max-w-lg pointer-events-auto space-y-2.5">
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

      {/* Map Engine View: Official Google Maps Live OR Tactical GIS Radar */}
      {viewEngine === 'google' ? (
        <div className="w-full h-full relative z-0">
          <iframe
            key={`${googleCenter.lat}-${googleCenter.lng}-${googleZoom}`}
            title="Official Google Maps Live Engine"
            src={`https://maps.google.com/maps?q=${googleCenter.lat},${googleCenter.lng}&t=${
              activeBasemap === 'googleHybrid' ? 'k' : 'm'
            }&z=${googleZoom}&output=embed`}
            className="w-full h-full border-0 select-none"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        /* Map Canvas - Real Google Maps Tiles with 60fps Smooth Trackpad Pinch-to-Zoom */
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={11}
          minZoom={2}
          maxZoom={20}
          zoomSnap={0.5}
          zoomDelta={1}
          wheelDebounceTime={15}
          wheelPxPerZoomLevel={50}
          scrollWheelZoom={true}
          touchZoom={true}
          doubleClickZoom={true}
          dragging={true}
          boxZoom={true}
          keyboard={true}
          zoomControl={false}
          className="w-full h-full z-0 cursor-grab active:cursor-grabbing select-none"
          style={{ background: '#FAF8F5' }}
        >
        {/* Continuous Trackpad Pinch-to-Zoom Gesture Engine */}
        <SmoothPinchZoomHandler />

        {/* Capture Leaflet instance */}
        <LeafletMapRefBinder onMapReady={setLeafletMap} />

        <MapBoundsManager
          facilities={facilities}
          district={district}
          focusFacilityId={focusId}
          resetTrigger={resetTrigger}
        />

        {/* Real Google Maps / Satellite Basemap TileLayer */}
        <TileLayer
          key={currentBasemap.id}
          url={currentBasemap.url}
          subdomains={currentBasemap.subdomains || ['mt0', 'mt1', 'mt2', 'mt3']}
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

        {/* Real User Live GPS Location Pin (Google Maps Blue Dot) */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserLocationIcon()}
          >
            <Popup>
              <div className="p-1 space-y-1.5 min-w-[210px] text-xs">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1">
                  <strong className="text-blue-700 flex items-center gap-1 font-bold">
                    <span>📍</span>
                    <span>Your Real GPS Location</span>
                  </strong>
                  <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    {userLocation.source === 'DEVICE_GPS' ? 'DEVICE GPS' : 'IP NETWORK'}
                  </span>
                </div>
                <div className="space-y-0.5 text-[11px] text-text-muted">
                  <div>Latitude: <strong className="text-text-obsidian">{userLocation.lat.toFixed(4)}° N</strong></div>
                  <div>Longitude: <strong className="text-text-obsidian">{userLocation.lng.toFixed(4)}° E</strong></div>
                  {userLocation.accuracy && (
                    <div>Accuracy: <strong>±{Math.round(userLocation.accuracy)} meters</strong></div>
                  )}
                  {userLocation.city && (
                    <div>Location: <strong className="text-text-obsidian">{userLocation.city}, {userLocation.region}</strong></div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    )}

    {/* Floating Controls for Zoom / Locate / Re-center (Always Visible in Both Map Engines) */}
    <MapActionControls
      viewEngine={viewEngine}
      leafletMap={leafletMap}
      googleZoom={googleZoom}
      setGoogleZoom={setGoogleZoom}
      setGoogleCenter={setGoogleCenter}
      onLocateUser={handleLocateUser}
      isLocating={isLocating}
      onResetDistrict={handleResetDistrict}
      districtCoords={{ lat: centerLat, lng: centerLng }}
    />
  </div>
);
}

