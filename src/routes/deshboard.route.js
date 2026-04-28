import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getDashboardStats,
  longestStreak,
  weeklyChart,
  heatmapData,
} from "../controllers/deshboard.controller.js";

const router = Router();

router.route("/getstats").get(verifyJWT, getDashboardStats);

router.route("/weeklydata").get(verifyJWT, weeklyChart);

router.route("/longest-streak").get(verifyJWT, longestStreak);

router.route("/longest-streak/:habitId").get(verifyJWT, longestStreak);

router.route("/heatmap").get(verifyJWT, heatmapData);

export default router;
