import { api } from "./api";

export type BookingStatus =
  | "CONFIRMED"
  | "PARTIAL_PAID"
  | "FULLY_PAID"
  | "CANCELLED";

export async function getBookings() {
  const res = await api.get("/bookings");
  return res.data;
}

export async function getBookingById(id: string) {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
}

export async function updateBooking(
  id: string,
  payload: {
    totalAmount?: number;
    paidAmount?: number;
    travelDate?: string;
    travelers?: number;
    destinationId?: string;
    packageId?: string;
  }
) {
  const res = await api.patch(`/bookings/${id}`, payload);
  return res.data;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
) {
  const res = await api.patch(`/bookings/${id}/status`, { status });
  return res.data;
}
