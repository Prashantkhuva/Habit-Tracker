import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getHabitLogs,
  getHabitStreak,
  completeHabitLog,
  getAllHabitLogs,
} from "../controllers/habitlog.controller.js";

const router = Router();

router.route("/:habitId/complete").post(verifyJWT, completeHabitLog);

router.route("/:habitId/logs").get(verifyJWT, getHabitLogs);

router.route("/:habitId/streak").get(verifyJWT, getHabitStreak);

router.route("/all").get(verifyJWT, getAllHabitLogs);

export default router;
