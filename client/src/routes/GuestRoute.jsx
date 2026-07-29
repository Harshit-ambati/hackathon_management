import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getDashboardPath } from "../utils/roles";

export function GuestRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-[#f7f9fc] p-8 text-[#526071]">Loading...</div>;
  }

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
}
