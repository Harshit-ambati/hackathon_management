import { CalendarDays, Search } from "lucide-react";
import { featuredHackathons } from "../utils/mockData";

export function HackathonsPage() {
  return (
    <PageShell title="Hackathons" subtitle="Search and filter active, upcoming, ongoing, and completed events.">
      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d91ad]" size={18} />
          <input className="w-full rounded-md border border-[#cbd5e1] py-3 pl-10 pr-3 outline-none focus:border-[#175cd3]" placeholder="Search hackathons" />
        </label>
        <select className="rounded-md border border-[#cbd5e1] px-3 py-3 outline-none focus:border-[#175cd3]">
          <option>All modes</option>
          <option>Online</option>
          <option>Offline</option>
          <option>Hybrid</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {featuredHackathons.map((hackathon) => (
          <article key={hackathon.title} className="rounded-lg border border-[#dfe7f3] bg-white p-5 shadow-sm">
            <span className="rounded-md bg-[#eaf4ff] px-2 py-1 text-xs font-bold text-[#175cd3]">{hackathon.status}</span>
            <h2 className="mt-4 text-xl font-black text-[#101828]">{hackathon.title}</h2>
            <p className="mt-2 text-sm text-[#526071]">{hackathon.theme} | {hackathon.mode}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#172033]"><CalendarDays size={16} /> {hackathon.date}</p>
            <p className="mt-3 text-sm font-bold text-[#ff6b35]">Prize pool: {hackathon.prize}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

export function SimplePage({ title, subtitle, items = [] }) {
  return (
    <PageShell title={title} subtitle={subtitle}>
      <div className="grid gap-4 md:grid-cols-3">
        {(items.length ? items : ["Coming soon", "Workflow ready", "API integration next"]).map((item) => (
          <div key={item} className="rounded-lg border border-[#dfe7f3] bg-white p-5 shadow-sm">
            <h2 className="font-black text-[#101828]">{item}</h2>
            <p className="mt-2 text-sm leading-6 text-[#526071]">This page is structured for dynamic data in the upcoming module phases.</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function PageShell({ title, subtitle, children }) {
  return (
    <main className="mx-auto min-h-[calc(100vh-154px)] max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff6b35]">CodeArena</p>
        <h1 className="mt-2 text-3xl font-black text-[#101828]">{title}</h1>
        <p className="mt-2 max-w-2xl text-[#526071]">{subtitle}</p>
      </div>
      {children}
    </main>
  );
}
