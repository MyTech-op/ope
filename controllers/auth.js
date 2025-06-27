import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { phone, role, email, password } = req.body;

  if (!phone) throw new BadRequestError("Phone number is required");
  if (!password) throw new BadRequestError("Password is required");
  if (!role || !["customer", "rider"].includes(role)) {
    throw new BadRequestError("Valid role is required (customer or rider)");
  }

  let user = await User.findOne({ phone });

  if (user) {
    if (user.role !== role) {
      throw new BadRequestError("Phone number and role do not match");
    }
    throw new BadRequestError("User already exists");
  }

  user = new User({ phone, email, role, password });

  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();
  user.refreshToken = refreshToken;

  await user.save();

  return res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    statusMessage: "Success",
    message: "User Registerd  successfully",
    data: {
      id: user._id,
      phone: user.phone,
      role: user.role,
      email: user.email,
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  });
};


export const login = async (req, res) => {
  const { phone, role, password } = req.body;

  if (!phone) throw new BadRequestError("Phone number is required");
  if (!password) throw new BadRequestError("Password is required");
  if (!role || !["customer", "rider"].includes(role)) {
    throw new BadRequestError("Valid role is required (customer or rider)");
  }

  const user = await User.findOne({ phone }).select("+password");

  if (!user || user.role !== role) {
    throw new BadRequestError("Invalid phone or role");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new BadRequestError("Invalid password");
  }

  const accessToken = user.createAccessToken();
  let refreshToken = user.refreshToken;

  // Optional: Regenerate refreshToken if expired or not present
  if (!refreshToken) {
    refreshToken = user.createRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
  }

  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    statusMessage: "Success",
    message: "User logged in successfully",
    data: {
      id: user._id,
      phone: user.phone,
      role: user.role,
      email: user.email,
    },
    access_token: accessToken,
    refresh_token: refreshToken,
  });
};


export const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    throw new BadRequestError("Refresh token is required");
  }

  try {
    const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id);

    if (!user) {
      throw new UnauthenticatedError("Invalid refresh token");
    }

    const newAccessToken = user.createAccessToken();
    const newRefreshToken = user.createRefreshToken();

    res.status(StatusCodes.OK).json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });
  } catch (error) {
    console.error(error);
    throw new UnauthenticatedError("Invalid refresh token");
  }
};
