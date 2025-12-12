import express from "express";
import { z } from "zod";
import { authRequired } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();

const profileUpdateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
});

router.get("/", authRequired, async (req, res) => {
  return res.json({ user: req.user.toJSON() });
});

router.put(
  "/",
  authRequired,
  validateBody(profileUpdateSchema),
  async (req, res) => {
    const updates = req.validatedBody;
    Object.assign(req.user, updates);
    await req.user.save();
    return res.json({ user: req.user.toJSON() });
  }
);

export default router;

