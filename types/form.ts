export type CredentialsType = {
  username: string;
  password: string;
};

export type AccountManagerType = {
  name?: string;
  email?: string;
  phone?: string;
};

export type EntityType = {
  rldc: string;
};

export type AssociateManagerType = {
  name: string;
  designation: string;
  email: string;
  phone: string;
};

export type MeterType = {
  meterNo: string;
  meterOwner: string;
};

export type QCADetailsType = {
  licenseNumber: string;
  managedStations: string;
};

export type FormDataType = {
  userType: string;
  role: string;

  credentials: CredentialsType;
  accountManager: AccountManagerType;
  entity: EntityType;

  associateManagers: AssociateManagerType[];
  meters: MeterType[];

  qcaDetails?: QCADetailsType; // ✅ optional
};