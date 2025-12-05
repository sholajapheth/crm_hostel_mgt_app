export interface Applicant {
  id: string;
  memberId: string;
  name: string;
  gender: string;
  email: string;
  zone: string;
  fellowship: string;
  state: string;
  hostelAssigned: boolean;
  hostelName: string | null;
}

export interface AdminUser {
  id: string;
  memberId: string;
  name: string;
  gender: string;
  email: string;
  zoneId: string;
  fellowshipId: string;
  isAdmin: boolean;
  role: string;
  status: string;
}

export interface ApplicantFilters {
  searchTerm?: string;
  gender?: "male" | "female" | "all";
  zoneId?: number;
  state?: string;
}

export interface CreateAdminUserRequest {
  name: string;
  gender: string;
  email: string;
  password: string;
  memberId: string;
  zoneId: string;
  fellowshipId: string;
  isAdmin: boolean;
}

export interface UpdateAdminUserRequest {
  name?: string;
  gender?: string;
  email?: string;
  password?: string;
  memberId?: number;
  zoneId?: number;
  fellowshipId?: number;
  isAdmin?: boolean;
  status?: string;
  role?: string;
}
