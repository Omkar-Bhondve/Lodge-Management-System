import { useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowRight,
  BedDouble,
  Check,
  ChevronLeft,
  CircleUserRound,
  Coffee,
  Heart,
  House,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  UtensilsCrossed,
  Users,
  Wifi,
  X,
} from "lucide-react";
import RoomCollection from "./components/RoomCollection";
import { useRoom } from "./hooks/useRooms";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminDashboard from "./pages/AdminDashboard";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <main className="p-20 text-center text-slate-500">Loading…</main>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function RedirectIfAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  return children;
}

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = [
    ["/", "Home"],
    ["/lodgings", "Stays"],
    ["/about", "About"],
    ["/contact", "Contact"],
  ];
  const handleLogout = () => { logout(); navigate("/"); setOpen(false); };
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white">
            <House size={19} />
          </span>
          stay<span className="text-emerald-600">well</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950">Dashboard</Link>
              )}
              <Link to="/my-bookings" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950">My bookings</Link>
              <button onClick={handleLogout} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950">Log in</Link>
              <Link to="/register" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">Create account</Link>
            </>
          )}
        </div>
        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-slate-800 md:hidden" aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map(([to, label]) => (
              <NavLink onClick={() => setOpen(false)} key={to} to={to} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                {label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-3 border-t border-slate-100 pt-3">
              {user ? (
                <>
                  <Link onClick={() => setOpen(false)} to="/my-bookings" className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold">My bookings</Link>
                  <button onClick={handleLogout} className="flex-1 rounded-xl bg-slate-900 py-2.5 text-center text-sm font-semibold text-white">Log out</button>
                </>
              ) : (
                <>
                  <Link onClick={() => setOpen(false)} to="/login" className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold">Log in</Link>
                  <Link onClick={() => setOpen(false)} to="/register" className="flex-1 rounded-xl bg-slate-900 py-2.5 text-center text-sm font-semibold text-white">Create account</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="text-xl font-bold tracking-tight">
            stay<span className="text-emerald-600">well</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
            Thoughtful places to stay, for trips worth remembering.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
            <Link to="/lodgings">Find a stay</Link>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Your account</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
            <Link to="/my-bookings">My bookings</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Log in</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Need help?</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            We're here every day, 9am–8pm.<br />hello@staywell.com
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
        © 2026 Staywell. Made for better getaways.
      </div>
    </footer>
  );
}

function SearchBar({ compact = false, defaultSearch = "" }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState(defaultSearch);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        navigate(`/lodgings${params.toString() ? `?${params}` : ""}`);
      }}
      className={`grid bg-white ${compact ? "grid-cols-1 gap-3 rounded-2xl border border-slate-200 p-3 sm:grid-cols-[1fr_auto] sm:items-center" : "grid-cols-1 rounded-2xl p-3 shadow-2xl shadow-slate-900/10 md:grid-cols-[1fr_auto] md:items-center"}`}
    >
      <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5">
        <MapPin className="shrink-0 text-emerald-600" size={20} />
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-slate-900">Where</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-500 outline-none placeholder:text-slate-400"
            placeholder="Search by city, location or room name…"
          />
        </span>
        {search && (
          <button type="button" onClick={() => setSearch("")} className="shrink-0 text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        )}
      </label>
      <Button type="submit" className="h-12 px-5">
        <Search size={18} /><span>Search</span>
      </Button>
    </form>
  );
}

function LodgingCard({ lodge }) {
  return (
    <Link to={`/lodgings/${lodge.slug}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={lodge.image} alt={lodge.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {lodge.tag && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">{lodge.tag}</span>}
        <button onClick={(e) => e.preventDefault()} className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-slate-700 hover:text-rose-500" aria-label="Save lodging">
          <Heart size={17} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">{lodge.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{lodge.location}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium">
            <Star size={15} className="fill-amber-400 text-amber-400" />{lodge.rating}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-sm text-slate-500">{lodge.type}</span>
          <p className="text-sm font-semibold text-slate-900">{formatMoney(lodge.price)} <span className="font-normal text-slate-500">night</span></p>
        </div>
      </div>
    </Link>
  );
}

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-45">
          <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=85" alt="Bright, inviting living room" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/35 via-slate-950/10 to-slate-950/50" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">Thoughtful stays, simply found</p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">Make room for moments that matter.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-100">Find welcoming spaces for a weekend away, a longer pause, or your next great story.</p>
          </div>
          <div className="mt-10 max-w-5xl"><SearchBar /></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-emerald-700">HANDPICKED FOR YOU</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Places with a little more soul</h2>
            <p className="mt-2 text-slate-500">Discover stays loved by travellers like you.</p>
          </div>
          <Link to="/lodgings" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-emerald-700">Explore all stays <ArrowRight size={16} /></Link>
        </div>
        <div className="mt-9">
          <RoomCollection featured emptyMessage="No featured stays are available yet." />
        </div>
      </section>
      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl bg-emerald-50 lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="text-sm font-semibold text-emerald-700">WHY STAYWELL</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">The easy way to find your place.</h2>
            <div className="mt-8 space-y-6">
              {[
                [ShieldCheck, "Stays you can trust", "We choose places for their character, comfort, and care."],
                [Heart, "Human help when you need it", "Friendly support from booking to checkout."],
                [Coffee, "Less rush, more room", "Flexible stays for the way you actually travel."],
              ].map(([Icon, title, text]) => (
                <div key={title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-700"><Icon size={20} /></span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <img className="h-full min-h-72 w-full object-cover" src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85" alt="Friends relaxing in a bright accommodation" />
        </div>
      </section>
    </>
  );
}

function Lodgings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [filter, setFilter] = useState("All stays");
  const filterOptions = ["All stays", "Entire home", "Private room", "Entire cabin", "Boutique stay"];
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-emerald-700">FIND YOUR STAY</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">A good trip starts with a good place.</h1>
        <p className="mt-3 text-slate-500">Search through places made for restful days and easy evenings.</p>
      </div>
      <div className="mt-8"><SearchBar compact defaultSearch={search} /></div>
      {search && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-slate-500">Results for</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">{search}</span>
          <button onClick={() => setSearchParams({})} className="text-slate-400 hover:text-slate-600"><X size={15} /></button>
        </div>
      )}
      <div className="mt-7 flex flex-col gap-4 border-y border-slate-200 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal size={18} className="shrink-0 text-slate-500" />
          {filterOptions.map((option) => (
            <button onClick={() => setFilter(option)} key={option} className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition ${filter === option ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{option}</button>
          ))}
        </div>
        <p className="text-sm text-slate-500">Browse currently available stays</p>
      </div>
      <div className="mt-8">
        <RoomCollection
          search={search}
          type={filter === "All stays" ? "" : filter}
          emptyMessage={search ? `No stays found for "${search}". Try a different city or name.` : "No stays available."}
        />
      </div>
    </main>
  );
}

function LodgingDetails() {
  const { id } = useParams();
  const { room: lodge, loading, error } = useRoom(id);
  const navigate = useNavigate();
  if (loading) return <main className="mx-auto max-w-7xl px-5 py-20 text-center text-slate-500">Loading stay…</main>;
  if (error || !lodge) return <main className="mx-auto max-w-7xl px-5 py-20 text-center text-slate-500">{error || "This stay could not be found."}</main>;
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
        <ChevronLeft size={17} /> Back to stays
      </button>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{lodge.location}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{lodge.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold">{lodge.rating}</span>
            <span className="text-slate-500">· {lodge.reviews} reviews</span>
          </div>
        </div>
        <button className="rounded-xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-50"><Heart size={19} /></button>
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-2">
        <img className="h-80 w-full rounded-2xl object-cover md:row-span-2 md:h-full" src={lodge.image} alt={lodge.name} />
        <div className="grid grid-cols-2 gap-3">
          <img className="h-36 w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=85" alt="Interior detail" />
          <img className="h-36 w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=85" alt="Interior seating" />
        </div>
      </div>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">A stay made for slowing down.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">{lodge.description} Settle in, enjoy the small details, and make this space your own.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-slate-200 py-7 sm:grid-cols-4">
            {[
              [Users, `${lodge.guests} guests`],
              [BedDouble, `${lodge.beds} beds`],
              [Wifi, "Fast wifi"],
              [UtensilsCrossed, "Kitchen"],
            ].map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Icon size={18} className="text-emerald-700" />{label}
              </div>
            ))}
          </div>
          <h2 className="mt-9 text-xl font-bold text-slate-900">What this place offers</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 text-sm text-slate-600">
            {["Dedicated workspace", "Free parking on premises", "Fresh linens and towels", "Self check-in", "Outdoor seating", "Local recommendations"].map((item) => (
              <div className="flex items-center gap-3" key={item}><Check size={17} className="text-emerald-600" />{item}</div>
            ))}
          </div>
        </div>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50">
          <p className="text-lg font-bold text-slate-900">{formatMoney(lodge.price)} <span className="text-sm font-normal text-slate-500">night</span></p>
          <p className="mt-3 text-sm text-slate-500">Select your dates on the booking page.</p>
          <Link to={`/booking/${lodge.slug}`} className="mt-4 flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
            Reserve
          </Link>
          <p className="mt-3 text-center text-xs text-slate-500">You won't be charged yet</p>
        </aside>
      </div>
    </main>
  );
}

function Field({ label, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" {...props} />
    </label>
  );
}

function Confirmation() {
  const { id } = useParams();
  const { room: lodge, loading, error } = useRoom(id);
  if (loading) return <main className="mx-auto max-w-2xl px-5 py-20 text-center text-slate-500">Loading confirmation…</main>;
  if (error || !lodge) return <main className="mx-auto max-w-2xl px-5 py-20 text-center text-slate-500">{error || "This stay could not be found."}</main>;
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-6">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
        <Check size={32} />
      </div>
      <p className="mt-7 text-sm font-semibold text-emerald-700">BOOKING CONFIRMED</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">You're all set!</h1>
      <p className="mx-auto mt-4 max-w-md leading-7 text-slate-500">Your stay at {lodge.name} is confirmed.</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/my-bookings" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">View my bookings</Link>
        <Link to="/lodgings" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Explore more stays</Link>
      </div>
    </main>
  );
}

function Profile() {
  const { user } = useAuth();
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
      <p className="text-sm font-semibold text-emerald-700">YOUR ACCOUNT</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CircleUserRound size={30} />
          </span>
          <div>
            <h2 className="font-bold">{user ? `${user.firstName} ${user.lastName}` : "Guest"}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Field label="First name" defaultValue={user?.firstName ?? ""} />
          <Field label="Last name" defaultValue={user?.lastName ?? ""} />
          <Field label="Email address" defaultValue={user?.email ?? ""} />
          <Field label="Phone number" defaultValue={user?.phone ?? ""} />
        </div>
        <Button className="mt-7">Save changes</Button>
      </div>
    </main>
  );
}

function About() {
  return (
    <main>
      <section className="bg-emerald-50">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-6">
          <p className="text-sm font-semibold text-emerald-700">ABOUT STAYWELL</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Travel should feel a little lighter.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">We believe the best stays are more than a key and a bed. They're the comfortable beginning to somewhere new.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
        <img className="w-full rounded-3xl object-cover" src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=85" alt="Warm home interior" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Made for meaningful stays.</h2>
          <p className="mt-5 leading-7 text-slate-600">Staywell began with a simple idea: finding a good place shouldn't be the hardest part of a trip.</p>
          <p className="mt-4 leading-7 text-slate-600">From the first search to the final morning coffee, we want every step to feel clear and considered.</p>
        </div>
      </section>
    </main>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold text-emerald-700">GET IN TOUCH</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">How can we help?</h1>
          <p className="mt-4 max-w-sm leading-7 text-slate-500">Have a question about a stay or booking? Send us a note and we'll get back to you soon.</p>
          <div className="mt-9 space-y-5 text-sm">
            <div><p className="font-semibold">Email us</p><p className="mt-1 text-slate-500">hello@staywell.com</p></div>
            <div><p className="font-semibold">Call us</p><p className="mt-1 text-slate-500">+91 800 123 4567</p></div>
            <div><p className="font-semibold">Hours</p><p className="mt-1 text-slate-500">Every day, 9am–8pm IST</p></div>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold">Send us a message</h2>
          {sent ? (
            <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-sm text-emerald-800">Thanks for reaching out — we'll be in touch shortly.</div>
          ) : (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Your name" placeholder="Riya Sharma" />
                <Field label="Email address" placeholder="riya@example.com" />
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Message</span>
                <textarea required placeholder="How can we help?" className="min-h-32 w-full rounded-xl border border-slate-200 p-3.5 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <Button type="submit" className="mt-5">Send message <ArrowRight size={17} /></Button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-white text-slate-900">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<RedirectIfAuth><AuthPage /></RedirectIfAuth>} />
            <Route path="/register" element={<RedirectIfAuth><AuthPage register /></RedirectIfAuth>} />
            <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/lodgings" element={<RequireAuth><Lodgings /></RequireAuth>} />
            <Route path="/lodgings/:id" element={<RequireAuth><LodgingDetails /></RequireAuth>} />
            <Route path="/booking/:id" element={<RequireAuth><BookingPage /></RequireAuth>} />
            <Route path="/confirmation/:id" element={<RequireAuth><Confirmation /></RequireAuth>} />
            <Route path="/my-bookings" element={<RequireAuth><MyBookingsPage /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<RequireAuth><About /></RequireAuth>} />
            <Route path="/contact" element={<RequireAuth><Contact /></RequireAuth>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
