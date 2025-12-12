export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => issue.message);
      return res.status(400).json({ message: "Validation failed", details });
    }
    req.validatedBody = parsed.data;
    next();
  };
}

