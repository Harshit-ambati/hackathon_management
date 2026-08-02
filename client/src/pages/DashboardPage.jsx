import { useEffect, useState } from "react";
import { BarChart3, ClipboardCheck, Trophy, Users } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { getDashboardSummary } from "../services/dashboardService";
import { dashboardStats } from "../utils/mockData";

const iconMap = [Users, Trophy, ClipboardCheck, BarChart3, Users];

export function DashboardPage({ role, title, subtitle }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(() => (dashboardStats[role] || dashboardStats.participant).map((label, index) => ({ label, value: index === 0 ? 0 : "-" })));
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const data = await getDashboardSummary();
        if (isMounted && data.role === role) {
          setStats(data.stats);
          setStatus("ready");
        }
      } catch {
        if (isMounted) {
          setStatus("offline");
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [role]);

  return (
    <main className="mx-auto min-h-[calc(100vh-154px)] max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff6b35]">{role} dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-[#101828]">{title}</h1>
        <p className="mt-2 max-w-2xl text-[#526071]">{subtitle}</p>
        {status === "offline" && <p className="mt-3 rounded-md bg-[#fff7ed] px-3 py-2 text-sm font-semibold text-[#c2410c]">Live dashboard data is unavailable. Showing placeholders until the API is reachable.</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.slice(0, 4).map((stat, index) => {
          const Icon = iconMap[index];
          return (
            <section key={stat.label} className="rounded-lg border border-[#dfe7f3] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-[#eaf4ff] text-[#175cd3]"><Icon size={22} /></span>
                <span className="text-3xl font-black text-[#101828]">{status === "loading" ? "..." : stat.value}</span>
              </div>
              <h2 className="mt-4 font-bold text-[#172033]">{stat.label}</h2>
              <p className="mt-1 text-sm text-[#526071]">Signed in as {user?.name || "demo user"}</p>
            </section>
          );
        })}
      </div>
      <section className="mt-8 rounded-lg border border-[#dfe7f3] bg-white p-6">
        <h2 className="text-xl font-black text-[#101828]">Next actions</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Review pending work", "Check recent activity", "Prepare for next deadline"].map((item) => (
            <div key={item} className="rounded-md bg-[#f8fbff] p-4 text-sm font-semibold text-[#526071]">{item}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
