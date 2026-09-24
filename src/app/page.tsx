"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Github, PenLine, Plug, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SocialConnection } from "@/types";

export default function DashboardPage() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);

  useEffect(() => {
    fetch("/api/integrations")
      .then((response) => response.json())
      .then((json) => setConnections(json.data ?? []))
      .catch(() => setConnections([]));
  }, []);

  const github = connections.find((connection) => connection.provider === "github");
  const githubConnected = github?.status === "connected";

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header title="Home" subtitle="Your social workspace" />
      <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
        <section className="space-y-3">
          <p className="text-sm font-medium text-indigo-300">Welcome to SignalNest</p>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-100">Start with one real connection.</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-400">SignalNest stays quiet until you connect an account or create content. Nothing shown here is sample activity.</p>
        </section>

        <section className="rounded-2xl border border-[#29324a] bg-[#121826] p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#111827]"><Github className="h-5 w-5" /></div>
              <div>
                <h3 className="font-semibold text-slate-100">Connect GitHub</h3>
                <p className="mt-1 text-sm leading-5 text-slate-400">{githubConnected ? `Connected as ${github?.accountName}. GitHub activity will appear here once webhooks are enabled.` : "Bring in repositories, pull requests, issues, and releases through the official GitHub App."}</p>
              </div>
            </div>
            {githubConnected ? <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Connected</span> : <Link href="/integrations" className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">Connect GitHub <ArrowRight className="h-4 w-4" /></Link>}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[#1e2434] bg-[#10141e] p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300"><PenLine className="h-4 w-4" /></div>
            <h3 className="mt-4 font-medium text-slate-100">Create content</h3>
            <p className="mt-1 text-sm leading-5 text-slate-400">Draft a post when you have something to share. It stays a draft until you approve it.</p>
            <Link href="/studio" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-300 hover:text-indigo-200">Open Content Studio <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="rounded-xl border border-[#1e2434] bg-[#10141e] p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300"><ShieldCheck className="h-4 w-4" /></div>
            <h3 className="mt-4 font-medium text-slate-100">Approval stays with you</h3>
            <p className="mt-1 text-sm leading-5 text-slate-400">SignalNest will never publish a public post or reply without your approval.</p>
            <Link href="/settings" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-300 hover:text-indigo-200">Review settings <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section className="border-t border-[#1e2434] pt-7">
          <div className="flex items-center gap-3"><Plug className="h-4 w-4 text-slate-500" /><div><h3 className="text-sm font-medium text-slate-200">More platforms later</h3><p className="mt-1 text-sm text-slate-500">Connect LinkedIn, Instagram, and others only when their official integrations are ready.</p></div></div>
        </section>
      </main>
    </div>
  );
}
