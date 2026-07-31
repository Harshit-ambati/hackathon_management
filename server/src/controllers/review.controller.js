import mongoose from "mongoose";
import { Hackathon } from "../models/hackathon.model.js";
import { Review } from "../models/review.model.js";
import { Submission } from "../models/submission.model.js";
import { User } from "../models/user.model.js";
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
    throw new ApiError(403, "You can only manage judges for your own hackathons");
  }
}

export const assignJudge = asyncHandler(async (req, res) => {
  assertObjectId(req.body.submissionId, "submission");
  assertObjectId(req.body.judgeId, "judge");

  const submission = await Submission.findById(req.body.submissionId).populate("hackathon", "organizer title");

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  assertOrganizerAccess(submission.hackathon, req.user);

  const judge = await User.findOne({ _id: req.body.judgeId, role: "judge", isBlocked: false });

  if (!judge) {
    throw new ApiError(404, "Active judge not found");
  }

  const review = await Review.findOneAndUpdate(
    { submission: submission._id, judge: judge._id },
    { hackathon: submission.hackathon._id, submission: submission._id, judge: judge._id },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  submission.status = "under_review";
  await submission.save();

  res.status(201).json({ success: true, review });
});

export const listAssignedReviews = asyncHandler(async (req, res) => {
  const filter = { judge: req.user._id };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const reviews = await Review.find(filter)
    .populate("hackathon", "title theme mode")
    .populate({ path: "submission", populate: { path: "team", select: "name" } })
    .sort({ updatedAt: -1 });

  res.json({ success: true, count: reviews.length, reviews });
});

export const submitReview = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, "review");
  const review = await Review.findById(req.params.id).populate("submission");

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.judge.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only submit your assigned reviews");
  }

  review.scores = req.body.scores;
  review.feedback = req.body.feedback;
  review.status = "completed";
  review.completedAt = new Date();
  await review.save();

  review.submission.status = "under_review";
  await review.submission.save();

  res.json({ success: true, review });
});

export const listHackathonReviews = asyncHandler(async (req, res) => {
  assertObjectId(req.params.hackathonId, "hackathon");
  const hackathon = await Hackathon.findById(req.params.hackathonId);

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  assertOrganizerAccess(hackathon, req.user);

  const reviews = await Review.find({ hackathon: hackathon._id })
    .populate("judge", "name email")
    .populate({ path: "submission", populate: { path: "team", select: "name" } })
    .sort({ updatedAt: -1 });

  res.json({ success: true, count: reviews.length, reviews });
});
