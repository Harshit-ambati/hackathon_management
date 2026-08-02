import { Hackathon } from "../models/hackathon.model.js";
import { Registration } from "../models/registration.model.js";
import { Review } from "../models/review.model.js";
import { Submission } from "../models/submission.model.js";
import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function adminStats() {
  const [users, hackathons, teams, submissions, reviews] = await Promise.all([
    User.countDocuments(),
    Hackathon.countDocuments(),
    Team.countDocuments(),
    Submission.countDocuments(),
    Review.countDocuments(),
  ]);

  return [
    { label: "Total users", value: users },
    { label: "Hackathons", value: hackathons },
    { label: "Teams", value: teams },
    { label: "Submissions", value: submissions },
    { label: "Reviews", value: reviews },
  ];
}

async function organizerStats(userId) {
  const hackathons = await Hackathon.find({ organizer: userId }).select("_id status");
  const ids = hackathons.map((hackathon) => hackathon._id);
  const [registrations, submissions, completed] = await Promise.all([
    Registration.countDocuments({ hackathon: { $in: ids } }),
    Submission.countDocuments({ hackathon: { $in: ids } }),
    Hackathon.countDocuments({ _id: { $in: ids }, status: "completed" }),
  ]);

  return [
    { label: "My hackathons", value: hackathons.length },
    { label: "Registrations", value: registrations },
    { label: "Submissions", value: submissions },
    { label: "Published results", value: completed },
  ];
}

async function participantStats(userId) {
  const [registrations, teams, submissions] = await Promise.all([
    Registration.countDocuments({ participant: userId }),
    Team.countDocuments({ "members.user": userId }),
    Team.find({ "members.user": userId }).select("_id"),
  ]);

  const submissionCount = await Submission.countDocuments({ team: { $in: submissions.map((team) => team._id) } });

  return [
    { label: "Registered hackathons", value: registrations },
    { label: "Teams", value: teams },
    { label: "Submissions", value: submissionCount },
    { label: "Results available", value: await Hackathon.countDocuments({ status: "completed" }) },
  ];
}

async function judgeStats(userId) {
  const [assigned, pending, completed] = await Promise.all([
    Review.countDocuments({ judge: userId }),
    Review.countDocuments({ judge: userId, status: "assigned" }),
    Review.countDocuments({ judge: userId, status: "completed" }),
  ]);

  return [
    { label: "Assigned projects", value: assigned },
    { label: "Pending reviews", value: pending },
    { label: "Completed reviews", value: completed },
    { label: "Feedback sent", value: completed },
  ];
}

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const roleHandlers = {
    admin: adminStats,
    organizer: () => organizerStats(req.user._id),
    participant: () => participantStats(req.user._id),
    judge: () => judgeStats(req.user._id),
  };

  const stats = await roleHandlers[req.user.role]();

  res.json({
    success: true,
    role: req.user.role,
    stats,
  });
});
