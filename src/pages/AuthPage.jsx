import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Input = ({ label, ...props }) => <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span><input required className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" {...props} /></label>;

export default function AuthPage({ register = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register: createAccount } = useAuth();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault(); setError(""); setSubmitting(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const user = await (register ? createAccount(data) : login(data));
      const from = location.state?.from?.pathname;
      navigate(from ?? (user.role === "admin" ? "/admin" : "/"));
    } catch (requestError) { setError(requestError.message); }
    finally { setSubmitting(false); }
  }

  return (
    <main className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <div className="hidden bg-emerald-800 p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <p className="text-emerald-200">A little room to breathe.</p>
        <h1 className="mt-3 max-w-md text-5xl font-bold leading-tight">Find a place that feels like yours.</h1>
      </div>
      <div className="flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight">{register ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-2 text-slate-500">{register ? "Start finding stays you'll love." : "Log in to manage your stays and bookings."}</p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            {register && (
              <div className="grid grid-cols-2 gap-4">
                <Input label="First name" name="firstName" />
                <Input label="Last name" name="lastName" />
              </div>
            )}
            <Input label="Email address" name="email" type="email" />
            <Input label="Password" name="password" type="password" minLength="8" />
            {register && <Input label="Phone number (optional)" name="phone" type="tel" required={false} />}
            {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
            <button disabled={submitting} className="mt-2 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {submitting ? "Please wait…" : register ? "Create account" : "Log in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            {register ? "Already have an account?" : "New to Staywell?"}{" "}
            <Link className="font-semibold text-emerald-700" to={register ? "/login" : "/register"}>
              {register ? "Log in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
