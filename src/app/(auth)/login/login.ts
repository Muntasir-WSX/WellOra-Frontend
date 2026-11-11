import { apiRequest } from "@/lib/api";

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ILoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export const loginUserApi = async (
  payload: ILoginPayload,
): Promise<ILoginResponse> => {
  return apiRequest<ILoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
