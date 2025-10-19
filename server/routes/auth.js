import { Router } from "express";
import { registerUser } from "../storage.js";
import { parseRegisterPayload } from "../validation.js";

const router = Router();

router.post("/register", (req, res) => {
  try {
    const payload = parseRegisterPayload(req.body);
    const user = registerUser(payload);
    res.status(201).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(400).json({ message: error.message ?? "Не удалось зарегистрироваться" });
  }
});

export default router;
