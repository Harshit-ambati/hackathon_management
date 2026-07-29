import { api } from "./api";

export async function getHackathons(params = {}) {
  const { data } = await api.get("/hackathons", { params });
  return data;
}

export async function getHackathon(id) {
  const { data } = await api.get(`/hackathons/${id}`);
  return data;
}

export async function createHackathon(payload) {
  const { data } = await api.post("/hackathons", payload);
  return data;
}

export async function updateHackathon(id, payload) {
  const { data } = await api.put(`/hackathons/${id}`, payload);
  return data;
}

export async function deleteHackathon(id) {
  const { data } = await api.delete(`/hackathons/${id}`);
  return data;
}
