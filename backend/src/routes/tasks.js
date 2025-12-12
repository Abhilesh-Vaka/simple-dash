import express from "express";
import { z } from "zod";
import { authRequired } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { Task } from "../models/Task.js";

const router = express.Router();

const baseTaskSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  tags: z.array(z.string().min(1).max(30)).optional(),
  dueDate: z.string().datetime().optional(),
});

router.get("/", authRequired, async (req, res) => {
  const { search, status, tag } = req.query;
  const filter = { owner: req.user.id };
  if (status) filter.status = status;
  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  return res.json({ tasks });
});

router.post("/", authRequired, validateBody(baseTaskSchema), async (req, res) => {
  const payload = { ...req.validatedBody, owner: req.user.id };
  const task = await Task.create(payload);
  return res.status(201).json({ task });
});

router.get("/:id", authRequired, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.json({ task });
});

router.put(
  "/:id",
  authRequired,
  validateBody(baseTaskSchema.partial()),
  async (req, res) => {
    const updates = req.validatedBody;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      updates,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.json({ task });
  }
);

router.delete("/:id", authRequired, async (req, res) => {
  const result = await Task.findOneAndDelete({
    _id: req.params.id,
    owner: req.user.id,
  });
  if (!result) return res.status(404).json({ message: "Task not found" });
  return res.json({ message: "Deleted" });
});

export default router;

