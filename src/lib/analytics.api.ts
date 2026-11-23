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

export interface IDoctorAnalytics {
  totalSchedules: number;
  publishedSchedules: number;
  totalAppointments: number;
  upcomingAppointments: number;
  ongoingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalDoctorEarnings: number;
  totalDoctorRefunded: number;
}

export const getAdminAnalyticsApi = async (): Promise<IAdminAnalytics> => {
  const res = await apiRequest<{ success?: boolean; data: IAdminAnalytics }>(
    "/analytics/admin-analytics",
    {
    method: "GET",
    },
  );
  if (!res?.data) {
    throw new Error("Failed to load admin analytics");
  }
  return res.data;
};

export const getDoctorAnalyticsApi = async (): Promise<IDoctorAnalytics> => {
  const res = await apiRequest<{
    success?: boolean;
    message?: string;
    data: IDoctorAnalytics;
  }>("/analytics/doctor-analytics", {
    method: "GET",
  });

  if (!res?.data) {
    throw new Error(res?.message || "Failed to load doctor analytics");
  }

  return res.data;
};