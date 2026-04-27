export type FormDataType = {
  credentials: {
    userType: string;
    username: string;
    password: string;
  };
  accountManager: {
    fullName?: string;
    designation?: string;
    email?: string;
    altEmail?: string;
    phone?: string;
    altPhone?: string;
  };
  entity: {
    entityName?: string;
    substation?: string;
    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;
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
  qcaDetails: {
    licenseNumber?: string;
    managedStations?: string;
  };
};