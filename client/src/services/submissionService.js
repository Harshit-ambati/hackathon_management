import { api } from "./api";

export async function createSubmission(payload) {
  const { data } = await api.post("/submissions", payload);
  return data;
}

export async function getMySubmissions() {
  const { data } = await api.get("/submissions/me");
  return data;
}

export async function getHackathonSubmissions(hackathonId, params = {}) {
  const { data } = await api.get(`/submissions/hackathons/${hackathonId}`, { params });
  return data;
}

export async function getSubmission(submissionId) {
  const { data } = await api.get(`/submissions/${submissionId}`);
  return data;
}

export async function updateSubmission(submissionId, payload) {
  const { data } = await api.put(`/submissions/${submissionId}`, payload);
  return data;
}

export async function updateSubmissionStatus(submissionId, payload) {
  const { data } = await api.patch(`/submissions/${submissionId}/status`, payload);
  return data;
}
