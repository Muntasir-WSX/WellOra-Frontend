import { apiRequest } from "@/lib/api";

export interface IMedicine {
  name: string;
  dosage: string;
  duration: string;
  instructions?: string;
}

export interface ICreatePrescriptionPayload {
  appointmentId: string;
  findings: string;
  medicines: IMedicine[];
}

export interface IPrescriptionResponse {
  appointment: {
    id: string;
    status: string;
    prescriptionUrl: string;
    prescriptionPublicId?: string | null;
    patient?: {
      id: string;
      name: string;
    };
    doctor?: {
      id: string;
      name: string;
      specialization?: string;
    };
  };
  prescription: string; // Cloudinary PDF secure_url
}

export const createPrescriptionApi = async (
  payload: ICreatePrescriptionPayload,
) => {
  return apiRequest("/prescription/create-prescription", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getSinglePrescriptionApi = async (appointmentId: string) => {
  const res = await apiRequest<{ data: IPrescriptionResponse }>(
    `/prescription/${encodeURIComponent(appointmentId)}`,
    {
      method: "GET",
    },
  );
  return res?.data;
};