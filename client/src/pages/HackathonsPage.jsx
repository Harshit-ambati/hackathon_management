import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { getHackathons } from "../services/hackathonService";
import { registerForHackathon } from "../services/registrationService";
import { getLeaderboard } from "../services/resultService";
import { createSubmission, getMySubmissions } from "../services/submissionService";
import { createTeam, getMyTeams } from "../services/teamService";
import { featuredHackathons } from "../utils/mockData";

export function HackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [filters, setFilters] = useState({ search: "", mode: "" });
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadHackathons() {
      setStatus("loading");
      try {
        const data = await getHackathons(Object.fromEntries(Object.entries(filters).filter(([, value]) => value)));
        if (isMounted) {
          setHackathons(data.hackathons);
          setStatus("ready");
        }
      } catch {
        if (isMounted) {
          setHackathons([]);
          setStatus("offline");
        }
      }
    }

    loadHackathons();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const fallbackHackathons = useMemo(() => featuredHackathons.map((hackathon) => ({ ...hackathon, _id: hackathon.title })), []);
  const visibleHackathons = status === "offline" ? fallbackHackathons : hackathons;

  async function handleRegister(hackathonId) {
    setMessage("");
    try {
      await registerForHackathon(hackathonId);
      setMessage("Registration submitted for organizer review.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login as a participant to register.");
    }
  }

  return (
    <PageShell title="Hackathons" subtitle="Search and filter active, upcoming, ongoing, and completed events.">
      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d91ad]" size={18} />
          <input className="w-full rounded-md border border-[#cbd5e1] py-3 pl-10 pr-3 outline-none focus:border-[#175cd3]" placeholder="Search hackathons" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} />
        </label>
        <select className="rounded-md border border-[#cbd5e1] px-3 py-3 outline-none focus:border-[#175cd3]" value={filters.mode} onChange={(event) => setFilters((current) => ({ ...current, mode: event.target.value }))}>
          <option value="">All modes</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>
      {message && <p className="mb-5 rounded-md bg-[#eaf4ff] px-3 py-2 text-sm font-semibold text-[#175cd3]">{message}</p>}
      {status === "loading" && <EmptyState text="Loading hackathons..." />}
      {status === "ready" && visibleHackathons.length === 0 && <EmptyState text="No hackathons match the current filters." />}
      {status === "offline" && <p className="mb-5 rounded-md bg-[#fff7ed] px-3 py-2 text-sm font-semibold text-[#c2410c]">API unavailable. Showing sample events.</p>}
      <div className="grid gap-4 md:grid-cols-3">
        {visibleHackathons.map((hackathon) => (
          <article key={hackathon._id} className="rounded-lg border border-[#dfe7f3] bg-white p-5 shadow-sm">
            <span className="rounded-md bg-[#eaf4ff] px-2 py-1 text-xs font-bold text-[#175cd3]">{humanize(hackathon.status || "registration open")}</span>
            <h2 className="mt-4 text-xl font-black text-[#101828]">{hackathon.title}</h2>
            <p className="mt-2 text-sm text-[#526071]">{hackathon.theme} | {humanize(hackathon.mode || "online")}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#172033]"><CalendarDays size={16} /> {formatDateRange(hackathon)}</p>
            <p className="mt-3 text-sm font-bold text-[#ff6b35]">Prize pool: {hackathon.prizePool || hackathon.prize || "To be announced"}</p>
            <button onClick={() => handleRegister(hackathon._id)} className="mt-5 w-full rounded-md bg-[#172033] px-4 py-2 text-sm font-bold text-white">Register</button>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

export function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ hackathonId: "", name: "", description: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMyTeams().then((data) => setTeams(data.teams)).catch(() => setTeams([]));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    try {
      const data = await createTeam(form);
      setTeams((current) => [data.team, ...current]);
      setForm({ hackathonId: "", name: "", description: "" });
      setMessage("Team created successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to create team. Check registration approval and hackathon id.");
    }
  }

  return (
    <PageShell title="Teams" subtitle="Create and manage participant teams for approved hackathon registrations.">
      <ModuleForm onSubmit={handleSubmit} button="Create team">
        <TextInput label="Hackathon ID" name="hackathonId" value={form.hackathonId} onChange={setForm} required />
        <TextInput label="Team name" name="name" value={form.name} onChange={setForm} required />
        <TextInput label="Description" name="description" value={form.description} onChange={setForm} />
      </ModuleForm>
      <Message text={message} />
      <ItemGrid items={teams} empty="No teams yet." render={(team) => ({ title: team.name, meta: team.hackathon?.title || "Hackathon team", text: team.description || `${team.members?.length || 1} member(s)` })} />
    </PageShell>
  );
}

export function SubmissionPage() {
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({ teamId: "", projectName: "", problemStatement: "", solution: "", description: "", githubRepository: "", liveDemoUrl: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMySubmissions().then((data) => setSubmissions(data.submissions)).catch(() => setSubmissions([]));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    try {
      const data = await createSubmission({ ...form, techStack: [] });
      setSubmissions((current) => [data.submission, ...current]);
      setMessage("Submission saved successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to submit project. Check team leadership and deadline.");
    }
  }

  return (
    <PageShell title="Submissions" subtitle="Submit project details, repository links, demos, and review-ready descriptions.">
      <ModuleForm onSubmit={handleSubmit} button="Submit project">
        <TextInput label="Team ID" name="teamId" value={form.teamId} onChange={setForm} required />
        <TextInput label="Project name" name="projectName" value={form.projectName} onChange={setForm} required />
        <TextInput label="Problem statement" name="problemStatement" value={form.problemStatement} onChange={setForm} required />
        <TextInput label="Solution" name="solution" value={form.solution} onChange={setForm} required />
        <TextInput label="Description" name="description" value={form.description} onChange={setForm} required />
        <TextInput label="GitHub repository" name="githubRepository" value={form.githubRepository} onChange={setForm} required />
        <TextInput label="Live demo URL" name="liveDemoUrl" value={form.liveDemoUrl} onChange={setForm} />
      </ModuleForm>
      <Message text={message} />
      <ItemGrid items={submissions} empty="No submissions yet." render={(submission) => ({ title: submission.projectName, meta: humanize(submission.status), text: submission.githubRepository })} />
    </PageShell>
  );
}

export function LeaderboardPage() {
  const [hackathonId, setHackathonId] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    try {
      const data = await getLeaderboard(hackathonId);
      setLeaderboard(data.leaderboard);
      if (!data.leaderboard.length) {
        setMessage("No ranked submissions yet.");
      }
    } catch (error) {
      setLeaderboard([]);
      setMessage(error.response?.data?.message || "Enter a valid hackathon id to load rankings.");
    }
  }

  return (
    <PageShell title="Leaderboard" subtitle="Rank teams by completed judge evaluations and published scores.">
      <ModuleForm onSubmit={handleSubmit} button="Load leaderboard">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-bold text-[#172033]">Hackathon ID</span>
          <input className="w-full rounded-md border border-[#cbd5e1] px-3 py-3 outline-none focus:border-[#175cd3]" value={hackathonId} onChange={(event) => setHackathonId(event.target.value)} required />
        </label>
      </ModuleForm>
      <Message text={message} />
      <div className="overflow-hidden rounded-lg border border-[#dfe7f3] bg-white shadow-sm">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-[#f8fbff] text-[#526071]"><tr><th className="p-4">Rank</th><th>Team</th><th>Project</th><th>Total</th><th>Position</th></tr></thead>
          <tbody>
            {leaderboard.map((row) => (
              <tr key={row.submissionId} className="border-t border-[#e4ebf5]"><td className="p-4 font-black">{row.rank}</td><td>{row.teamName}</td><td>{row.projectName}</td><td>{row.totalScore}</td><td>{row.position}</td></tr>
            ))}
          </tbody>
        </table>
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

function ModuleForm({ children, button, onSubmit }) {
  return <form onSubmit={onSubmit} className="mb-6 grid gap-4 rounded-lg border border-[#dfe7f3] bg-white p-5 shadow-sm md:grid-cols-2">{children}<button className="rounded-md bg-[#ff6b35] px-4 py-3 font-bold text-white md:col-span-2">{button}</button></form>;
}

function TextInput({ label, name, value, onChange, ...props }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold text-[#172033]">{label}</span><input name={name} value={value} onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))} className="w-full rounded-md border border-[#cbd5e1] px-3 py-3 outline-none focus:border-[#175cd3]" {...props} /></label>;
}

function Message({ text }) {
  return text ? <p className="mb-5 rounded-md bg-[#eaf4ff] px-3 py-2 text-sm font-semibold text-[#175cd3]">{text}</p> : null;
}

function ItemGrid({ items, empty, render }) {
  if (!items.length) {
    return <EmptyState text={empty} />;
  }

  return <div className="grid gap-4 md:grid-cols-3">{items.map((item) => { const view = render(item); return <article key={item._id || view.title} className="rounded-lg border border-[#dfe7f3] bg-white p-5 shadow-sm"><h2 className="text-xl font-black text-[#101828]">{view.title}</h2><p className="mt-2 text-sm font-bold text-[#ff6b35]">{view.meta}</p><p className="mt-3 break-words text-sm leading-6 text-[#526071]">{view.text}</p></article>; })}</div>;
}

function EmptyState({ text }) {
  return <div className="rounded-lg border border-dashed border-[#b8c4d6] bg-white p-8 text-center font-semibold text-[#526071]">{text}</div>;
}

function humanize(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateRange(hackathon) {
  if (hackathon.date) {
    return hackathon.date;
  }

  if (!hackathon.startDate) {
    return "Dates pending";
  }

  const start = new Date(hackathon.startDate).toLocaleDateString();
  const end = hackathon.endDate ? new Date(hackathon.endDate).toLocaleDateString() : start;
  return `${start} - ${end}`;
}
