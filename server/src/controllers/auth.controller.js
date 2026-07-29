import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/token.js";

function sendAuthResponse(res, statusCode, user) {
  const token = signToken(user);

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
}

export const signup = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create(req.body);
  sendAuthResponse(res, 201, user);
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.isBlocked) {
    throw new ApiError(403, "Your account has been blocked");
  }

  const isPasswordValid = await user.comparePassword(req.body.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.password = undefined;
  sendAuthResponse(res, 200, user);
});

export const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});
