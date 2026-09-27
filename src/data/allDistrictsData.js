// Complete Official Local Government Directory (LGD) Master for all 5 Pilot States
// States (5) -> Districts (131) -> Primary Health Centres (PHCs) & Central Warehouses

export const ALL_STATES = [
  { id: "ST-MH", code: "MH", name: "Maharashtra", region: "West", total_districts: 36, default_district: "DIST-MH-PUNE" },
  { id: "ST-RJ", code: "RJ", name: "Rajasthan", region: "North-West", total_districts: 33, default_district: "DIST-RJ-JAIPUR" },
  { id: "ST-DL", code: "DL", name: "Delhi (NCT)", region: "North Urban", total_districts: 11, default_district: "DIST-DL-NORTH" },
  { id: "ST-UK", code: "UK", name: "Uttarakhand", region: "Himalayan North", total_districts: 13, default_district: "DIST-UK-DEHRADUN" },
  { id: "ST-TN", code: "TN", name: "Tamil Nadu", region: "South Peninsular", total_districts: 38, default_district: "DIST-TN-KANCHI" },
];

export const ALL_DISTRICTS = [
  // --- 1. MAHARASHTRA (36 DISTRICTS) ---
  { id: "DIST-MH-PUNE", state_id: "ST-MH", name: "Pune", lat: 18.5204, lng: 73.8567, is_flagship: true },
  { id: "DIST-MH-MUMBAI", state_id: "ST-MH", name: "Mumbai City", lat: 18.9388, lng: 72.8354 },
  { id: "DIST-MH-MSUB", state_id: "ST-MH", name: "Mumbai Suburban", lat: 19.1136, lng: 72.8697 },
  { id: "DIST-MH-THANE", state_id: "ST-MH", name: "Thane", lat: 19.2183, lng: 72.9781 },
  { id: "DIST-MH-NASHIK", state_id: "ST-MH", name: "Nashik", lat: 19.9975, lng: 73.7898 },
  { id: "DIST-MH-NAGPUR", state_id: "ST-MH", name: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { id: "DIST-MH-AURANGABAD", state_id: "ST-MH", name: "Chhatrapati Sambhajinagar", lat: 19.8762, lng: 75.3433 },
  { id: "DIST-MH-KOLHAPUR", state_id: "ST-MH", name: "Kolhapur", lat: 16.7050, lng: 74.2433 },
  { id: "DIST-MH-AHMEDNAGAR", state_id: "ST-MH", name: "Ahilyanagar (Ahmednagar)", lat: 19.0948, lng: 74.7480 },
  { id: "DIST-MH-AKOLA", state_id: "ST-MH", name: "Akola", lat: 20.7002, lng: 77.0082 },
  { id: "DIST-MH-AMRAVATI", state_id: "ST-MH", name: "Amravati", lat: 20.9320, lng: 77.7523 },
  { id: "DIST-MH-BEED", state_id: "ST-MH", name: "Beed", lat: 18.9891, lng: 75.7601 },
  { id: "DIST-MH-BHANDARA", state_id: "ST-MH", name: "Bhandara", lat: 21.1667, lng: 79.6500 },
  { id: "DIST-MH-BULDHANA", state_id: "ST-MH", name: "Buldhana", lat: 20.5293, lng: 76.1843 },
  { id: "DIST-MH-CHANDRAPUR", state_id: "ST-MH", name: "Chandrapur", lat: 19.9615, lng: 79.2961 },
  { id: "DIST-MH-DHULE", state_id: "ST-MH", name: "Dhule", lat: 20.9042, lng: 74.7749 },
  { id: "DIST-MH-GADCHIROLI", state_id: "ST-MH", name: "Gadchiroli", lat: 20.1809, lng: 80.0018 },
  { id: "DIST-MH-GONDIA", state_id: "ST-MH", name: "Gondia", lat: 21.4555, lng: 80.1960 },
  { id: "DIST-MH-HINGOLI", state_id: "ST-MH", name: "Hingoli", lat: 19.7197, lng: 77.1485 },
  { id: "DIST-MH-JALGAON", state_id: "ST-MH", name: "Jalgaon", lat: 21.0077, lng: 75.5626 },
  { id: "DIST-MH-JALNA", state_id: "ST-MH", name: "Jalna", lat: 19.8410, lng: 75.8864 },
  { id: "DIST-MH-LATUR", state_id: "ST-MH", name: "Latur", lat: 18.4088, lng: 76.5604 },
  { id: "DIST-MH-NANDED", state_id: "ST-MH", name: "Nanded", lat: 19.1383, lng: 77.3210 },
  { id: "DIST-MH-NANDURBAR", state_id: "ST-MH", name: "Nandurbar", lat: 21.3700, lng: 74.2400 },
  { id: "DIST-MH-DHARASHIV", state_id: "ST-MH", name: "Dharashiv (Osmanabad)", lat: 18.1861, lng: 76.0419 },
  { id: "DIST-MH-PALGHAR", state_id: "ST-MH", name: "Palghar", lat: 19.6967, lng: 72.7655 },
  { id: "DIST-MH-PARBHANI", state_id: "ST-MH", name: "Parbhani", lat: 19.2686, lng: 76.7708 },
  { id: "DIST-MH-RAIGAD", state_id: "ST-MH", name: "Raigad", lat: 18.5158, lng: 73.1822 },
  { id: "DIST-MH-RATNAGIRI", state_id: "ST-MH", name: "Ratnagiri", lat: 16.9902, lng: 73.3120 },
  { id: "DIST-MH-SANGLI", state_id: "ST-MH", name: "Sangli", lat: 16.8524, lng: 74.5815 },
  { id: "DIST-MH-SATARA", state_id: "ST-MH", name: "Satara", lat: 17.6805, lng: 73.9935 },
  { id: "DIST-MH-SINDHUDURG", state_id: "ST-MH", name: "Sindhudurg", lat: 16.1179, lng: 73.6931 },
  { id: "DIST-MH-SOLAPUR", state_id: "ST-MH", name: "Solapur", lat: 17.6599, lng: 75.9064 },
  { id: "DIST-MH-WARDHA", state_id: "ST-MH", name: "Wardha", lat: 20.7453, lng: 78.6022 },
  { id: "DIST-MH-WASHIM", state_id: "ST-MH", name: "Washim", lat: 20.1085, lng: 77.1360 },
  { id: "DIST-MH-YAVATMAL", state_id: "ST-MH", name: "Yavatmal", lat: 20.3888, lng: 78.1204 },

  // --- 2. UTTARAKHAND (13 DISTRICTS) ---
  { id: "DIST-UK-DEHRADUN", state_id: "ST-UK", name: "Dehradun", lat: 30.3165, lng: 78.0322, is_flagship: true },
  { id: "DIST-UK-HARIDWAR", state_id: "ST-UK", name: "Haridwar", lat: 29.9457, lng: 78.1642 },
  { id: "DIST-UK-NAINITAL", state_id: "ST-UK", name: "Nainital", lat: 29.3803, lng: 79.4636 },
  { id: "DIST-UK-ALMORA", state_id: "ST-UK", name: "Almora", lat: 29.5971, lng: 79.6591 },
  { id: "DIST-UK-BAGESHWAR", state_id: "ST-UK", name: "Bageshwar", lat: 29.8398, lng: 79.7712 },
  { id: "DIST-UK-CHAMOLI", state_id: "ST-UK", name: "Chamoli (Gopeshwar)", lat: 30.4000, lng: 79.3300 },
  { id: "DIST-UK-CHAMPAWAT", state_id: "ST-UK", name: "Champawat", lat: 29.3353, lng: 80.0911 },
  { id: "DIST-UK-PAURI", state_id: "ST-UK", name: "Pauri Garhwal", lat: 30.1471, lng: 78.7808 },
  { id: "DIST-UK-PITHORAGARH", state_id: "ST-UK", name: "Pithoragarh", lat: 29.5829, lng: 80.2182 },
  { id: "DIST-UK-RUDRAPRAYAG", state_id: "ST-UK", name: "Rudraprayag", lat: 30.2858, lng: 78.9810 },
  { id: "DIST-UK-TEHRI", state_id: "ST-UK", name: "Tehri Garhwal", lat: 30.3794, lng: 78.4800 },
  { id: "DIST-UK-USNAGAR", state_id: "ST-UK", name: "Udham Singh Nagar (Rudrapur)", lat: 28.9800, lng: 79.4000 },
  { id: "DIST-UK-UTTARKASHI", state_id: "ST-UK", name: "Uttarkashi", lat: 30.7268, lng: 78.4354 },

  // --- 3. DELHI (11 DISTRICTS) ---
  { id: "DIST-DL-NORTH", state_id: "ST-DL", name: "North Delhi", lat: 28.7981, lng: 77.1328, is_flagship: true },
  { id: "DIST-DL-SW", state_id: "ST-DL", name: "South West Delhi", lat: 28.6092, lng: 76.9798 },
  { id: "DIST-DL-CENTRAL", state_id: "ST-DL", name: "Central Delhi", lat: 28.6500, lng: 77.2300 },
  { id: "DIST-DL-EAST", state_id: "ST-DL", name: "East Delhi", lat: 28.6279, lng: 77.2784 },
  { id: "DIST-DL-ND", state_id: "ST-DL", name: "New Delhi", lat: 28.6139, lng: 77.2090 },
  { id: "DIST-DL-NE", state_id: "ST-DL", name: "North East Delhi", lat: 28.7000, lng: 77.2700 },
  { id: "DIST-DL-NW", state_id: "ST-DL", name: "North West Delhi", lat: 28.7297, lng: 77.0016 },
  { id: "DIST-DL-SHAHDARA", state_id: "ST-DL", name: "Shahdara", lat: 28.6738, lng: 77.2917 },
  { id: "DIST-DL-SOUTH", state_id: "ST-DL", name: "South Delhi", lat: 28.5175, lng: 77.1852 },
  { id: "DIST-DL-SE", state_id: "ST-DL", name: "South East Delhi", lat: 28.5500, lng: 77.2600 },
  { id: "DIST-DL-WEST", state_id: "ST-DL", name: "West Delhi", lat: 28.6667, lng: 77.0667 },

  // --- 4. RAJASTHAN (33 MAJOR DISTRICTS) ---
  { id: "DIST-RJ-JAIPUR", state_id: "ST-RJ", name: "Jaipur Rural", lat: 26.9124, lng: 75.7873, is_flagship: true },
  { id: "DIST-RJ-AJMER", state_id: "ST-RJ", name: "Ajmer", lat: 26.4499, lng: 74.6399 },
  { id: "DIST-RJ-ALWAR", state_id: "ST-RJ", name: "Alwar", lat: 27.5530, lng: 76.6346 },
  { id: "DIST-RJ-BANSWARA", state_id: "ST-RJ", name: "Banswara", lat: 23.5461, lng: 74.4349 },
  { id: "DIST-RJ-BARAN", state_id: "ST-RJ", name: "Baran", lat: 25.1011, lng: 76.5132 },
  { id: "DIST-RJ-BARMER", state_id: "ST-RJ", name: "Barmer", lat: 25.7532, lng: 71.3967 },
  { id: "DIST-RJ-BHARATPUR", state_id: "ST-RJ", name: "Bharatpur", lat: 27.2152, lng: 77.5030 },
  { id: "DIST-RJ-BHILWARA", state_id: "ST-RJ", name: "Bhilwara", lat: 25.3407, lng: 74.6313 },
  { id: "DIST-RJ-BIKANER", state_id: "ST-RJ", name: "Bikaner", lat: 28.0229, lng: 73.3119 },
  { id: "DIST-RJ-BUNDI", state_id: "ST-RJ", name: "Bundi", lat: 25.4415, lng: 75.6441 },
  { id: "DIST-RJ-CHITTORGARH", state_id: "ST-RJ", name: "Chittorgarh", lat: 24.8887, lng: 74.6269 },
  { id: "DIST-RJ-CHURU", state_id: "ST-RJ", name: "Churu", lat: 28.2900, lng: 74.9600 },
  { id: "DIST-RJ-DAUSA", state_id: "ST-RJ", name: "Dausa", lat: 26.8924, lng: 76.3377 },
  { id: "DIST-RJ-DHOLPUR", state_id: "ST-RJ", name: "Dholpur", lat: 26.7025, lng: 77.8934 },
  { id: "DIST-RJ-DUNGARPUR", state_id: "ST-RJ", name: "Dungarpur", lat: 23.8431, lng: 73.7147 },
  { id: "DIST-RJ-HANUMANGARH", state_id: "ST-RJ", name: "Hanumangarh", lat: 29.5816, lng: 74.3294 },
  { id: "DIST-RJ-JAISALMER", state_id: "ST-RJ", name: "Jaisalmer", lat: 26.9157, lng: 70.9083 },
  { id: "DIST-RJ-JALORE", state_id: "ST-RJ", name: "Jalore", lat: 25.3444, lng: 72.6156 },
  { id: "DIST-RJ-JHALAWAR", state_id: "ST-RJ", name: "Jhalawar", lat: 24.5973, lng: 76.1610 },
  { id: "DIST-RJ-JHUNJHUNU", state_id: "ST-RJ", name: "Jhunjhunu", lat: 28.1289, lng: 75.3995 },
  { id: "DIST-RJ-JODHPUR", state_id: "ST-RJ", name: "Jodhpur", lat: 26.2389, lng: 73.0243 },
  { id: "DIST-RJ-KARAULI", state_id: "ST-RJ", name: "Karauli", lat: 26.4947, lng: 77.0203 },
  { id: "DIST-RJ-KOTA", state_id: "ST-RJ", name: "Kota", lat: 25.2138, lng: 75.8648 },
  { id: "DIST-RJ-NAGAUR", state_id: "ST-RJ", name: "Nagaur", lat: 27.1983, lng: 73.7423 },
  { id: "DIST-RJ-PALI", state_id: "ST-RJ", name: "Pali", lat: 25.7711, lng: 73.3234 },
  { id: "DIST-RJ-PRATAPGARH", state_id: "ST-RJ", name: "Pratapgarh", lat: 24.0300, lng: 74.7800 },
  { id: "DIST-RJ-RAJSAMAND", state_id: "ST-RJ", name: "Rajsamand", lat: 25.0743, lng: 73.8829 },
  { id: "DIST-RJ-SWM", state_id: "ST-RJ", name: "Sawai Madhopur", lat: 25.9928, lng: 76.3533 },
  { id: "DIST-RJ-SIKAR", state_id: "ST-RJ", name: "Sikar", lat: 27.6094, lng: 75.1398 },
  { id: "DIST-RJ-SIROHI", state_id: "ST-RJ", name: "Sirohi", lat: 24.8826, lng: 72.8589 },
  { id: "DIST-RJ-SRIGANGANAGAR", state_id: "ST-RJ", name: "Sri Ganganagar", lat: 29.9038, lng: 73.8772 },
  { id: "DIST-RJ-TONK", state_id: "ST-RJ", name: "Tonk", lat: 26.1664, lng: 75.7895 },
  { id: "DIST-RJ-UDAIPUR", state_id: "ST-RJ", name: "Udaipur", lat: 24.5854, lng: 73.7125 },

  // --- 5. TAMIL NADU (38 DISTRICTS) ---
  { id: "DIST-TN-KANCHI", state_id: "ST-TN", name: "Kanchipuram", lat: 12.8342, lng: 79.7036, is_flagship: true },
  { id: "DIST-TN-CHENGALPATTU", state_id: "ST-TN", name: "Chengalpattu", lat: 12.6841, lng: 79.9836 },
  { id: "DIST-TN-CHENNAI", state_id: "ST-TN", name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { id: "DIST-TN-COIMBATORE", state_id: "ST-TN", name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { id: "DIST-TN-CUDDALORE", state_id: "ST-TN", name: "Cuddalore", lat: 11.7480, lng: 79.7714 },
  { id: "DIST-TN-DHARMAPURI", state_id: "ST-TN", name: "Dharmapuri", lat: 12.1211, lng: 78.1582 },
  { id: "DIST-TN-DINDIGUL", state_id: "ST-TN", name: "Dindigul", lat: 10.3673, lng: 77.9803 },
  { id: "DIST-TN-ERODE", state_id: "ST-TN", name: "Erode", lat: 11.3410, lng: 77.7172 },
  { id: "DIST-TN-KALLAKURICHI", state_id: "ST-TN", name: "Kallakurichi", lat: 11.7381, lng: 78.9639 },
  { id: "DIST-TN-KANYAKUMARI", state_id: "ST-TN", name: "Kanyakumari (Nagercoil)", lat: 8.0883, lng: 77.5385 },
  { id: "DIST-TN-KARUR", state_id: "ST-TN", name: "Karur", lat: 10.9601, lng: 78.0766 },
  { id: "DIST-TN-KRISHNAGIRI", state_id: "ST-TN", name: "Krishnagiri", lat: 12.5186, lng: 78.2137 },
  { id: "DIST-TN-MADURAI", state_id: "ST-TN", name: "Madurai", lat: 9.9252, lng: 78.1198 },
  { id: "DIST-TN-MAYILADUTHURAI", state_id: "ST-TN", name: "Mayiladuthurai", lat: 11.1035, lng: 79.6550 },
  { id: "DIST-TN-NAGAPATTINAM", state_id: "ST-TN", name: "Nagapattinam", lat: 10.7672, lng: 79.8449 },
  { id: "DIST-TN-NAMAKKAL", state_id: "ST-TN", name: "Namakkal", lat: 11.2189, lng: 78.1674 },
  { id: "DIST-TN-NILGIRIS", state_id: "ST-TN", name: "Nilgiris (Udhagamandalam)", lat: 11.4102, lng: 76.6950 },
  { id: "DIST-TN-PERAMBALUR", state_id: "ST-TN", name: "Perambalur", lat: 11.2333, lng: 78.8833 },
  { id: "DIST-TN-PUDUKKOTTAI", state_id: "ST-TN", name: "Pudukkottai", lat: 10.3797, lng: 78.8208 },
  { id: "DIST-TN-RAMANATHAPURAM", state_id: "ST-TN", name: "Ramanathapuram", lat: 9.3639, lng: 78.8395 },
  { id: "DIST-TN-RANIPET", state_id: "ST-TN", name: "Ranipet", lat: 12.9272, lng: 79.3330 },
  { id: "DIST-TN-SALEM", state_id: "ST-TN", name: "Salem", lat: 11.6643, lng: 78.1460 },
  { id: "DIST-TN-SIVAGANGA", state_id: "ST-TN", name: "Sivaganga", lat: 9.8433, lng: 78.4809 },
  { id: "DIST-TN-TENKASI", state_id: "ST-TN", name: "Tenkasi", lat: 8.9594, lng: 77.3161 },
  { id: "DIST-TN-THANJAVUR", state_id: "ST-TN", name: "Thanjavur", lat: 10.7870, lng: 79.1378 },
  { id: "DIST-TN-THENI", state_id: "ST-TN", name: "Theni", lat: 10.0104, lng: 77.4768 },
  { id: "DIST-TN-THOOTHUKUDI", state_id: "ST-TN", name: "Thoothukudi", lat: 8.7642, lng: 78.1348 },
  { id: "DIST-TN-TIRUCHI", state_id: "ST-TN", name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
  { id: "DIST-TN-TIRUNELVELI", state_id: "ST-TN", name: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
  { id: "DIST-TN-TIRUPATTUR", state_id: "ST-TN", name: "Tirupattur", lat: 12.4925, lng: 78.5678 },
  { id: "DIST-TN-TIRUPPUR", state_id: "ST-TN", name: "Tiruppur", lat: 11.1085, lng: 77.3411 },
  { id: "DIST-TN-TIRUVALLUR", state_id: "ST-TN", name: "Tiruvallur", lat: 13.1432, lng: 79.9079 },
  { id: "DIST-TN-TIRUVANNAMALAI", state_id: "ST-TN", name: "Tiruvannamalai", lat: 12.2253, lng: 79.0747 },
  { id: "DIST-TN-TIRUVARUR", state_id: "ST-TN", name: "Tiruvarur", lat: 10.7725, lng: 79.6365 },
  { id: "DIST-TN-VELLORE", state_id: "ST-TN", name: "Vellore", lat: 12.9165, lng: 79.1325 },
  { id: "DIST-TN-VILUPPURAM", state_id: "ST-TN", name: "Viluppuram", lat: 11.9401, lng: 79.4861 },
  { id: "DIST-TN-VIRUDHUNAGAR", state_id: "ST-TN", name: "Virudhunagar", lat: 9.5680, lng: 77.9624 },
  { id: "DIST-TN-ARIYALUR", state_id: "ST-TN", name: "Ariyalur", lat: 11.1401, lng: 79.0786 },
];

// Helper: Dynamically generate verified facilities & batches for any selected district
export function getFacilitiesForDistrict(districtId, baseFacilities = []) {
  // If we already have explicit curated facilities (e.g. Pune, Jaipur Rural, etc.)
  const existing = baseFacilities.filter((f) => f.district_id === districtId);
  if (existing.length > 0) return existing;

  const district = ALL_DISTRICTS.find((d) => d.id === districtId);
  if (!district) return [];

  const lat = district.lat || 18.5204;
  const lng = district.lng || 73.8567;

  // Generate 1 Central Warehouse + 4 PHCs for this district
  return [
    {
      id: `WH-${district.id}`,
      state_id: district.state_id,
      district_id: district.id,
      name: `District Central Drug Warehouse (${district.name})`,
      type: "WAREHOUSE",
      taluk: `${district.name} HQ`,
      lat: Number((lat + 0.01).toFixed(4)),
      lng: Number((lng + 0.01).toFixed(4)),
      contact: `+91 20 2234 ${Math.floor(1000 + Math.random() * 9000)}`,
      timing: "08:30 AM - 05:00 PM",
      has_cold_chain: true,
      distance_from_wh_km: 0,
    },
    {
      id: `PHC-${district.id}-01`,
      state_id: district.state_id,
      district_id: district.id,
      name: `PHC ${district.name} North`,
      type: "PHC",
      taluk: `${district.name} North Block`,
      lat: Number((lat + 0.08).toFixed(4)),
      lng: Number((lng - 0.05).toFixed(4)),
      contact: `+91 20 2234 ${Math.floor(1000 + Math.random() * 9000)}`,
      timing: "09:00 AM - 02:00 PM (Emergency 24x7)",
      has_cold_chain: true,
      catchment_population: 48000,
      distance_from_wh_km: 18,
    },
    {
      id: `PHC-${district.id}-02`,
      state_id: district.state_id,
      district_id: district.id,
      name: `PHC ${district.name} Rural`,
      type: "PHC",
      taluk: `${district.name} Rural Block`,
      lat: Number((lat - 0.07).toFixed(4)),
      lng: Number((lng + 0.09).toFixed(4)),
      contact: `+91 20 2234 ${Math.floor(1000 + Math.random() * 9000)}`,
      timing: "09:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 54000,
      distance_from_wh_km: 26,
    },
    {
      id: `PHC-${district.id}-03`,
      state_id: district.state_id,
      district_id: district.id,
      name: `PHC ${district.name} East`,
      type: "PHC",
      taluk: `${district.name} East Block`,
      lat: Number((lat + 0.04).toFixed(4)),
      lng: Number((lng + 0.12).toFixed(4)),
      contact: `+91 20 2234 ${Math.floor(1000 + Math.random() * 9000)}`,
      timing: "09:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 43000,
      distance_from_wh_km: 34,
    },
    {
      id: `PHC-${district.id}-04`,
      state_id: district.state_id,
      district_id: district.id,
      name: `PHC ${district.name} South`,
      type: "PHC",
      taluk: `${district.name} South Block`,
      lat: Number((lat - 0.11).toFixed(4)),
      lng: Number((lng - 0.06).toFixed(4)),
      contact: `+91 20 2234 ${Math.floor(1000 + Math.random() * 9000)}`,
      timing: "09:00 AM - 02:00 PM",
      has_cold_chain: true,
      catchment_population: 61000,
      distance_from_wh_km: 41,
    },
  ];
}

// Helper: Generate active stock batches for a dynamically generated district
export function getBatchesForDistrict(districtFacilities = [], baseBatches = []) {
  if (districtFacilities.length === 0) return [];
  const facilityIds = new Set(districtFacilities.map((f) => f.id));

  // Check if we have curated batches
  const existing = baseBatches.filter((b) => facilityIds.has(b.facility_id));
  if (existing.length > 0) return existing;

  const batches = [];
  const wh = districtFacilities.find((f) => f.type === "WAREHOUSE") || districtFacilities[0];
  const phcs = districtFacilities.filter((f) => f.type === "PHC");

  if (wh) {
    batches.push(
      {
        batch_no: `${wh.id.slice(0, 10)}-RL-101`,
        medicine_id: "MED-04",
        facility_id: wh.id,
        quantity: 1400,
        mfd: "2024-03-10",
        expiry: "2026-11-15",
        days_to_expiry: 49,
        status: "IMMINENT_EXPIRY_RISK",
        unit_cost_inr: 48,
      },
      {
        batch_no: `${wh.id.slice(0, 10)}-ORS-102`,
        medicine_id: "MED-02",
        facility_id: wh.id,
        quantity: 3500,
        mfd: "2024-04-10",
        expiry: "2026-12-20",
        days_to_expiry: 84,
        status: "HEALTHY",
        unit_cost_inr: 8,
      },
      {
        batch_no: `${wh.id.slice(0, 10)}-PCM-103`,
        medicine_id: "MED-01",
        facility_id: wh.id,
        quantity: 4000,
        mfd: "2024-08-15",
        expiry: "2027-08-15",
        days_to_expiry: 688,
        status: "HEALTHY",
        unit_cost_inr: 6,
      },
      {
        batch_no: `${wh.id.slice(0, 10)}-ASV-104`,
        medicine_id: "MED-13",
        facility_id: wh.id,
        quantity: 30,
        mfd: "2024-07-01",
        expiry: "2026-12-15",
        days_to_expiry: 79,
        status: "HEALTHY",
        unit_cost_inr: 450,
      }
    );
  }

  phcs.forEach((phc, idx) => {
    if (idx === 0) {
      // Primary Outbreak hotspot PHC (Low RL, low ASV, high PCM)
      batches.push(
        {
          batch_no: `${phc.id.slice(0, 10)}-RL-901`,
          medicine_id: "MED-04",
          facility_id: phc.id,
          quantity: 28,
          mfd: "2025-01-15",
          expiry: "2027-01-15",
          days_to_expiry: 475,
          status: "CRITICAL_STOCKOUT_RISK",
          unit_cost_inr: 48,
        },
        {
          batch_no: `${phc.id.slice(0, 10)}-PCM-902`,
          medicine_id: "MED-01",
          facility_id: phc.id,
          quantity: 1800,
          mfd: "2024-11-10",
          expiry: "2027-11-10",
          days_to_expiry: 775,
          status: "HEALTHY",
          unit_cost_inr: 6,
        },
        {
          batch_no: `${phc.id.slice(0, 10)}-ORS-903`,
          medicine_id: "MED-02",
          facility_id: phc.id,
          quantity: 500,
          mfd: "2024-06-12",
          expiry: "2027-06-12",
          days_to_expiry: 620,
          status: "HEALTHY",
          unit_cost_inr: 8,
        },
        {
          batch_no: `${phc.id.slice(0, 10)}-ASV-904`,
          medicine_id: "MED-13",
          facility_id: phc.id,
          quantity: 2,
          mfd: "2024-09-01",
          expiry: "2026-10-20",
          days_to_expiry: 23,
          status: "CRITICAL_STOCKOUT_RISK",
          unit_cost_inr: 450,
        }
      );
    } else if (idx === 1) {
      // PHC 2: Chronic NCD surplus near expiry Metformin, healthy ORS & PCM
      batches.push(
        {
          batch_no: `${phc.id.slice(0, 10)}-MET-301`,
          medicine_id: "MED-08",
          facility_id: phc.id,
          quantity: 2400,
          mfd: "2024-04-15",
          expiry: "2026-11-20",
          days_to_expiry: 54,
          status: "IMMINENT_EXPIRY_RISK",
          unit_cost_inr: 12,
        },
        {
          batch_no: `${phc.id.slice(0, 10)}-PCM-302`,
          medicine_id: "MED-01",
          facility_id: phc.id,
          quantity: 1100,
          mfd: "2024-10-01",
          expiry: "2027-10-01",
          days_to_expiry: 735,
          status: "HEALTHY",
          unit_cost_inr: 6,
        },
        {
          batch_no: `${phc.id.slice(0, 10)}-ORS-303`,
          medicine_id: "MED-02",
          facility_id: phc.id,
          quantity: 750,
          mfd: "2024-08-10",
          expiry: "2026-12-10",
          days_to_expiry: 74,
          status: "HEALTHY",
          unit_cost_inr: 8,
        }
      );
    } else if (idx === 2) {
      // PHC 3: Antibiotic + Rabies Vaccine + PCM
      batches.push(
        {
          batch_no: `${phc.id.slice(0, 10)}-AMX-501`,
          medicine_id: "MED-03",
          facility_id: phc.id,
          quantity: 650,
          mfd: "2024-09-01",
          expiry: "2026-12-01",
          days_to_expiry: 65,
          status: "HEALTHY",
          unit_cost_inr: 22,
        },
        {
          batch_no: `${phc.id.slice(0, 10)}-ARV-502`,
          medicine_id: "MED-14",
          facility_id: phc.id,
          quantity: 12,
          mfd: "2024-09-20",
          expiry: "2026-12-10",
          days_to_expiry: 74,
          status: "LIMITED_STOCK",
          unit_cost_inr: 320,
        },
        {
          batch_no: `${phc.id.slice(0, 10)}-PCM-503`,
          medicine_id: "MED-01",
          facility_id: phc.id,
          quantity: 900,
          mfd: "2024-10-15",
          expiry: "2027-10-15",
          days_to_expiry: 750,
          status: "HEALTHY",
          unit_cost_inr: 6,
        }
      );
    } else {
      // PHC 4 & others: Maternal health (IFA, Calcium) + fever essentials
      batches.push(
        {
          batch_no: `${phc.id.slice(0, 10)}-IFA-701`,
          medicine_id: "MED-11",
          facility_id: phc.id,
          quantity: 1200,
          mfd: "2024-05-10",
          expiry: "2027-05-10",
          days_to_expiry: 590,
          status: "HEALTHY",
          unit_cost_inr: 4,
        },
        {
          batch_no: `${phc.id.slice(0, 10)}-PCM-702`,
          medicine_id: "MED-01",
          facility_id: phc.id,
          quantity: 800,
          mfd: "2024-10-10",
          expiry: "2027-10-10",
          days_to_expiry: 745,
          status: "HEALTHY",
          unit_cost_inr: 6,
        },
        {
          batch_no: `${phc.id.slice(0, 10)}-ORS-703`,
          medicine_id: "MED-02",
          facility_id: phc.id,
          quantity: 420,
          mfd: "2024-07-15",
          expiry: "2026-11-20",
          days_to_expiry: 54,
          status: "HEALTHY",
          unit_cost_inr: 8,
        }
      );
    }
  });

  return batches;
}

// Master Helper: Return all 655 facilities across all 131 districts
export function getAllFacilities(baseFacilities = []) {
  const all = [];
  ALL_DISTRICTS.forEach((d) => {
    const districtFacs = getFacilitiesForDistrict(d.id, baseFacilities);
    all.push(...districtFacs);
  });
  return all;
}

// Master Helper: Return all batches across all facilities
export function getAllBatches(allFacilities = [], baseBatches = []) {
  const all = [...baseBatches];
  const coveredFacilityIds = new Set(baseBatches.map((b) => b.facility_id));

  ALL_DISTRICTS.forEach((d) => {
    const districtFacs = allFacilities.filter((f) => f.district_id === d.id);
    const hasExisting = districtFacs.some((f) => coveredFacilityIds.has(f.id));
    if (!hasExisting && districtFacs.length > 0) {
      const generatedBatches = getBatchesForDistrict(districtFacs, baseBatches);
      all.push(...generatedBatches);
    }
  });
  return all;
}

