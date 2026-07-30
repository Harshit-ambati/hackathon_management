import { api } from "./api";

export async function registerForHackathon(hackathonId) {
  const { data } = await api.post(`/registrations/hackathons/${hackathonId}`);
  return data;
}

export async function getMyRegistrations() {
  const { data } = await api.get("/registrations/me");
  return data;
}

export async function cancelRegistration(registrationId) {
  const { data } = await api.delete(`/registrations/${registrationId}`);
  return data;
}

export async function getHackathonRegistrations(hackathonId, params = {}) {
  const { data } = await api.get(`/registrations/hackathons/${hackathonId}`, { params });
  return data;
}

export async function reviewRegistration(registrationId, payload) {
  const { data } = await api.patch(`/registrations/${registrationId}/review`, payload);
  return data;
}
