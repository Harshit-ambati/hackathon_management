import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getDashboardPath } from "../utils/roles";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login(form);
      navigate(location.state?.from?.pathname || getDashboardPath(user.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AuthForm title="Welcome back" subtitle="Login to manage your hackathon work." submitLabel="Login" form={form} setForm={setForm} error={error} isSubmitting={isSubmitting} onSubmit={handleSubmit} footer={<span>New here? <Link className="font-bold text-[#175cd3]" to="/signup">Create an account</Link></span>} />;
}

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "participant", college: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await signup(form);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please review the form.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AuthForm title="Create account" subtitle="Join as a participant, organizer, judge, or admin." submitLabel="Sign up" form={form} setForm={setForm} error={error} isSubmitting={isSubmitting} onSubmit={handleSubmit} showSignupFields footer={<span>Already registered? <Link className="font-bold text-[#175cd3]" to="/login">Login</Link></span>} />;
}

function AuthForm({ title, subtitle, submitLabel, form, setForm, error, isSubmitting, onSubmit, showSignupFields = false, footer }) {
  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-154px)] max-w-7xl items-center gap-8 px-6 py-12 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
      <section className="rounded-lg bg-[#172033] p-8 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#38bdf8]">Secure access</p>
        <h1 className="mt-4 text-4xl font-black">{title}</h1>
        <p className="mt-3 leading-7 text-[#d7e2f4]">{subtitle}</p>
      </section>
      <form onSubmit={onSubmit} className="rounded-lg border border-[#dfe7f3] bg-white p-6 shadow-sm">
        {showSignupFields && <TextInput label="Name" name="name" value={form.name} onChange={updateField} required minLength={2} />}
        <TextInput label="Email" name="email" type="email" value={form.email} onChange={updateField} required />
        <TextInput label="Password" name="password" type="password" value={form.password} onChange={updateField} required minLength={8} />
        {showSignupFields && (
          <>
            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-bold text-[#172033]">Role</span>
              <select name="role" value={form.role} onChange={updateField} className="w-full rounded-md border border-[#cbd5e1] px-3 py-3 outline-none focus:border-[#175cd3]">
                <option value="participant">Participant</option>
                <option value="organizer">Organizer</option>
                <option value="judge">Judge</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <TextInput label="College" name="college" value={form.college} onChange={updateField} />
          </>
        )}
        {error && <p className="mb-4 rounded-md bg-[#ffede6] px-3 py-2 text-sm font-semibold text-[#c2410c]">{error}</p>}
        <button disabled={isSubmitting} className="w-full rounded-md bg-[#ff6b35] px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? "Please wait..." : submitLabel}
        </button>
        <p className="mt-4 text-center text-sm text-[#526071]">{footer}</p>
      </form>
    </main>
  );
}

function TextInput({ label, ...props }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-sm font-bold text-[#172033]">{label}</span>
      <input className="w-full rounded-md border border-[#cbd5e1] px-3 py-3 outline-none focus:border-[#175cd3]" {...props} />
    </label>
  );
}
