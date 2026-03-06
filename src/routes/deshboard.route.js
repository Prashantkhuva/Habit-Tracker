import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getDashboardStats,
  weeklyChart,
} from "../controllers/deshboard.controller.js";


const router = Router()

router.route("/getstats").get(verifyJWT, getDashboardStats)

router.route("/weeklydata").get(verifyJWT, weeklyChart)

export default router