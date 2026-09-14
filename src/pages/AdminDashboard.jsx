import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const money = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const nights = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
};

const blankRoom = { name: "", slug: "", location: "", price: "", type: "Entire room", guests: 1, beds: 1, image: "", tag: "", description: "", isFeatured: false };

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState("bookings");
  const [dashboard, setDashboard] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [room, setRoom] = useState(blankRoom);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => Promise.all([
    api("/admin/dashboard"),
    api("/rooms"),
    api("/admin/bookings"),
  ]).then(([summary, roomList, bookingList]) => {
    setDashboard(summary.dashboard);
    setRooms(roomList.rooms);
    setBookings(bookingList.bookings);
  });

  useEffect(() => {
    if (user?.role === "admin") load().catch((e) => setMessage(e.message));
  }, [user]);

  if (authLoading) return <main className="p-20 text-center text-slate-500">Loading…</main>;
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;

  const update = (e) => setRoom((p) => ({ ...p, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const addRoom = async (e) => {
    e.preventDefault(); setSaving(true); setMessage("");
    try {
      await api("/rooms", { method: "POST", body: JSON.stringify({ ...room, slug: room.slug || room.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }) });
      setRoom(blankRoom); setMessage("Room added successfully."); load();
    } catch (err) { setMessage(err.message); }
    finally { setSaving(false); }
  };

  const changeStatus = async (id, status) => {
    try {
      await api(`/admin/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    } catch (err) { setMessage(err.message); }
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-emerald-700">ADMINISTRATION</p>
      <h1 className="mt-1 text-3xl font-bold">Lodge management</h1>

      {/* Stats */}
      {dashboard && (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total rooms", dashboard.roomCount],
            ["Registered users", dashboard.userCount],
            ["Active bookings", dashboard.activeBookingCount],
            ["Confirmed revenue", money(dashboard.revenue)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="mt-10 flex gap-1 border-b border-slate-200">
        {[["bookings", `Bookings (${bookings.length})`], ["rooms", "Rooms"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition ${tab === key ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <div className="mt-8">
          {message && <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{message}</p>}
          {!bookings.length ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <p className="font-semibold text-slate-700">No bookings yet</p>
              <p className="mt-1 text-sm text-slate-400">Bookings will appear here once users reserve rooms.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <article key={b.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="flex flex-col sm:flex-row">
                    {/* Room image */}
                    <img src={b.room_image} alt={b.room_name} className="h-40 w-full object-cover sm:h-auto sm:w-44 shrink-0" />

                    <div className="flex flex-1 flex-col gap-5 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        {/* Room info */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{b.room_type}</p>
                          <h2 className="mt-0.5 text-lg font-bold text-slate-900">{b.room_name}</h2>
                          <p className="text-sm text-slate-500">{b.room_location}</p>
                        </div>
                        {/* Status badge + changer */}
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                          <select
                            value={b.status}
                            onChange={(e) => changeStatus(b.id, e.target.value)}
                            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-4">
                        {/* Guest */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Guest</p>
                          <p className="mt-1 font-semibold text-slate-900">{b.first_name} {b.last_name}</p>
                          <p className="text-xs text-slate-400">{b.email}</p>
                          {b.phone && <p className="text-xs text-slate-400">{b.phone}</p>}
                        </div>
                        {/* Dates */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stay</p>
                          <p className="mt-1 font-semibold text-slate-900">{fmtDate(b.check_in)} → {fmtDate(b.check_out)}</p>
                          <p className="text-xs text-slate-400">{nights(b.check_in, b.check_out)} night{nights(b.check_in, b.check_out) !== 1 ? "s" : ""} · {b.guests} guest{b.guests !== 1 ? "s" : ""}</p>
                        </div>
                        {/* Amount */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Amount</p>
                          <p className="mt-1 font-bold text-slate-900">{money(b.total_amount)}</p>
                          <p className="text-xs text-slate-400">{money(b.nightly_rate)}/night + {money(b.service_fee)} fee</p>
                        </div>
                        {/* Booked on */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Booked on</p>
                          <p className="mt-1 font-semibold text-slate-900">{fmtDate(b.created_at)}</p>
                          <p className="text-xs text-slate-400 font-mono">#{b.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rooms Tab */}
      {tab === "rooms" && (
        <div className="mt-8 grid gap-10 lg:grid-cols-[390px_1fr]">
          <form onSubmit={addRoom} className="h-fit rounded-2xl border border-slate-200 p-5">
            <h2 className="text-lg font-bold">Add a room</h2>
            <div className="mt-5 space-y-3">
              {[["name","Room name"],["location","Location"],["price","Price per night"],["type","Type"],["guests","Maximum guests"],["beds","Beds"],["image","Main image URL"],["tag","Tag"],["description","Description"]].map(([name, label]) => (
                <label key={name} className="block text-sm font-medium">{label}
                  <input required={!["tag","description"].includes(name)} name={name} value={room[name]} onChange={update}
                    type={["price","guests","beds"].includes(name) ? "number" : "text"}
                    min={["price","guests","beds"].includes(name) ? 1 : undefined}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 p-2.5 font-normal" />
                </label>
              ))}
              <label className="flex gap-2 text-sm items-center">
                <input name="isFeatured" type="checkbox" checked={room.isFeatured} onChange={update} /> Show as featured
              </label>
            </div>
            <button disabled={saving} className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? "Adding…" : "Add room"}
            </button>
            {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}
          </form>

          <section>
            <h2 className="text-lg font-bold">Current rooms ({rooms.length})</h2>
            <div className="mt-5 space-y-3">
              {rooms.map((r) => (
                <article key={r.id} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-3">
                  <img src={r.image} alt="" className="h-16 w-20 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="text-sm text-slate-500">{r.location} · {money(r.price)} / night</p>
                    <p className="text-xs text-slate-400 mt-0.5">{r.type} · {r.guests} guests · {r.beds} beds{r.isFeatured ? " · Featured" : ""}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
