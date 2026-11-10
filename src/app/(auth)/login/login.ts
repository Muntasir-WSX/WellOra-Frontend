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

export const loginUserApi = async (payload: ILoginPayload): Promise<ILoginResponse> => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const response = await fetch(`${backendUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include", 
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Invalid credentials. Please try again.");
  }

  return data;
};