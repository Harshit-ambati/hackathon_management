import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="grid min-h-[calc(100vh-154px)] place-items-center px-6 py-12">
      <section className="max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff6b35]">404</p>
        <h1 className="mt-3 text-4xl font-black text-[#101828]">Page not found</h1>
        <p className="mt-3 text-[#526071]">The page you requested is not available in this workspace.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-[#172033] px-5 py-3 font-bold text-white">Go home</Link>
      </section>
    </main>
  );
}
