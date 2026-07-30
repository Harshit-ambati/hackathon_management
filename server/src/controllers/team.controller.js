import mongoose from "mongoose";
import { Hackathon } from "../models/hackathon.model.js";
import { Registration } from "../models/registration.model.js";
import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function assertObjectId(id, label) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label} id`);
  }
}

async function findTeam(id) {
  assertObjectId(id, "team");
  const team = await Team.findById(id)
    .populate("hackathon", "title maxTeamSize organizer")
    .populate("leader", "name email")
    .populate("members.user", "name email college skills");

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  return team;
}

function assertLeader(team, user) {
  const leaderId = typeof team.leader === "object" ? team.leader._id : team.leader;

  if (leaderId.toString() !== user._id.toString()) {
    throw new ApiError(403, "Only the team leader can perform this action");
  }
}

function assertOrganizerAccess(hackathon, user) {
  if (user.role === "admin") {
    return;
  }

  if (hackathon.organizer.toString() !== user._id.toString()) {
    throw new ApiError(403, "You can only view teams for your own hackathons");
  }
}

async function assertApprovedRegistration(hackathonId, participantId) {
  const registration = await Registration.findOne({
    hackathon: hackathonId,
    participant: participantId,
    status: "approved",
  });

  if (!registration) {
    throw new ApiError(403, "Participant must have an approved registration for this hackathon");
  }
}

async function assertParticipantHasNoTeam(hackathonId, participantId) {
  const existingTeam = await Team.findOne({
    hackathon: hackathonId,
    "members.user": participantId,
  });

  if (existingTeam) {
    throw new ApiError(409, "Participant already belongs to a team for this hackathon");
  }
}

export const createTeam = asyncHandler(async (req, res) => {
  assertObjectId(req.body.hackathonId, "hackathon");
  const hackathon = await Hackathon.findById(req.body.hackathonId);

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  await assertApprovedRegistration(hackathon._id, req.user._id);
  await assertParticipantHasNoTeam(hackathon._id, req.user._id);

  const team = await Team.create({
    hackathon: hackathon._id,
    name: req.body.name,
    description: req.body.description,
    leader: req.user._id,
    members: [{ user: req.user._id, role: "leader" }],
  });

  res.status(201).json({ success: true, team });
});

export const listMyTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({ "members.user": req.user._id })
    .populate("hackathon", "title theme mode startDate endDate status")
    .populate("leader", "name email")
    .populate("members.user", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: teams.length, teams });
});

export const listHackathonTeams = asyncHandler(async (req, res) => {
  assertObjectId(req.params.hackathonId, "hackathon");
  const hackathon = await Hackathon.findById(req.params.hackathonId);

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  assertOrganizerAccess(hackathon, req.user);

  const filter = { hackathon: hackathon._id };

  if (req.query.search) {
    filter.name = new RegExp(req.query.search, "i");
  }

  const teams = await Team.find(filter)
    .populate("leader", "name email")
    .populate("members.user", "name email college skills")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: teams.length, teams });
});

export const getTeam = asyncHandler(async (req, res) => {
  const team = await findTeam(req.params.id);
  const isMember = team.members.some((member) => member.user._id.toString() === req.user._id.toString());
  const isOrganizer = req.user.role === "organizer" && team.hackathon.organizer.toString() === req.user._id.toString();

  if (!isMember && !isOrganizer && req.user.role !== "admin") {
    throw new ApiError(403, "You do not have access to this team");
  }

  res.json({ success: true, team });
});

export const updateTeam = asyncHandler(async (req, res) => {
  const team = await findTeam(req.params.id);
  assertLeader(team, req.user);

  Object.assign(team, req.body);
  await team.save();

  res.json({ success: true, team });
});

export const addMember = asyncHandler(async (req, res) => {
  const team = await findTeam(req.params.id);
  assertLeader(team, req.user);

  if (team.members.length >= team.hackathon.maxTeamSize) {
    throw new ApiError(400, "Team has reached the maximum team size");
  }

  const user = await User.findOne({ email: req.body.email, role: "participant" });

  if (!user) {
    throw new ApiError(404, "Participant not found");
  }

  await assertApprovedRegistration(team.hackathon._id, user._id);
  await assertParticipantHasNoTeam(team.hackathon._id, user._id);

  team.members.push({ user: user._id, role: "member" });
  await team.save();

  res.json({ success: true, team });
});

export const removeMember = asyncHandler(async (req, res) => {
  const team = await findTeam(req.params.id);
  assertLeader(team, req.user);
  assertObjectId(req.params.userId, "user");

  if (req.params.userId === team.leader._id.toString()) {
    throw new ApiError(400, "Transfer leadership before removing the leader");
  }

  team.members = team.members.filter((member) => member.user._id.toString() !== req.params.userId);
  await team.save();

  res.json({ success: true, team });
});

export const leaveTeam = asyncHandler(async (req, res) => {
  const team = await findTeam(req.params.id);

  if (team.leader._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "Transfer leadership before leaving the team");
  }

  const isMember = team.members.some((member) => member.user._id.toString() === req.user._id.toString());

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this team");
  }

  team.members = team.members.filter((member) => member.user._id.toString() !== req.user._id.toString());
  await team.save();

  res.json({ success: true, team });
});

export const transferLeadership = asyncHandler(async (req, res) => {
  const team = await findTeam(req.params.id);
  assertLeader(team, req.user);
  assertObjectId(req.body.userId, "user");

  const nextLeader = team.members.find((member) => member.user._id.toString() === req.body.userId);

  if (!nextLeader) {
    throw new ApiError(400, "New leader must be a current team member");
  }

  team.leader = nextLeader.user._id;
  team.members = team.members.map((member) => ({
    user: member.user._id,
    role: member.user._id.toString() === req.body.userId ? "leader" : "member",
    joinedAt: member.joinedAt,
  }));
  await team.save();

  res.json({ success: true, team });
});

export const deleteTeam = asyncHandler(async (req, res) => {
  const team = await findTeam(req.params.id);
  assertLeader(team, req.user);
  await team.deleteOne();

  res.json({ success: true, message: "Team deleted successfully" });
});
