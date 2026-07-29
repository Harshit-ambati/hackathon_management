import mongoose from "mongoose";
import { Hackathon } from "../models/hackathon.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function buildHackathonQuery(query) {
  const filter = {};
  const now = new Date();

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.mode) {
    filter.mode = query.mode;
  }

  if (query.theme) {
    filter.theme = new RegExp(query.theme, "i");
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.timeline === "upcoming") {
    filter.startDate = { $gt: now };
  }

  if (query.timeline === "ongoing") {
    filter.startDate = { $lte: now };
    filter.endDate = { $gte: now };
  }

  if (query.timeline === "completed") {
    filter.endDate = { $lt: now };
  }

  if (query.registration === "open") {
    filter.registrationDeadline = { $gte: now };
    filter.status = "registration_open";
  }

  if (query.registration === "closed") {
    filter.$or = [{ registrationDeadline: { $lt: now } }, { status: "registration_closed" }];
  }

  return filter;
}

async function findHackathonForOwner(id, user) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid hackathon id");
  }

  const hackathon = await Hackathon.findById(id);

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  if (user.role !== "admin" && hackathon.organizer.toString() !== user._id.toString()) {
    throw new ApiError(403, "You can only modify your own hackathons");
  }

  return hackathon;
}

export const createHackathon = asyncHandler(async (req, res) => {
  const hackathon = await Hackathon.create({ ...req.body, organizer: req.user._id });
  res.status(201).json({ success: true, hackathon });
});

export const listHackathons = asyncHandler(async (req, res) => {
  const filter = buildHackathonQuery(req.query);
  const hackathons = await Hackathon.find(filter).populate("organizer", "name email").sort({ startDate: 1 });
  res.json({ success: true, count: hackathons.length, hackathons });
});

export const getHackathon = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ApiError(400, "Invalid hackathon id");
  }

  const hackathon = await Hackathon.findById(req.params.id).populate("organizer", "name email");

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  res.json({ success: true, hackathon });
});

export const updateHackathon = asyncHandler(async (req, res) => {
  const hackathon = await findHackathonForOwner(req.params.id, req.user);
  Object.assign(hackathon, req.body);
  await hackathon.save();
  res.json({ success: true, hackathon });
});

export const deleteHackathon = asyncHandler(async (req, res) => {
  const hackathon = await findHackathonForOwner(req.params.id, req.user);
  await hackathon.deleteOne();
  res.json({ success: true, message: "Hackathon deleted successfully" });
});
