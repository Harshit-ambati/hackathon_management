import { Link, NavLink, Outlet } from "react-router-dom";
import { Code2, LogOut, Menu, Trophy, UserRound } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { getDashboardPath } from "../utils/roles";

const navItems = [
  { label: "Hackathons", to: "/hackathons" },
  { label: "Teams", to: "/teams" },
  { label: "Leaderboard", to: "/leaderboard" },
];

function navClass({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-semibold transition ${
    isActive ? "bg-[#eaf4ff] text-[#175cd3]" : "text-[#526071] hover:bg-[#eef3f9] hover:text-[#172033]"
  }`;
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const dashboardPath = getDashboardPath(user?.role);

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#172033]">
      <header className="sticky top-0 z-20 border-b border-[#dfe7f3] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-[#172033] text-white">
              <Code2 size={22} />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#ff6b35]">Hackathon OS</span>
              <span className="block text-lg font-black text-[#101828]">CodeArena</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to={dashboardPath} className="hidden rounded-md border border-[#b8c4d6] bg-white px-3 py-2 text-sm font-bold text-[#172033] sm:inline-flex">
                  Dashboard
                </Link>
                <Link to="/profile" className="grid h-10 w-10 place-items-center rounded-md border border-[#dfe7f3] bg-white text-[#526071]" aria-label="Profile">
                  <UserRound size={18} />
                </Link>
                <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-md bg-[#ffede6] text-[#c2410c]" aria-label="Logout">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-md px-3 py-2 text-sm font-bold text-[#526071] hover:text-[#172033]">Login</Link>
                <Link to="/signup" className="rounded-md bg-[#ff6b35] px-4 py-2 text-sm font-bold text-white shadow-sm">Sign up</Link>
              </>
            )}
            <button className="grid h-10 w-10 place-items-center rounded-md border border-[#dfe7f3] text-[#526071] md:hidden" aria-label="Menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="border-t border-[#dfe7f3] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-[#526071] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <span className="font-semibold text-[#172033]">CodeArena</span>
          <span>Built for registrations, submissions, judging, and results.</span>
          <span className="inline-flex items-center gap-2"><Trophy size={16} /> Ship. Judge. Celebrate.</span>
        </div>
      </footer>
    </div>
  );
}
