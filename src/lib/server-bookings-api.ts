import { serverFetch } from "./server-api";

export async function getServerBookingById(id: string) {
  const res = await serverFetch(`/bookings/${id}`);

  if (!res.ok) {
    return null;
  }

  return res.json();
}
