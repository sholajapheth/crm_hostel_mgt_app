export type {
  DashboardSummary,
  GenderDistributionEntry,
  DashboardRecentUser,
  DashboardAnnouncement,
} from "./interface";

export { httpClient } from "./httpClient";

export {
  dashboardKeys,
  useDashboardSummary,
  useGenderDistribution,
  useRecentUsers,
  useLatestAnnouncements,
} from "./queries";
