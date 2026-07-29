import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    theme: { type: String, required: true, trim: true, maxlength: 80 },
    mode: { type: String, enum: ["online", "offline", "hybrid"], required: true },
    venue: { type: String, trim: true, maxlength: 160 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    bannerImage: { type: String, trim: true },
    prizePool: { type: String, trim: true, maxlength: 80 },
    maxTeamSize: { type: Number, required: true, min: 1, max: 10 },
    rules: [{ type: String, trim: true, maxlength: 300 }],
    judgingCriteria: [{ type: String, trim: true, maxlength: 120 }],
    status: {
      type: String,
      enum: ["draft", "registration_open", "registration_closed", "ongoing", "completed", "cancelled"],
      default: "draft",
    },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

hackathonSchema.index({ title: "text", description: "text", theme: "text" });
hackathonSchema.index({ organizer: 1, status: 1 });
hackathonSchema.index({ startDate: 1, registrationDeadline: 1 });

export const Hackathon = mongoose.model("Hackathon", hackathonSchema);
