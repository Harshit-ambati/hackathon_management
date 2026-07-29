const stats = [
  { label: 'Active hackathons', value: '12' },
  { label: 'Teams onboarded', value: '248' },
  { label: 'Projects submitted', value: '96' },
]

const phases = ['Register', 'Team up', 'Submit', 'Judge', 'Publish']

function App() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#172033]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between border-b border-[#dfe7f3] pb-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ff6b35]">Hackathon OS</p>
            <h1 className="text-xl font-bold text-[#101828]">CodeArena</h1>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-[#526071] md:flex">
            <a href="#hackathons">Hackathons</a>
            <a href="#teams">Teams</a>
            <a href="#judging">Judging</a>
          </div>
          <button className="rounded-md bg-[#172033] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#22304a]">
            Sign in
          </button>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-md border border-[#b9d7ff] bg-[#eaf4ff] px-3 py-1 text-sm font-semibold text-[#175cd3]">
              Plan, run, judge, and publish results from one platform
            </p>
            <h2 className="text-4xl font-black leading-tight text-[#101828] sm:text-5xl lg:text-6xl">
              Hackathon management that keeps every role in sync.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#526071]">
              A MERN platform for organizers, participants, judges, and admins with registrations, teams, submissions, evaluations, dashboards, and leaderboards.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-md bg-[#ff6b35] px-5 py-3 font-bold text-white shadow-sm transition hover:bg-[#e95d2b]">
                Explore hackathons
              </button>
              <button className="rounded-md border border-[#b8c4d6] bg-white px-5 py-3 font-bold text-[#172033] transition hover:border-[#7d91ad]">
                View leaderboard
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-[#dfe7f3] bg-white p-5 shadow-[0_20px_60px_rgba(23,32,51,0.10)]">
            <div className="rounded-md bg-[#172033] p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#a9b8d0]">Current event</p>
                  <h3 className="mt-1 text-2xl font-bold">Campus Innovation Sprint</h3>
                </div>
                <span className="rounded-md bg-[#38bdf8] px-3 py-1 text-sm font-bold text-[#062235]">Online</span>
              </div>
              <div className="mt-6 grid grid-cols-5 gap-2">
                {phases.map((phase) => (
                  <div key={phase} className="rounded-md bg-white/10 p-3 text-center text-xs font-semibold text-[#d7e2f4]">
                    {phase}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-md border border-[#e4ebf5] bg-[#f8fbff] p-4">
                  <p className="text-2xl font-black text-[#101828]">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-[#526071]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
