import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    note: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
  },
  { timestamps: true }
);

registrationSchema.index({ hackathon: 1, participant: 1 }, { unique: true });
registrationSchema.index({ participant: 1, status: 1 });
registrationSchema.index({ hackathon: 1, status: 1 });

export const Registration = mongoose.model("Registration", registrationSchema);
