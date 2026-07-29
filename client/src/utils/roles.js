export const dashboardByRole = {
  admin: "/admin",
  organizer: "/organizer",
  judge: "/judge",
  participant: "/participant",
};

export function getDashboardPath(role) {
  return dashboardByRole[role] || "/participant";
}
