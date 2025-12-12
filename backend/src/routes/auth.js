import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();
const saltRounds = 10;

const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "7d",
  });
}

router.post("/signup", validateBody(signupSchema), async (req, res) => {
  const { name, email, password } = req.validatedBody;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken(user.id);
  return res.status(201).json({ token, user: user.toJSON() });
});

router.post("/login", validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.validatedBody;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = signToken(user.id);
  return res.json({ token, user: user.toJSON() });
});

export default router;

