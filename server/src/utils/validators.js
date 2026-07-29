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
