import { apiRequest } from "@/lib/api";

export interface IAdminAnalytics {
  totalDoctors: number;
  totalPendingDoctorApplications: number;
  totalApprovedDoctors: number;
  totalRejectedDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalCompletedAppointments: number;
  totalCancelledAppointments: number;
  totalRevenue: number;
  totalRefunded: number;
}

export const getAdminAnalyticsApi = async (): Promise<IAdminAnalytics> => {
  const res = await apiRequest("/analytics/admin-analytics", {
    method: "GET",
  });
  return res?.data;
};