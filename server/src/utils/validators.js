import { z } from "zod";
import { roles } from "../models/user.model.js";

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.enum(roles).optional(),
  college: z.string().trim().max(120).optional(),
  skills: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});

const hackathonBaseSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(20).max(3000),
  theme: z.string().trim().min(2).max(80),
  mode: z.enum(["online", "offline", "hybrid"]),
  venue: z.string().trim().max(160).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  registrationDeadline: z.coerce.date(),
  bannerImage: z.string().trim().url().optional().or(z.literal("")),
  prizePool: z.string().trim().max(80).optional(),
  maxTeamSize: z.coerce.number().int().min(1).max(10),
  rules: z.array(z.string().trim().min(1).max(300)).max(30).optional(),
  judgingCriteria: z.array(z.string().trim().min(1).max(120)).max(20).optional(),
  status: z.enum(["draft", "registration_open", "registration_closed", "ongoing", "completed", "cancelled"]).optional(),
});

function validateHackathonDates(data, context) {
  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    context.addIssue({
      code: "custom",
      path: ["endDate"],
      message: "End date must be after the start date",
    });
  }

  if (data.startDate && data.registrationDeadline && data.registrationDeadline > data.startDate) {
    context.addIssue({
      code: "custom",
      path: ["registrationDeadline"],
      message: "Registration deadline must be before the hackathon starts",
    });
  }
}

export const hackathonSchema = hackathonBaseSchema.superRefine(validateHackathonDates);
export const hackathonUpdateSchema = hackathonBaseSchema.partial().superRefine(validateHackathonDates);

export const registrationReviewSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  note: z.string().trim().max(300).optional(),
});

export const teamCreateSchema = z.object({
  hackathonId: z.string().trim().min(1),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
});

export const teamUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  description: z.string().trim().max(500).optional(),
});

export const teamMemberSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
});

export const transferLeadershipSchema = z.object({
  userId: z.string().trim().min(1),
});

export const submissionSchema = z.object({
  teamId: z.string().trim().min(1),
  projectName: z.string().trim().min(3).max(120),
  problemStatement: z.string().trim().min(10).max(1200),
  solution: z.string().trim().min(10).max(2000),
  description: z.string().trim().min(20).max(3000),
  githubRepository: z.string().trim().url(),
  liveDemoUrl: z.string().trim().url().optional().or(z.literal("")),
  techStack: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  screenshots: z.array(z.string().trim().url()).max(8).optional(),
  presentationPdf: z.string().trim().url().optional().or(z.literal("")),
  demoVideoLink: z.string().trim().url().optional().or(z.literal("")),
});

export const submissionUpdateSchema = submissionSchema.omit({ teamId: true }).partial();

export const submissionStatusSchema = z.object({
  status: z.enum(["pending", "under_review", "approved", "rejected"]),
  statusNote: z.string().trim().max(400).optional(),
});

export const judgeAssignmentSchema = z.object({
  submissionId: z.string().trim().min(1),
  judgeId: z.string().trim().min(1),
});

export const reviewSubmitSchema = z.object({
  scores: z.object({
    innovation: z.coerce.number().min(0).max(10),
    technicalComplexity: z.coerce.number().min(0).max(10),
    userInterface: z.coerce.number().min(0).max(10),
    functionality: z.coerce.number().min(0).max(10),
    scalability: z.coerce.number().min(0).max(10),
    documentation: z.coerce.number().min(0).max(10),
    presentation: z.coerce.number().min(0).max(10),
  }),
  feedback: z.string().trim().min(5).max(1200),
});
