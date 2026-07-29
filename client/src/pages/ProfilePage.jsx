import { useAuth } from "../context/useAuth";

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <main className="mx-auto min-h-[calc(100vh-154px)] max-w-4xl px-6 py-10 sm:px-8 lg:px-10">
      <section className="rounded-lg border border-[#dfe7f3] bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff6b35]">Profile</p>
        <h1 className="mt-2 text-3xl font-black text-[#101828]">{user?.name || "User profile"}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label="Email" value={user?.email || "Not available"} />
          <Info label="Role" value={user?.role || "participant"} />
          <Info label="College" value={user?.college || "Add college in profile settings"} />
          <Info label="Status" value={user?.isBlocked ? "Blocked" : "Active"} />
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-md bg-[#f8fbff] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7d91ad]">{label}</p>
      <p className="mt-1 font-semibold text-[#172033]">{value}</p>
    </div>
  );
}
