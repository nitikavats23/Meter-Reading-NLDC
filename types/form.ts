export type AccountManagerType = {
  fullName: string;
  designation: string;
  email: string;
  altEmail?: string;
  phone: string;
  altPhone?: string;
};

export type QCADetailsType = {
  licenseNumber: string;
  managedStations?: string;
};

export type FormDataType = {
  userType: string;
  role: string;

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
  };

  associateManagers: {
    name?: string;
    designation?: string;
    email?: string;
    phone?: string;
  }[];

  // UPDATED METERS TYPE HERE
  meters: {
    meterNo: string;      // Required
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
};