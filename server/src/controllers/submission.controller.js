import mongoose from "mongoose";
import { Hackathon } from "../models/hackathon.model.js";
import { Submission } from "../models/submission.model.js";
import { Team } from "../models/team.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function assertObjectId(id, label) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label} id`);
  }
}

async function findTeamForLeader(teamId, user) {
  assertObjectId(teamId, "team");
  const team = await Team.findById(teamId).populate("hackathon", "title endDate organizer");

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  if (team.leader.toString() !== user._id.toString()) {
    throw new ApiError(403, "Only the team leader can submit or edit the project");
  }

  return team;
}

function assertBeforeDeadline(team) {
  if (team.hackathon.endDate < new Date()) {
    throw new ApiError(400, "Submission deadline has passed");
  }
}

function assertOrganizerAccess(hackathon, user) {
  if (user.role === "admin") {
    return;
  }

  if (hackathon.organizer.toString() !== user._id.toString()) {
    throw new ApiError(403, "You can only view submissions for your own hackathons");
  }
}

export const createSubmission = asyncHandler(async (req, res) => {
  const team = await findTeamForLeader(req.body.teamId, req.user);
  assertBeforeDeadline(team);

  const existingSubmission = await Submission.findOne({ team: team._id });

  if (existingSubmission) {
    throw new ApiError(409, "This team has already submitted a project");
  }

  const submission = await Submission.create({
    ...req.body,
    team: team._id,
    hackathon: team.hackathon._id,
  });

  res.status(201).json({ success: true, submission });
});

export const listMySubmissions = asyncHandler(async (req, res) => {
  const teams = await Team.find({ "members.user": req.user._id }).select("_id");
  const submissions = await Submission.find({ team: { $in: teams.map((team) => team._id) } })
    .populate("hackathon", "title theme mode startDate endDate status")
    .populate("team", "name leader")
    .sort({ updatedAt: -1 });

  res.json({ success: true, count: submissions.length, submissions });
});

export const listHackathonSubmissions = asyncHandler(async (req, res) => {
  assertObjectId(req.params.hackathonId, "hackathon");
  const hackathon = await Hackathon.findById(req.params.hackathonId);

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  assertOrganizerAccess(hackathon, req.user);

  const filter = { hackathon: hackathon._id };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const submissions = await Submission.find(filter)
    .populate("team", "name leader members")
    .populate("hackathon", "title")
    .sort({ updatedAt: -1 });

  res.json({ success: true, count: submissions.length, submissions });
});

export const getSubmission = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, "submission");
  const submission = await Submission.findById(req.params.id)
    .populate("hackathon", "title organizer endDate")
    .populate("team", "name leader members");

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  const isTeamMember = submission.team.members.some((member) => member.user.toString() === req.user._id.toString());
  const isOrganizer = req.user.role === "organizer" && submission.hackathon.organizer.toString() === req.user._id.toString();

  if (!isTeamMember && !isOrganizer && req.user.role !== "admin" && req.user.role !== "judge") {
    throw new ApiError(403, "You do not have access to this submission");
  }

  res.json({ success: true, submission });
});

export const updateSubmission = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, "submission");
  const submission = await Submission.findById(req.params.id).populate({ path: "team", populate: { path: "hackathon", select: "endDate" } });

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  if (submission.team.leader.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the team leader can edit the submission");
  }

  if (submission.team.hackathon.endDate < new Date()) {
    throw new ApiError(400, "Submission deadline has passed");
  }

  Object.assign(submission, req.body, { status: "pending", statusNote: undefined });
  await submission.save();

  res.json({ success: true, submission });
});

export const updateSubmissionStatus = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, "submission");
  const submission = await Submission.findById(req.params.id).populate("hackathon", "organizer");

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  assertOrganizerAccess(submission.hackathon, req.user);

  submission.status = req.body.status;
  submission.statusNote = req.body.statusNote;
  await submission.save();

  res.json({ success: true, submission });
});
