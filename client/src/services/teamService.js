import { api } from "./api";

export async function createTeam(payload) {
  const { data } = await api.post("/teams", payload);
  return data;
}

export async function getMyTeams() {
  const { data } = await api.get("/teams/me");
  return data;
}

export async function getHackathonTeams(hackathonId, params = {}) {
  const { data } = await api.get(`/teams/hackathons/${hackathonId}`, { params });
  return data;
}

export async function getTeam(teamId) {
  const { data } = await api.get(`/teams/${teamId}`);
  return data;
}

export async function updateTeam(teamId, payload) {
  const { data } = await api.put(`/teams/${teamId}`, payload);
  return data;
}

export async function addTeamMember(teamId, payload) {
  const { data } = await api.post(`/teams/${teamId}/members`, payload);
  return data;
}

export async function removeTeamMember(teamId, userId) {
  const { data } = await api.delete(`/teams/${teamId}/members/${userId}`);
  return data;
}

export async function leaveTeam(teamId) {
  const { data } = await api.post(`/teams/${teamId}/leave`);
  return data;
}

export async function transferLeadership(teamId, payload) {
  const { data } = await api.patch(`/teams/${teamId}/leadership`, payload);
  return data;
}

export async function deleteTeam(teamId) {
  const { data } = await api.delete(`/teams/${teamId}`);
  return data;
}
