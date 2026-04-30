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

  meters: {
    meterNo: string;
    meterOwner?: string;
  }[];

  qcaDetails?: QCADetailsType; // 👈 optional (important)
};