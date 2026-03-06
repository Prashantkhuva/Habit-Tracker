import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  archiveHabit,
  createHabit,
  deleteHabit,
  getUserHabit,
  pauseHabit,
  resumeHabit,
  updateHabitDetails,
} from "../controllers/habit.controller.js";

const router = Router();

router.route("/create-habit").post(verifyJWT, createHabit);

router.route("/get-habits").get(verifyJWT, getUserHabit);

router.route("/delete-habit").get(verifyJWT, deleteHabit);

router.route("/update-habit/:habitId").patch(verifyJWT, updateHabitDetails);

router.route("/:habitId/pause").patch(verifyJWT, pauseHabit);

router.route("/:habitId/resume").patch(verifyJWT, resumeHabit);

router.route("/:habitId/archive").patch(verifyJWT, archiveHabit);

export default router;
