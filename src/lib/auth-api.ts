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
