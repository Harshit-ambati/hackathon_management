import mongoose from "mongoose";
import { Hackathon } from "../models/hackathon.model.js";
import { Review } from "../models/review.model.js";
import { Submission } from "../models/submission.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function assertObjectId(id, label) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label} id`);
  }
}

function assertOrganizerAccess(hackathon, user) {
  if (user.role === "admin") {
    return;
  }

  if (hackathon.organizer.toString() !== user._id.toString()) {
    throw new ApiError(403, "You can only publish results for your own hackathons");
  }
}

async function buildLeaderboard(hackathonId) {
  const submissions = await Submission.find({ hackathon: hackathonId })
    .populate("team", "name")
    .select("projectName team status");

  const rows = await Promise.all(
    submissions.map(async (submission) => {
      const reviews = await Review.find({ submission: submission._id, status: "completed" }).select("totalScore");
      const totalScore = reviews.reduce((sum, review) => sum + review.totalScore, 0);
      const averageScore = reviews.length ? Number((totalScore / reviews.length).toFixed(2)) : 0;

      return {
        submissionId: submission._id,
        teamId: submission.team?._id,
        teamName: submission.team?.name || "Unassigned team",
        projectName: submission.projectName,
        reviewCount: reviews.length,
        totalScore,
        averageScore,
        status: submission.status,
      };
    })
  );

  return rows
    .sort((a, b) => b.averageScore - a.averageScore || b.totalScore - a.totalScore)
    .map((row, index) => ({
      rank: index + 1,
      position: index === 0 ? "Winner" : index === 1 ? "Runner Up" : index === 2 ? "Second Runner Up" : "Finalist",
      ...row,
    }));
}

export const getLeaderboard = asyncHandler(async (req, res) => {
  assertObjectId(req.params.hackathonId, "hackathon");
  const hackathon = await Hackathon.findById(req.params.hackathonId).select("title status organizer");

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  const leaderboard = await buildLeaderboard(hackathon._id);
  res.json({ success: true, hackathon, leaderboard });
});

export const publishResults = asyncHandler(async (req, res) => {
  assertObjectId(req.params.hackathonId, "hackathon");
  const hackathon = await Hackathon.findById(req.params.hackathonId);

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  assertOrganizerAccess(hackathon, req.user);

  const leaderboard = await buildLeaderboard(hackathon._id);

  if (!leaderboard.length || leaderboard.every((row) => row.reviewCount === 0)) {
    throw new ApiError(400, "At least one completed review is required before publishing results");
  }

  hackathon.status = "completed";
  await hackathon.save();

  await Promise.all(
    leaderboard.map((row) => Submission.findByIdAndUpdate(row.submissionId, { status: row.reviewCount ? "approved" : "rejected" }))
  );

  res.json({ success: true, message: "Results published successfully", leaderboard });
});
