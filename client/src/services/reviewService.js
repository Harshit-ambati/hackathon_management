import { api } from "./api";

export async function assignJudge(payload) {
  const { data } = await api.post("/reviews/assign", payload);
  return data;
}

export async function getAssignedReviews(params = {}) {
  const { data } = await api.get("/reviews/assigned", { params });
  return data;
}

export async function submitReview(reviewId, payload) {
  const { data } = await api.patch(`/reviews/${reviewId}`, payload);
  return data;
}

export async function getHackathonReviews(hackathonId) {
  const { data } = await api.get(`/reviews/hackathons/${hackathonId}`);
  return data;
}
