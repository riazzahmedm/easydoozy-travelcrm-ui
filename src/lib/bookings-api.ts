import { api } from "./api";

export async function getBookings() {
  const res = await api.get("/bookings");
  return res.data;
}

export async function getBookingById(id: string) {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
}