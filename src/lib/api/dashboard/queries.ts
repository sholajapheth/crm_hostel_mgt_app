import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type {
  DashboardSummary,
  GenderDistributionEntry,
  DashboardRecentUser,
  DashboardAnnouncement,
} from "./interface";

export const dashboardKeys = {
  summary: () => ["dashboard", "summary"] as const,
  genderDistribution: () => ["dashboard", "gender-distribution"] as const,
  recentUsers: () => ["dashboard", "recent-users"] as const,
  latestAnnouncements: () => ["dashboard", "latest-announcements"] as const,
};

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary, Error>({
    queryKey: dashboardKeys.summary(),
    queryFn: async () => {
      const response = await httpClient.get<DashboardSummary>(
        "/api/v3/admin/dashboard/summary"
      );
      return response.data;
    },
  });
};

export const useGenderDistribution = () => {
  return useQuery<GenderDistributionEntry[], Error>({
    queryKey: dashboardKeys.genderDistribution(),
    queryFn: async () => {
      const response = await httpClient.get<GenderDistributionEntry[]>(
        "/api/v3/admin/dashboard/gender-distribution"
      );
      return response.data;
    },
  });
};

export const useRecentUsers = () => {
  return useQuery<DashboardRecentUser[], Error>({
    queryKey: dashboardKeys.recentUsers(),
    queryFn: async () => {
      const response = await httpClient.get<DashboardRecentUser[]>(
        "/api/v3/admin/dashboard/recent-users"
      );
      return response.data;
    },
  });
};

export const useLatestAnnouncements = () => {
  return useQuery<DashboardAnnouncement[], Error>({
    queryKey: dashboardKeys.latestAnnouncements(),
    queryFn: async () => {
      const response = await httpClient.get<DashboardAnnouncement[]>(
        "/api/v3/admin/dashboard/latest-announcements"
      );
      return response.data;
    },
  });
};
