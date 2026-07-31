import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    innovation: { type: Number, required: true, min: 0, max: 10 },
    technicalComplexity: { type: Number, required: true, min: 0, max: 10 },
    userInterface: { type: Number, required: true, min: 0, max: 10 },
    functionality: { type: Number, required: true, min: 0, max: 10 },
    scalability: { type: Number, required: true, min: 0, max: 10 },
    documentation: { type: Number, required: true, min: 0, max: 10 },
    presentation: { type: Number, required: true, min: 0, max: 10 },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    hackathon: { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon", required: true },
    submission: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", required: true },
    judge: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scores: scoreSchema,
    totalScore: { type: Number, default: 0 },
    feedback: { type: String, trim: true, maxlength: 1200 },
    status: { type: String, enum: ["assigned", "completed"], default: "assigned" },
    completedAt: Date,
  },
  { timestamps: true }
);

reviewSchema.index({ submission: 1, judge: 1 }, { unique: true });
reviewSchema.index({ judge: 1, status: 1 });
reviewSchema.index({ hackathon: 1, status: 1 });

reviewSchema.pre("save", function calculateTotal(next) {
  if (this.scores) {
    this.totalScore = Object.values(this.scores.toObject ? this.scores.toObject() : this.scores).reduce((sum, score) => sum + Number(score || 0), 0);
  }

  next();
});

export const Review = mongoose.model("Review", reviewSchema);
