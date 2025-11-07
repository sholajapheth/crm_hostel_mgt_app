export interface Applicant {
  id: number;
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
  id: number;
  memberId: number;
  name: string;
  gender: string;
  email: string;
  zoneId: number;
  fellowshipId: number;
  isAdmin: boolean;
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
  memberId: number;
  zoneId: number;
  fellowshipId: number;
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
}
