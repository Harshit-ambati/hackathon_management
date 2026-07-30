import mongoose from "mongoose";
import { Hackathon } from "../models/hackathon.model.js";
import { Registration } from "../models/registration.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function assertObjectId(id, label) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${label} id`);
  }
}

async function findHackathon(id) {
  assertObjectId(id, "hackathon");
  const hackathon = await Hackathon.findById(id);

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  return hackathon;
}

function assertOrganizerAccess(hackathon, user) {
  if (user.role === "admin") {
    return;
  }

  if (hackathon.organizer.toString() !== user._id.toString()) {
    throw new ApiError(403, "You can only manage registrations for your own hackathons");
  }
}

export const registerForHackathon = asyncHandler(async (req, res) => {
  const hackathon = await findHackathon(req.params.hackathonId);

  if (hackathon.status !== "registration_open") {
    throw new ApiError(400, "Registration is not open for this hackathon");
  }

  if (hackathon.registrationDeadline < new Date()) {
    throw new ApiError(400, "Registration deadline has passed");
  }

  const existingRegistration = await Registration.findOne({
    hackathon: hackathon._id,
    participant: req.user._id,
  });

  if (existingRegistration && existingRegistration.status !== "cancelled") {
    throw new ApiError(409, "You are already registered for this hackathon");
  }

  if (existingRegistration) {
    existingRegistration.status = "pending";
    existingRegistration.note = undefined;
    existingRegistration.reviewedBy = undefined;
    existingRegistration.reviewedAt = undefined;
    await existingRegistration.save();
    return res.json({ success: true, registration: existingRegistration });
  }

  const registration = await Registration.create({
    hackathon: hackathon._id,
    participant: req.user._id,
  });

  res.status(201).json({ success: true, registration });
});

export const listMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ participant: req.user._id })
    .populate("hackathon", "title theme mode startDate endDate registrationDeadline status")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: registrations.length, registrations });
});

export const cancelRegistration = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, "registration");
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    throw new ApiError(404, "Registration not found");
  }

  if (registration.participant.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only cancel your own registrations");
  }

  if (registration.status === "rejected") {
    throw new ApiError(400, "Rejected registrations cannot be cancelled");
  }

  registration.status = "cancelled";
  registration.note = "Cancelled by participant";
  await registration.save();

  res.json({ success: true, registration });
});

export const listHackathonRegistrations = asyncHandler(async (req, res) => {
  const hackathon = await findHackathon(req.params.hackathonId);
  assertOrganizerAccess(hackathon, req.user);

  const filter = { hackathon: hackathon._id };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const registrations = await Registration.find(filter)
    .populate("participant", "name email college skills")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: registrations.length, registrations });
});

export const reviewRegistration = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, "registration");
  const registration = await Registration.findById(req.params.id).populate("hackathon");

  if (!registration) {
    throw new ApiError(404, "Registration not found");
  }

  assertOrganizerAccess(registration.hackathon, req.user);

  if (registration.status === "cancelled") {
    throw new ApiError(400, "Cancelled registrations cannot be reviewed");
  }

  registration.status = req.body.status;
  registration.note = req.body.note;
  registration.reviewedBy = req.user._id;
  registration.reviewedAt = new Date();
  await registration.save();

  res.json({ success: true, registration });
});
