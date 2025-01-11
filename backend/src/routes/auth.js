import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middlewares/auth.js";
import bcrypt from "bcryptjs";
import { z } from "zod";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const requestBodySchema = z.object({
      email: z.string().email().min(5).max(100),
      password: z.string().min(8).max(100),
      fullName: z.string().min(3).max(50),
      avatarUrl: z.string(),
      username: z.string(),
    });

    const isparsedDataSuccess = requestBodySchema.safeParse(req.body);

    if (!isparsedDataSuccess.success) {
      res.status(401).json({
        success: false,
        message: isparsedDataSuccess.error.issues[0].message,
        error: isparsedDataSuccess.error,
      });
      return;
    }

    const { username, email, password, fullName, avatarUrl } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      avatarUrl: avatarUrl || "",
      fullName,
    });

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while registering user",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const requestBodySchema = z.object({
      email: z.string().email().min(5).max(100),
      password: z.string().min(8).max(100),
    });

    const isparsedDataSuccess = requestBodySchema.safeParse(req.body);

    if (!isparsedDataSuccess.success) {
      res.status(401).json({
        success: false,
        message: isparsedDataSuccess.error.issues[0].message,
        error: isparsedDataSuccess.error,
      });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      message: "User log in successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl || "",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while logging user in",
      error: error.message,
    });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Fetched User Details successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user details",
      error: error.message,
    });
  }
});

export default router;
