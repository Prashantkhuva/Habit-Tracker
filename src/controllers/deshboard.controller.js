import mongoose from "mongoose";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1️⃣ total habits
  // const totalHabits = await Habit.countDocuments({
  //   user: userId,
  // });

  // // 2️⃣ completed today
  // const completedToday = await HabitLog.countDocuments({
  //   user: userId,
  //   date: today,
  // });

  // // 3️⃣ total completions
  // const totalCompletions = await HabitLog.countDocuments({
  //   user: userId,
  // });

  const [totalHabits, completedToday, totalCompletions] = await Promise.all([
    Habit.countDocuments({
      user: userId,
    }),

    HabitLog.countDocuments({
      user: userId,
      date: today,
    }),

    HabitLog.countDocuments({
      user: userId,
    }),
  ]);

  const completionRate =
    totalHabits === 0 ? 0 : Math.floor((completedToday / totalHabits) * 100);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalHabits,
        completedToday,
        totalCompletions,
        completionRate,
      },
      "Dashboard stats fetched successfully",
    ),
  );
});


export {
  getDashboardStats
}