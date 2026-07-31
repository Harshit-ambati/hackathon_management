import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    hackathon: { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon", required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true, unique: true },
    projectName: { type: String, required: true, trim: true, maxlength: 120 },
    problemStatement: { type: String, required: true, trim: true, maxlength: 1200 },
    solution: { type: String, required: true, trim: true, maxlength: 2000 },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    githubRepository: { type: String, required: true, trim: true },
    liveDemoUrl: { type: String, trim: true },
    techStack: [{ type: String, trim: true, maxlength: 40 }],
    screenshots: [{ type: String, trim: true }],
    presentationPdf: { type: String, trim: true },
    demoVideoLink: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending",
    },
    statusNote: { type: String, trim: true, maxlength: 400 },
  },
  { timestamps: true }
);

submissionSchema.index({ hackathon: 1, status: 1 });
submissionSchema.index({ projectName: "text", problemStatement: "text", description: "text" });

export const Submission = mongoose.model("Submission", submissionSchema);
