import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { Hackathon } from "../models/hackathon.model.js";
import { Registration } from "../models/registration.model.js";
import { Review } from "../models/review.model.js";
import { Submission } from "../models/submission.model.js";
import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";

const sampleUsers = [
  { name: "Admin User", email: "admin@codearena.test", password: "Password123", role: "admin" },
  { name: "Organizer User", email: "organizer@codearena.test", password: "Password123", role: "organizer" },
  { name: "Judge User", email: "judge@codearena.test", password: "Password123", role: "judge" },
  { name: "Participant One", email: "participant1@codearena.test", password: "Password123", role: "participant", college: "CodeArena Institute", skills: ["React", "Node"] },
  { name: "Participant Two", email: "participant2@codearena.test", password: "Password123", role: "participant", college: "CodeArena Institute", skills: ["MongoDB", "UI"] },
];

async function resetSampleData() {
  const sampleEmails = sampleUsers.map((user) => user.email);
  const users = await User.find({ email: { $in: sampleEmails } }).select("_id");
  const userIds = users.map((user) => user._id);
  const hackathons = await Hackathon.find({ title: "CodeArena Sample Sprint" }).select("_id");
  const hackathonIds = hackathons.map((hackathon) => hackathon._id);
  const teams = await Team.find({ hackathon: { $in: hackathonIds } }).select("_id");
  const teamIds = teams.map((team) => team._id);
  const submissions = await Submission.find({ team: { $in: teamIds } }).select("_id");
  const submissionIds = submissions.map((submission) => submission._id);

  await Promise.all([
    Review.deleteMany({ $or: [{ submission: { $in: submissionIds } }, { judge: { $in: userIds } }, { hackathon: { $in: hackathonIds } }] }),
    Submission.deleteMany({ $or: [{ _id: { $in: submissionIds } }, { team: { $in: teamIds } }] }),
    Team.deleteMany({ $or: [{ _id: { $in: teamIds } }, { "members.user": { $in: userIds } }] }),
    Registration.deleteMany({ $or: [{ hackathon: { $in: hackathonIds } }, { participant: { $in: userIds } }] }),
    Hackathon.deleteMany({ _id: { $in: hackathonIds } }),
    User.deleteMany({ email: { $in: sampleEmails } }),
  ]);
}

async function createSampleData() {
  const createdUsers = {};

  for (const user of sampleUsers) {
    createdUsers[user.role + user.email] = await User.create(user);
  }

  const organizer = createdUsers["organizerorganizer@codearena.test"];
  const judge = createdUsers["judgejudge@codearena.test"];
  const participantOne = createdUsers["participantparticipant1@codearena.test"];
  const participantTwo = createdUsers["participantparticipant2@codearena.test"];
  const now = Date.now();

  const hackathon = await Hackathon.create({
    title: "CodeArena Sample Sprint",
    description: "A seeded hackathon used to verify registration, teams, submissions, reviews, and leaderboard workflows.",
    theme: "Student Innovation",
    mode: "online",
    venue: "Virtual",
    startDate: new Date(now + 1000 * 60 * 60 * 24 * 7),
    endDate: new Date(now + 1000 * 60 * 60 * 24 * 9),
    registrationDeadline: new Date(now + 1000 * 60 * 60 * 24 * 3),
    prizePool: "Rs 50,000",
    maxTeamSize: 4,
    rules: ["Original work only", "Submit before deadline"],
    judgingCriteria: ["Innovation", "Functionality", "Presentation"],
    status: "registration_open",
    organizer: organizer._id,
  });

  const registrations = await Registration.create([
    { hackathon: hackathon._id, participant: participantOne._id, status: "approved", reviewedBy: organizer._id, reviewedAt: new Date() },
    { hackathon: hackathon._id, participant: participantTwo._id, status: "approved", reviewedBy: organizer._id, reviewedAt: new Date() },
  ]);

  const team = await Team.create({
    hackathon: hackathon._id,
    name: "Sample Builders",
    description: "A sample team for smoke testing.",
    leader: participantOne._id,
    members: [
      { user: participantOne._id, role: "leader" },
      { user: participantTwo._id, role: "member" },
    ],
  });

  const submission = await Submission.create({
    hackathon: hackathon._id,
    team: team._id,
    projectName: "SprintBoard",
    problemStatement: "Hackathon teams need one place to track ideas and delivery progress.",
    solution: "SprintBoard gives teams a lightweight collaboration and submission workflow.",
    description: "A full-stack sample project used to verify project submission and judging flows inside CodeArena.",
    githubRepository: "https://github.com/Harshit-ambati/hackathon_management",
    liveDemoUrl: "https://example.com",
    techStack: ["React", "Node", "MongoDB"],
    status: "under_review",
  });

  const review = await Review.create({
    hackathon: hackathon._id,
    submission: submission._id,
    judge: judge._id,
    scores: {
      innovation: 8,
      technicalComplexity: 8,
      userInterface: 9,
      functionality: 8,
      scalability: 7,
      documentation: 8,
      presentation: 9,
    },
    feedback: "Strong sample submission with complete workflow coverage.",
    status: "completed",
    completedAt: new Date(),
  });

  return { hackathon, registrations, team, submission, review };
}

async function main() {
  await connectDatabase();
  await resetSampleData();
  const sample = await createSampleData();

  console.log("Sample users created:");
  for (const user of sampleUsers) {
    console.log(`- ${user.role}: ${user.email} / ${user.password}`);
  }
  console.log(`Hackathon: ${sample.hackathon.title}`);
  console.log(`Approved registrations: ${sample.registrations.length}`);
  console.log(`Team: ${sample.team.name}`);
  console.log(`Submission: ${sample.submission.projectName}`);
  console.log(`Review total score: ${sample.review.totalScore}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
