import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getDashboardStats,
  longestStreak,
  weeklyChart,
} from "../controllers/deshboard.controller.js";


const router = Router()

router.route("/getstats").get(verifyJWT, getDashboardStats)

router.route("/weeklydata").get(verifyJWT, weeklyChart)

router.route("/longest-streak").get(verifyJWT, longestStreak)

export default router