// Haversine formula to compute great-circle distance between two GPS coordinates in kilometers
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

// Find nearest facility from a list based on user latitude & longitude
export function findNearestFacility(userLat, userLng, facilities) {
  if (!userLat || !userLng || !facilities || facilities.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  for (const fac of facilities) {
    if (fac.lat != null && fac.lng != null) {
      const dist = calculateDistance(userLat, userLng, fac.lat, fac.lng);
      if (dist !== null && dist < minDistance) {
        minDistance = dist;
        nearest = { ...fac, distance_km: dist };
      }
    }
  }

  return nearest;
}

// Find nearest district from ALL_DISTRICTS based on user GPS latitude & longitude
export function findNearestDistrict(userLat, userLng, districts) {
  if (!userLat || !userLng || !districts || districts.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  for (const d of districts) {
    if (d.lat != null && d.lng != null) {
      const dist = calculateDistance(userLat, userLng, d.lat, d.lng);
      if (dist !== null && dist < minDistance) {
        minDistance = dist;
        nearest = { ...d, distance_km: dist };
      }
    }
  }

  return nearest;
}

// Browser Geolocation with Automatic IP Fallback so it never fails
export async function getBrowserLocation() {
  // Layer 1: HTML5 Device Satellite GPS
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
        );
      });

      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        source: 'DEVICE_GPS',
      };
    } catch (gpsErr) {
      console.warn('HTML5 GPS permission denied or timed out. Falling back to IP Geolocation...', gpsErr);
    }
  }

  // Layer 2: IP-based Geolocation Service Fallback
  try {
    const res = await fetch('https://freeipapi.com/api/json');
    if (res.ok) {
      const data = await res.json();
      if (data.latitude != null && data.longitude != null) {
        return {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
          city: data.cityName || '',
          region: data.regionName || '',
          source: 'IP_NETWORK',
        };
      }
    }
  } catch (ipErr) {
    console.warn('IP Geolocation fallback failed:', ipErr);
  }

  // Layer 3: Resilient Regional Fallback Coordinates (Pune District Health Headquarters)
  return {
    lat: 18.5204,
    lng: 73.8567,
    city: 'Pune',
    region: 'Maharashtra',
    source: 'REGIONAL_HQ',
  };
}
