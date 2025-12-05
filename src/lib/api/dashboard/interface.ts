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
  id: string;
  name: string;
  gender: string;
  email: string;
  zone: string;
  fellowship: string;
  hostelAssigned: boolean;
  hostelName: string | null;
}

export interface DashboardAnnouncement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  createdBy: string;
}
