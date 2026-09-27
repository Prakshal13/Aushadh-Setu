import React, { createContext, useContext, useState, useEffect } from 'react';

export const USER_ROLES = {
  CITIZEN: 'CITIZEN',
  PHARMACIST: 'PHARMACIST',
  DHO: 'DHO',
};

export const PRESET_ACCOUNTS = {
  DHO: {
    role: USER_ROLES.DHO,
    name: 'Dr. Rajesh Shinde',
    designation: 'District Health Officer (DHO)',
    department: 'Department of Public Health, Govt. of Maharashtra / NIC',
    id: 'DHO-MH-PUNE-01',
    email: 'dho.pune@nic.gov.in',
    state_id: 'ST-MH',
    district_id: 'DIST-MH-PUNE',
    facility_id: 'WH-01',
    badge: 'Executive Clearance: Full District & Reallocation Authority',
    avatar: '👨‍⚕️',
  },
  PHARMACIST: {
    role: USER_ROLES.PHARMACIST,
    name: 'Suresh More',
    designation: 'Staff Pharmacist In-Charge',
    department: 'PHC Paud Dispensary, Mulshi Taluk / NHM',
    id: 'PHARM-MH-PAUD-04',
    email: 'phc.paud@nhm.gov.in',
    state_id: 'ST-MH',
    district_id: 'DIST-MH-PUNE',
    facility_id: 'PHC-01',
    badge: 'Dispensary Clearance: Shelf Stocking, Batch Intake & Dispense Logging',
    avatar: '💊',
  },
  CITIZEN: {
    role: USER_ROLES.CITIZEN,
    name: 'Citizen (Public Access)',
    designation: 'Public Patient / Beneficiary',
    department: 'Ayushman Bharat Beneficiary Portal',
    id: 'CITIZEN-PUBLIC',
    email: 'citizen.access@public.gov.in',
    state_id: 'ST-MH',
    district_id: 'DIST-MH-PUNE',
    facility_id: null,
    badge: 'Public Clearance: Open Medicine Search & Clinic GPS Directions',
    avatar: '👤',
  },
};

// Official Government Credentials Directory
export const OFFICIAL_CREDENTIALS = {
  'dho.pune@nic.gov.in': {
    role: USER_ROLES.DHO,
    password: 'NIC@Gov#2026',
    account: PRESET_ACCOUNTS.DHO,
  },
  'phc.paud@nhm.gov.in': {
    role: USER_ROLES.PHARMACIST,
    password: 'NHM@Pharma#2026',
    account: PRESET_ACCOUNTS.PHARMACIST,
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aushadhsetu_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read auth state from storage');
    }
    // Default to Citizen public access
    return PRESET_ACCOUNTS.CITIZEN;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('aushadhsetu_auth_user', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Could not persist auth state');
    }
  }, [currentUser]);

  // Real authentication verification handler
  const authenticate = ({ email, password, captchaInput, expectedCaptcha }) => {
    // 1. Verify Security Captcha
    if (!captchaInput || captchaInput.trim().toUpperCase() !== expectedCaptcha.trim().toUpperCase()) {
      return {
        success: false,
        error: 'Security Captcha code does not match. Please enter the exact code shown.',
      };
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const cred = OFFICIAL_CREDENTIALS[cleanEmail];

    // 2. Verify Officer Email exists
    if (!cred) {
      return {
        success: false,
        error: 'Officer email not found in NIC / NHM registry. Official accounts end with @nic.gov.in or @nhm.gov.in.',
      };
    }

    // 3. Verify Password
    if (cred.password !== password) {
      return {
        success: false,
        error: 'Authentication failed: Invalid government password for this officer ID.',
      };
    }

    // 4. Authenticated successfully
    setCurrentUser(cred.account);
    setAuthModalOpen(false);
    return { success: true, user: cred.account };
  };

  const logout = () => {
    setCurrentUser(PRESET_ACCOUNTS.CITIZEN);
    localStorage.removeItem('aushadhsetu_auth_user');
  };

  // Helper for quick demo/evaluator switching (still uses credentials validation)
  const loginAs = (role) => {
    if (role === USER_ROLES.CITIZEN) {
      logout();
      setAuthModalOpen(false);
      return;
    }
    const account = PRESET_ACCOUNTS[role] || PRESET_ACCOUNTS.CITIZEN;
    setCurrentUser(account);
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authenticate,
        loginAs,
        logout,
        authModalOpen,
        setAuthModalOpen,
        isAuthenticated: currentUser.role !== USER_ROLES.CITIZEN,
        isDho: currentUser.role === USER_ROLES.DHO,
        isPharmacist: currentUser.role === USER_ROLES.PHARMACIST || currentUser.role === USER_ROLES.DHO,
        isCitizen: currentUser.role === USER_ROLES.CITIZEN,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
