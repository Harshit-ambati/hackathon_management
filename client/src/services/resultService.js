import { api } from "./api";

export async function getLeaderboard(hackathonId) {
  const { data } = await api.get(`/results/hackathons/${hackathonId}/leaderboard`);
  return data;
}

export async function publishResults(hackathonId) {
  const { data } = await api.post(`/results/hackathons/${hackathonId}/publish`);
  return data;
}
