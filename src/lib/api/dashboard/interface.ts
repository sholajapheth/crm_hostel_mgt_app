export interface DashboardSummary {
  totalUsers: number;
  assignedUsers: number;
  totalHostels: number;
  zonesCount: number;
  occupancyRate: number;
}

export interface GenderDistributionEntry {
  name: string;
  value: number;
}

export interface DashboardRecentUser {
  id: number;
  name: string;
  gender: string;
  email: string;
  zone: string;
  fellowship: string;
  hostelAssigned: boolean;
  hostelName: string | null;
}

export interface DashboardAnnouncement {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  createdBy: string;
}
