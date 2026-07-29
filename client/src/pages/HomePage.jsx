import { Link } from "react-router-dom";
import { ArrowRight, Filter, Search, Users } from "lucide-react";
import { featuredHackathons } from "../utils/mockData";

export function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-md border border-[#b9d7ff] bg-[#eaf4ff] px-3 py-1 text-sm font-semibold text-[#175cd3]">
            Centralized hackathon operations
          </p>
          <h1 className="text-4xl font-black leading-tight text-[#101828] sm:text-5xl lg:text-6xl">
            Run hackathons from registration to results without losing momentum.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#526071]">
            CodeArena gives admins, organizers, participants, and judges one dynamic workspace for events, teams, submissions, evaluations, and leaderboards.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/hackathons" className="inline-flex items-center gap-2 rounded-md bg-[#ff6b35] px-5 py-3 font-bold text-white shadow-sm transition hover:bg-[#e95d2b]">
              Explore hackathons <ArrowRight size={18} />
            </Link>
            <Link to="/signup" className="rounded-md border border-[#b8c4d6] bg-white px-5 py-3 font-bold text-[#172033] transition hover:border-[#7d91ad]">
              Create account
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#dfe7f3] bg-white p-5 shadow-[0_20px_60px_rgba(23,32,51,0.10)]">
          <div className="rounded-md bg-[#172033] p-5 text-white">
            <p className="text-sm text-[#a9b8d0]">Live event board</p>
            <h2 className="mt-1 text-2xl font-bold">Campus Innovation Sprint</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Teams", "42"],
                ["Submissions", "18"],
                ["Judges", "7"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-white/10 p-4">
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-sm text-[#d7e2f4]">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {featuredHackathons.map((hackathon) => (
              <article key={hackathon.title} className="rounded-md border border-[#e4ebf5] bg-[#f8fbff] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#101828]">{hackathon.title}</h3>
                    <p className="mt-1 text-sm text-[#526071]">{hackathon.theme} | {hackathon.mode} | {hackathon.date}</p>
                  </div>
                  <span className="rounded-md bg-[#eaf4ff] px-2 py-1 text-xs font-bold text-[#175cd3]">{hackathon.status}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfe7f3] bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:px-8 md:grid-cols-3 lg:px-10">
          {[
            [Search, "Search", "Find hackathons, teams, and projects quickly."],
            [Filter, "Filter", "Sort by theme, mode, registration state, and timeline."],
            [Users, "Collaborate", "Keep organizers, teams, and judges aligned."],
          ].map(([Icon, title, text]) => (
            <div key={title} className="rounded-md border border-[#e4ebf5] p-5">
              <Icon className="text-[#ff6b35]" size={24} />
              <h3 className="mt-3 font-bold text-[#101828]">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-[#526071]">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
