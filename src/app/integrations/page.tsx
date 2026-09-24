"use client";
import { useEffect,useState } from "react";
import { Github,CheckCircle2,Clock3,AlertCircle,Loader2,LockKeyhole } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SocialConnection } from "@/types";

type GitHubStatus = {
  connected: boolean;
  repositoryCount?: number;
  repositories?: Array<{ id:number; fullName:string; private:boolean; url:string }>;
  permissions?: Record<string,string>;
  repositorySelection?: string;
  error?: string;
};

export default function Integrations(){
  const [items,setItems]=useState<SocialConnection[]>([]);
  const [github,setGithub]=useState<GitHubStatus|null>(null);
  useEffect(()=>{
    fetch('/api/integrations').then(r=>r.json()).then(j=>setItems(j.data??[]));
    fetch('/api/integrations/github/status').then(r=>r.json()).then(setGithub).catch(()=>setGithub({connected:false,error:'Could not verify GitHub'}));
  },[]);
  const oauthConnected=items.find(i=>i.provider==='github')?.status==='connected';
  return <div className="flex-1"><Header title="Integrations" subtitle="Connect accounts through their official APIs"/><main className="mx-auto max-w-4xl space-y-6 p-8">
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-slate-900 p-2 text-white"><Github className="h-5 w-5"/></div><div><h2 className="font-medium">GitHub</h2><p className="text-sm text-slate-500">Repositories, issues, pull requests and releases</p></div></div>
      {!github?<span className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin"/>Checking</span>:github.connected?<span className="flex items-center gap-1 text-sm font-medium text-emerald-600"><CheckCircle2 className="h-4 w-4"/>Operational</span>:oauthConnected?<span className="flex items-center gap-1 text-sm text-amber-600"><AlertCircle className="h-4 w-4"/>Setup incomplete</span>:<a href="/api/auth/github" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Connect</a>}</div>
      {github?.connected&&<div className="mt-5 border-t border-slate-100 pt-4"><div className="grid gap-3 text-sm sm:grid-cols-3"><div><p className="text-slate-500">Repositories</p><p className="mt-1 font-medium">{github.repositoryCount}</p></div><div><p className="text-slate-500">Access</p><p className="mt-1 font-medium capitalize">{github.repositorySelection}</p></div><div><p className="text-slate-500">Authentication</p><p className="mt-1 flex items-center gap-1 font-medium"><LockKeyhole className="h-3.5 w-3.5"/>GitHub App</p></div></div>{github.repositories?.length?<div className="mt-4 space-y-2">{github.repositories.map(repo=><a key={repo.id} href={repo.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100"><span>{repo.fullName}</span><span className="text-xs text-slate-500">{repo.private?'Private':'Public'}</span></a>)}</div>:<p className="mt-4 text-sm text-amber-600">The app is installed, but no repositories are available.</p>}</div>}
      {github&&!github.connected&&<p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{github.error??'GitHub App authentication is not ready.'}</p>}
    </section>
    <section><h2 className="mb-3 text-sm font-medium text-slate-700">Planned integrations</h2><div className="grid gap-3 sm:grid-cols-2">{items.filter(i=>i.provider!=='github').map(i=><div key={i.provider} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"><span className="capitalize text-sm font-medium">{i.provider}</span><span className="flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5"/>Pending</span></div>)}</div></section>
  </main></div>
}
