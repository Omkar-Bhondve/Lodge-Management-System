import LodgingCard from "./LodgingCard";
import { useRooms } from "../hooks/useRooms";

export default function RoomCollection({ featured = false, search = "", type = "", emptyMessage = "No stays match your search." }) {
  const { rooms, loading, error } = useRooms({ featured: featured || undefined, search: search || undefined, type: type || undefined });
  if (loading) return <p className="py-10 text-center text-sm text-slate-500">Loading stays…</p>;
  if (error) return <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>;
  if (!rooms.length) return <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">{emptyMessage}</p>;
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{rooms.map((room) => <LodgingCard key={room.id} lodge={room} />)}</div>;
}
