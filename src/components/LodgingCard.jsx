import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const formatMoney = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export default function LodgingCard({ lodge }) {
  return (
    <Link to={`/lodgings/${lodge.slug}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={lodge.image} alt={lodge.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {lodge.tag && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">{lodge.tag}</span>}
        <span className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-slate-700"><Heart size={17} /></span>
      </div>
      <div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-900">{lodge.name}</h3><p className="mt-1 text-sm text-slate-500">{lodge.location}</p></div><span className="flex shrink-0 items-center gap-1 text-sm font-medium"><Star size={15} className="fill-amber-400 text-amber-400" />{lodge.rating}</span></div><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-sm text-slate-500">{lodge.type}</span><p className="text-sm font-semibold text-slate-900">{formatMoney(lodge.price)} <span className="font-normal text-slate-500">night</span></p></div></div>
    </Link>
  );
}
