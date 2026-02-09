import { api } from "./api";

export async function login(payload: {
  email: string;
  password: string;
}) {
  const res = await api.post("/auth/login", payload);
  return res.data;
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function forgotPassword(payload: { email: string }) {
  const res = await api.post("/auth/forgot-password", payload);
  return res.data;
}

export async function resetPassword(payload: {
  token: string;
  newPassword: string;
}) {
  const res = await api.post("/auth/reset-password", payload);
  return res.data;
}
