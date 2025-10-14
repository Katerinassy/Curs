import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Регистрация пользователя (пример)
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;