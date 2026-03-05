import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getHabitLogs,
  getHabitStreak,
  completeHabitLog,
} from "../controllers/habitlog.controller.js";

const router = Router();

router.route("/:habitId/complete").post(verifyJWT, completeHabitLog);

router.route("/:habitId/logs").get(verifyJWT, getHabitLogs);

router.route("/:habitId/streak").get(verifyJWT, getHabitStreak);

export default router;
