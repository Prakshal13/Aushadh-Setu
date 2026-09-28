import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import PharmacistPortal from './components/PharmacistPortal';
import CitizenFinder from './components/CitizenFinder';
import DhoDashboard from './components/DhoDashboard';
import SimulationLab from './components/SimulationLab';
import PredictiveIntelligenceStudio from './components/PredictiveIntelligenceStudio';
import ErrorBoundary from './components/ErrorBoundary';
import HowItWorks from './components/HowItWorks';
import AboutPage from './components/AboutPage';
import BlogPage from './components/BlogPage';
import ContactPage from './components/ContactPage';
import AuthModal from './components/AuthModal';
import AccessDeniedCard from './components/AccessDeniedCard';
import LocationModal from './components/LocationModal';
import { AuthProvider, useAuth, USER_ROLES } from './context/AuthContext';
import { initialDistrictData } from './data/mockDistrictData';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { currentUser, isDho, isCitizen } = useAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'landing';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedState, setSelectedState] = useState('ST-MH');
  const [selectedDistrict, setSelectedDistrict] = useState('DIST-MH-PUNE');
  const [selectedFacility, setSelectedFacility] = useState('PHC-01');
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Shared Epidemiological Outbreak Influx State across DHO Dashboard and Predictive Studio
  const [outbreakSurgePercent, setOutbreakSurgePercent] = useState(40);
  const [outbreakFieldCases, setOutbreakFieldCases] = useState(56);

  // Phase 4: Shared Peer-to-Peer Redistribution State linking DHO -> Pharmacist -> Citizen
  const [transfers, setTransfers] = useState([
    {
      id: 'TR-01',
      medicine: 'Ringer Lactate (RL) 500ml IV Infusion',
      medicine_id: 'MED-04',
      donor_id: 'WH-01',
      donor: 'District Central Warehouse (Aundh)',
      donor_stock: '1,400 units (Expiring in 40 days)',
      recipient_id: 'PHC-01',
      recipient: 'PHC Paud (Mulshi Taluk)',
      recipient_stock: '25 units (DSR: 0.8 days - CRITICAL)',
      recommended_transfer: '350 units',
      quantity: 350,
      distance_km: 24,
      transit_time_mins: 42,
      cold_chain: false,
      urgency: 'CRITICAL',
      status: 'RECOMMENDED', // 'RECOMMENDED' -> 'APPROVED_BY_DHO' -> 'RECEIVED_AND_RESTOCKED'
      dispatch_id: null,
      dispatched_at: null,
      received_at: null,
      rationale: 'Surge in Dengue cases (+40%, 56 admissions) will deplete PHC Paud in ~18 hours. Warehouse holds surplus batches near expiry.',
    },
    {
      id: 'TR-02',
      medicine: 'Metformin Hydrochloride 500mg Tablets',
      medicine_id: 'MED-08',
      donor_id: 'PHC-02',
      donor: 'PHC Shirur (Shirur Taluk)',
      donor_stock: '3,800 units (Expiring in 50 days)',
      recipient_id: 'PHC-07',
      recipient: 'PHC Wagholi (Haveli Taluk)',
      recipient_stock: '180 units (DSR: 2.7 days)',
      recommended_transfer: '600 units',
      quantity: 600,
      distance_km: 48,
      transit_time_mins: 55,
      cold_chain: false,
      urgency: 'HIGH',
      status: 'RECOMMENDED',
      dispatch_id: null,
      dispatched_at: null,
      received_at: null,
      rationale: 'Wagholi clinic footfall running below 3 days safe buffer while Shirur holds surplus batch near 50-day expiry threshold.',
    },
  ]);

  const handleApproveTransfer = (id) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'APPROVED_BY_DHO',
              dispatched_at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              dispatch_id: `DISP-${Math.floor(1000 + Math.random() * 9000)}`,
            }
          : t
      )
    );
  };

  const handleReceiveTransfer = (id) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'RECEIVED_AND_RESTOCKED',
              received_at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            }
          : t
      )
    );
  };

  const states = initialDistrictData.states;
  const districts = initialDistrictData.districts;
  const facilities = initialDistrictData.facilities;

  // Helper to get first PHC for a district
  const getFirstPhcForDistrict = (districtId) => {
    const districtFacs = facilities.filter((f) => f.district_id === districtId);
    const phc = districtFacs.find((f) => f.type === 'PHC');
    return phc ? phc.id : districtFacs[0]?.id || '';
  };

  // Handler for state change: cascades down to district and PHC
  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
    const targetState = states.find((s) => s.id === stateId);
    const newDistrictId = targetState?.flagship_district || targetState?.default_district || districts.find((d) => d.state_id === stateId)?.id;
    if (newDistrictId) {
      setSelectedDistrict(newDistrictId);
      const newFacId = getFirstPhcForDistrict(newDistrictId);
      if (newFacId) setSelectedFacility(newFacId);
    }
  };

  // Handler for district change: cascades down to state and PHC
  const handleDistrictChange = (districtId) => {
    const targetDistrict = districts.find((d) => d.id === districtId);
    if (targetDistrict) {
      setSelectedDistrict(targetDistrict.id);
      setSelectedState(targetDistrict.state_id);
      const newFacId = getFirstPhcForDistrict(targetDistrict.id);
      if (newFacId) setSelectedFacility(newFacId);
    }
  };

  // Handler for direct facility change
  const handleFacilityChange = (facilityId) => {
    setSelectedFacility(facilityId);
    const targetFac = facilities.find((f) => f.id === facilityId);
    if (targetFac) {
      if (targetFac.district_id !== selectedDistrict) {
        setSelectedDistrict(targetFac.district_id);
      }
      if (targetFac.state_id !== selectedState) {
        setSelectedState(targetFac.state_id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      {/* Universal Floating Pill Navbar for ALL pages */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLocationModal={() => setLocationModalOpen(true)}
        selectedDistrict={selectedDistrict}
        selectedState={selectedState}
      />

      {/* Role-Based Authentication Clearance Modal */}
      <AuthModal />

      {/* Geospatial GPS Auto-Detect & 131-District Selection Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        selectedState={selectedState}
        onSelectState={handleStateChange}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={handleDistrictChange}
        selectedFacility={selectedFacility}
        onSelectFacility={handleFacilityChange}
      />

      {activeTab === 'landing' ? (
        <LandingPage
          setActiveTab={setActiveTab}
          onOpenLocationModal={() => setLocationModalOpen(true)}
          selectedDistrict={selectedDistrict}
          selectedState={selectedState}
        />
      ) : (
        <>
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 min-w-0">
            <ErrorBoundary onReset={() => setActiveTab('landing')}>
              {activeTab === 'citizen' && (
                <CitizenFinder
                  selectedState={selectedState}
                  setSelectedState={handleStateChange}
                  selectedDistrict={selectedDistrict}
                  setSelectedDistrict={handleDistrictChange}
                  selectedFacility={selectedFacility}
                  setSelectedFacility={handleFacilityChange}
                  onOpenLocationModal={() => setLocationModalOpen(true)}
                  transfers={transfers}
                />
              )}
              {activeTab === 'pharmacist' && (
                !isCitizen ? (
                  <PharmacistPortal
                    selectedState={selectedState}
                    setSelectedState={handleStateChange}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={handleDistrictChange}
                    selectedFacility={selectedFacility}
                    setSelectedFacility={handleFacilityChange}
                    setActiveTab={setActiveTab}
                    transfers={transfers}
                    onReceiveTransfer={handleReceiveTransfer}
                  />
                ) : (
                  <AccessDeniedCard requiredRole={USER_ROLES.PHARMACIST} onSwitchTab={setActiveTab} />
                )
              )}
              {activeTab === 'dho' && (
                isDho ? (
                  <DhoDashboard
                    selectedState={selectedState}
                    setSelectedState={handleStateChange}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={handleDistrictChange}
                    selectedFacility={selectedFacility}
                    setSelectedFacility={handleFacilityChange}
                    setActiveTab={setActiveTab}
                    surgePercent={outbreakSurgePercent}
                    setSurgePercent={setOutbreakSurgePercent}
                    fieldCases={outbreakFieldCases}
                    setFieldCases={setOutbreakFieldCases}
                    transfers={transfers}
                    onApproveTransfer={handleApproveTransfer}
                    onReceiveTransfer={handleReceiveTransfer}
                  />
                ) : (
                  <AccessDeniedCard requiredRole={USER_ROLES.DHO} onSwitchTab={setActiveTab} />
                )
              )}
              {activeTab === 'forecast' && (
                isDho ? (
                  <PredictiveIntelligenceStudio
                    selectedState={selectedState}
                    setSelectedState={handleStateChange}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={handleDistrictChange}
                    selectedFacility={selectedFacility}
                    setSelectedFacility={handleFacilityChange}
                    surgePercent={outbreakSurgePercent}
                    setSurgePercent={setOutbreakSurgePercent}
                    fieldCases={outbreakFieldCases}
                    setFieldCases={setOutbreakFieldCases}
                  />
                ) : (
                  <AccessDeniedCard requiredRole={USER_ROLES.DHO} onSwitchTab={setActiveTab} />
                )
              )}
              {activeTab === 'simulation' && (
                isDho ? (
                  <SimulationLab
                    selectedState={selectedState}
                    setSelectedState={handleStateChange}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={handleDistrictChange}
                    selectedFacility={selectedFacility}
                    setSelectedFacility={handleFacilityChange}
                  />
                ) : (
                  <AccessDeniedCard requiredRole={USER_ROLES.DHO} onSwitchTab={setActiveTab} />
                )
              )}
              {activeTab === 'how-it-works' && (
                <HowItWorks setActiveTab={setActiveTab} />
              )}
              {activeTab === 'about' && (
                <AboutPage setActiveTab={setActiveTab} />
              )}
              {activeTab === 'blog' && (
                <BlogPage setActiveTab={setActiveTab} />
              )}
              {activeTab === 'contact' && (
                <ContactPage setActiveTab={setActiveTab} />
              )}
            </ErrorBoundary>
          </main>

          <footer className="bg-[#FAF8F5] border-t border-[#EBE4D8] py-8 text-xs text-text-muted mt-auto">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-text-obsidian">Aushadh Setu (औषध सेतु)</span>
                <span className="text-stone-300">•</span>
                <span>National Outbreak-Aware Medicine Supply & Redistribution Grid</span>
              </div>
              <div className="text-text-subtle text-[11px]">
                Active Pilot States: Maharashtra, Rajasthan, Delhi, Uttarakhand & Tamil Nadu • C-DAC e-Aushadhi Compatible Architecture
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
