import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "User not found for token" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT error", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

