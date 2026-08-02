import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const roles = ["admin", "organizer", "participant", "judge"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: roles,
      default: "participant",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    college: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    skills: [
      {
        type: String,
        trim: true,
        maxlength: 40,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = mongoose.model("User", userSchema);
export { roles };
