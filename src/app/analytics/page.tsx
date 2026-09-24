import Link from "next/link";
import { BarChart3, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function AnalyticsPage() {
  return <div className="flex-1 min-w-0"><Header title="Analytics" subtitle="Performance from connected accounts" /><main className="mx-auto max-w-3xl px-6 py-10"><section className="rounded-2xl border border-dashed border-[#303a50] bg-[#10141e] px-6 py-16 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300"><BarChart3 className="h-5 w-5" /></div><h2 className="mt-5 text-lg font-semibold text-slate-100">No analytics yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Analytics will appear when a connected platform provides real data. SignalNest does not estimate or invent performance figures.</p><Link href="/integrations" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200">Manage integrations <ArrowRight className="h-4 w-4" /></Link></section></main></div>;
}
