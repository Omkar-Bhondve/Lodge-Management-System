import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRoom } from "../hooks/useRooms";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { Banknote, CalendarDays, ChevronLeft, Users } from "lucide-react";

const money = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
const SERVICE_FEE = 380;

export default function BookingPage() {
  const { id: slug } = useParams();
  const { room, loading, error } = useRoom(slug);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <main className="p-20 text-center text-slate-500">Loading booking details…</main>;
  if (error || !room) return <main className="p-20 text-center text-slate-500">{error || "Room not found."}</main>;

  const nights = checkIn && checkOut ? Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 0;
  const subtotal = nights * Number(room.price);
  const total = subtotal + (nights > 0 ? SERVICE_FEE : 0);

  const book = async (event) => {
    event.preventDefault();
    if (!user) return navigate("/login");
    setSubmitting(true); setMessage("");
    try {
      await api("/bookings", { method: "POST", body: JSON.stringify({ roomId: room.id, checkIn, checkOut, guests: Number(guests) }) });
      navigate("/my-bookings");
    } catch (err) { setMessage(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
      <Link to={`/lodgings/${room.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
        <ChevronLeft size={16} /> Back to stay
      </Link>

      <div className="mt-6 grid gap-9 lg:grid-cols-[1fr_340px]">
        <form onSubmit={book}>
          <p className="text-sm font-semibold text-emerald-700">COMPLETE YOUR BOOKING</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Reserve {room.name}</h1>

          {/* Pay at counter notice */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <Banknote className="mt-0.5 shrink-0 text-amber-600" size={20} />
            <div>
              <p className="font-semibold text-amber-800">Payment at the counter only</p>
              <p className="mt-0.5 text-sm text-amber-700">Online payment is not available at this time. Please pay in full at the lodge reception upon check-in. Your booking will be held as <span className="font-semibold">pending</span> until confirmed by the lodge.</p>
            </div>
          </div>

          {/* Dates & guests */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700"><CalendarDays size={15} />Check-in</span>
              <input required type="date" min={new Date().toISOString().slice(0, 10)} value={checkIn}
                onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(""); }}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700"><CalendarDays size={15} />Check-out</span>
              <input required type="date" min={checkIn || new Date().toISOString().slice(0, 10)} value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700"><Users size={15} />Guests (max {room.guests})</span>
              <input required type="number" min="1" max={room.guests} value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            </label>
          </div>

          {message && <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{message}</p>}

          <button disabled={submitting} className="mt-7 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60">
            {submitting ? "Reserving…" : "Confirm booking"}
          </button>
          <p className="mt-3 text-xs text-slate-400">You won't be charged online. Payment is collected at the lodge.</p>
        </form>

        {/* Summary sidebar */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
          <img src={room.image} alt="" className="h-40 w-full rounded-xl object-cover" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{room.type}</p>
          <h2 className="mt-0.5 font-bold text-slate-900">{room.name}</h2>
          <p className="text-sm text-slate-500">{room.location}</p>

          <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>{money(room.price)} × {nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "— nights"}</span>
              <span>{nights > 0 ? money(subtotal) : "—"}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Service fee</span>
              <span>{nights > 0 ? money(SERVICE_FEE) : "—"}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2.5 font-bold text-slate-900">
              <span>Total</span>
              <span>{nights > 0 ? money(total) : "—"}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700">
            <Banknote size={15} className="shrink-0" />
            Pay at the counter on check-in
          </div>
        </aside>
      </div>
    </main>
  );
}
