import assert from "node:assert/strict";
import { Hackathon } from "../models/hackathon.model.js";
import { Registration } from "../models/registration.model.js";
import { Review } from "../models/review.model.js";
import { Submission } from "../models/submission.model.js";
import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";
import {
  hackathonSchema,
  judgeAssignmentSchema,
  registrationReviewSchema,
  reviewSubmitSchema,
  submissionSchema,
  teamCreateSchema,
} from "../utils/validators.js";

const futureStart = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
const futureEnd = new Date(Date.now() + 1000 * 60 * 60 * 24 * 8).toISOString();
const registrationDeadline = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

assert.equal(hackathonSchema.safeParse({
  title: "Sample Hack",
  description: "A valid hackathon description for schema smoke testing.",
  theme: "AI",
  mode: "online",
  startDate: futureStart,
  endDate: futureEnd,
  registrationDeadline,
  maxTeamSize: 4,
}).success, true);

assert.equal(registrationReviewSchema.safeParse({ status: "approved" }).success, true);
assert.equal(teamCreateSchema.safeParse({ hackathonId: "abc", name: "Team Alpha" }).success, true);
assert.equal(submissionSchema.safeParse({
  teamId: "team-id",
  projectName: "SprintBoard",
  problemStatement: "A clear problem statement",
  solution: "A clear solution statement",
  description: "A useful long enough project description.",
  githubRepository: "https://github.com/Harshit-ambati/hackathon_management",
}).success, true);
assert.equal(judgeAssignmentSchema.safeParse({ submissionId: "sub", judgeId: "judge" }).success, true);
assert.equal(reviewSubmitSchema.safeParse({
  scores: {
    innovation: 8,
    technicalComplexity: 8,
    userInterface: 9,
    functionality: 8,
    scalability: 7,
    documentation: 8,
    presentation: 9,
  },
  feedback: "Strong project delivery.",
}).success, true);

const user = new User({ name: "Participant One", email: "participant1@codearena.test", password: "Password123", role: "participant" });
const hackathon = new Hackathon({
  title: "Sample Hack",
  description: "A valid hackathon description for model smoke testing.",
  theme: "AI",
  mode: "online",
  startDate: futureStart,
  endDate: futureEnd,
  registrationDeadline,
  maxTeamSize: 4,
  organizer: user._id,
});
const registration = new Registration({ hackathon: hackathon._id, participant: user._id });
const team = new Team({ hackathon: hackathon._id, name: "Team Alpha", leader: user._id, members: [{ user: user._id, role: "leader" }] });
const submission = new Submission({
  hackathon: hackathon._id,
  team: team._id,
  projectName: "SprintBoard",
  problemStatement: "A clear problem statement",
  solution: "A clear solution statement",
  description: "A useful long enough project description.",
  githubRepository: "https://github.com/Harshit-ambati/hackathon_management",
});
const review = new Review({
  hackathon: hackathon._id,
  submission: submission._id,
  judge: user._id,
  scores: {
    innovation: 8,
    technicalComplexity: 8,
    userInterface: 9,
    functionality: 8,
    scalability: 7,
    documentation: 8,
    presentation: 9,
  },
  feedback: "Strong project delivery.",
  status: "completed",
});

await Promise.all([
  user.validate(),
  hackathon.validate(),
  registration.validate(),
  team.validate(),
  submission.validate(),
  review.validate(),
]);

await review.save().catch(() => {});
assert.equal(review.totalScore, 57);

console.log("Model and validator smoke checks passed for sample users and workflow data.");
