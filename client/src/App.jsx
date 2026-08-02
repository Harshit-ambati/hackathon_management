import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage, SignupPage } from "./pages/AuthPages";
import { HackathonsPage, LeaderboardPage, SubmissionPage, TeamsPage } from "./pages/HackathonsPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { GuestRoute } from "./routes/GuestRoute";
import { ProtectedRoute, RoleRoute } from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="hackathons" element={<HackathonsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />

        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Navigate to="/participant" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="submission" element={<SubmissionPage />} />
          <Route path="participant" element={<DashboardPage role="participant" title="Participant Dashboard" subtitle="Track registered hackathons, team status, submissions, and results." />} />
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="admin" element={<DashboardPage role="admin" title="Admin Dashboard" subtitle="Manage users, roles, hackathons, teams, submissions, and platform analytics." />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["organizer"]} />}>
            <Route path="organizer" element={<DashboardPage role="organizer" title="Organizer Dashboard" subtitle="Create events, approve teams, assign judges, and publish winners." />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["judge"]} />}>
            <Route path="judge" element={<DashboardPage role="judge" title="Judge Dashboard" subtitle="Review assigned submissions and provide criteria-based feedback." />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
