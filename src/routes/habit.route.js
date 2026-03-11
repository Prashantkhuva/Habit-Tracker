import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  archiveHabit,
  createHabit,
  deleteHabit,
  getUserHabit,
  pauseHabit,
  resumeHabit,
  updateHabitDetails,
} from "../controllers/habit.controller.js";
import {
  createHabitValidator,
  updateHabitValidator,
} from "../validators/index.js";

const router = Router();

router
  .route("/create-habit")
  .post(verifyJWT, createHabitValidator(), validate, createHabit);

router.route("/get-habits").get(verifyJWT, getUserHabit);
router.route("/get-habits").get(verifyJWT, getUserHabit);

router.route("/delete-habit").delete(verifyJWT, deleteHabit);

router
  .route("/update-habit/:habitId")
  .patch(verifyJWT, updateHabitValidator(), validate, updateHabitDetails);

router.route("/:habitId/pause").patch(verifyJWT, pauseHabit);

router.route("/:habitId/resume").patch(verifyJWT, resumeHabit);

router.route("/:habitId/archive").patch(verifyJWT, archiveHabit);

export default router;
