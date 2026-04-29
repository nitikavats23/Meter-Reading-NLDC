export type MeterType = {
  id: string;
  meterNo: string;
  meterOwner: string;
};

export type ProfileType = {
  fullName: string;
  email: string;
  phone: string;
};

export type EntityType = {
  entityName: string;
  substation: string;
};

export type UserType = {
  id: string;
  username: string;
  userType: string;
  profile?: ProfileType;
  entity?: EntityType;
  meters: MeterType[];
};

export type ApprovalType = {
  id: string;
  status: string;
  user: UserType;
};