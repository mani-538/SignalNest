"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Inbox, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SocialEvent } from "@/types";

export default function InboxPage() {
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/events").then(r => r.json()).then(j => setEvents(j.data ?? [])).finally(() => setLoading(false)); }, []);
  return <div className="flex-1"><Header title="Inbox" subtitle="Real activity from connected accounts"/><main className="mx-auto max-w-4xl p-8">{loading ? <p className="text-sm text-slate-500">Loading…</p> : events.length === 0 ? <Empty/> : <div className="space-y-3">{events.map(e => <article key={e.id} className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex justify-between gap-4"><div><p className="text-xs font-medium uppercase text-slate-500">{e.source} · {e.type}</p><h2 className="mt-1 font-medium text-slate-900">{e.authorName}</h2></div><span className="text-xs text-slate-500">{new Date(e.occurredAt).toLocaleString()}</span></div><p className="mt-3 text-sm leading-6 text-slate-700">{e.content}</p></article>)}</div>}</main></div>;
}
function Empty(){return <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><Inbox className="mx-auto h-6 w-6 text-slate-400"/><h2 className="mt-4 font-semibold text-slate-900">Your inbox is empty</h2><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">New events will appear here after a connected platform sends them. No sample messages are displayed.</p><Link href="/integrations" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">Connect an account <ArrowRight className="h-4 w-4"/></Link></section>}
