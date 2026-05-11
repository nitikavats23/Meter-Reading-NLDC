export type AccountManagerType = {
  fullName: string;
  designation: string;
  email: string;
  altEmail?: string;
  phone: string;
  altPhone?: string;
};

// --- NAYA ADD KIYA GAYA HAI ---
export type OwnerDetailsType = {
  role: string;
  managedStations: string;
  licenseNumber: string;
};

export type QCADetailsType = {
  licenseNumber: string;
  managedStations?: string;
};

export type FormDataType = {
  userType: string;
  role: string; // Root level role (Section A)

  credentials: {
    username: string;
    password: string;
  };

  accountManager: AccountManagerType;

  entity: {
    entityName: string;
    substation: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    rldc: string;
    role?: string; // Entity details wala role dropdown
  };

  associateManagers: {
    name?: string;
    designation?: string;
    email?: string;
    phone?: string;
  }[];

  meters: {
    meterNo: string;
    meterOwner: string;
    feederName: string;
    type: string;
    technology: string;
    make: string;
    model: string;
    fromDate: string;
    locationId?: string;
  }[];

  qcaDetails?: QCADetailsType; 
  
  // --- NAYA ADD KIYA GAYA HAI ---
  ownerDetails?: OwnerDetailsType; 
};