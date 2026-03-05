import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createHabit,
  deleteHabit,
  getUserHabit,
  updateHabitDetails,
} from "../controllers/habit.controller.js";

const router = Router();

router.route("/create-habit").post(verifyJWT, createHabit);

router.route("/get-habits").get(verifyJWT, getUserHabit);

router.route("/delete-habit").get(verifyJWT, deleteHabit);

router.route("/update-habit/:habitId").patch(verifyJWT, updateHabitDetails);

export default router;
