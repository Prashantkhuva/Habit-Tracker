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

const weeklyChart = asyncHandler(async (req, res) => {
  const today = new Date();

  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - today.getDay() + 1);
  firstDay.setHours(0, 0, 0, 0);

  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);
  lastDay.setHours(23, 59, 59, 999);

  const weeklyData = await HabitLog.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
        completed: true,
      },
    },
    {
      $addFields: {
        dateValue: { $toDate: "$date" },
      },
    },
    {
      $match: {
        dateValue: {
          $gte: firstDay,
          $lte: lastDay,
        },
      },
    },
    {
      $addFields: {
        dayOfWeek: { $dayOfWeek: "$dateValue" },
      },
    },
    {
      $group: {
        _id: "$dayOfWeek",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const result = days.map((day, index) => {
    const found = weeklyData.find((d) => d._id === index + 1);

    return {
      day,
      count: found ? found.count : 0,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Weekly data fetched successfully"));
});

const longestStreak = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const habitId = req.params.habitId || req.query.habitId;
  const matchFilter = {
    user: userId,
    completed: true,
  };

  if (habitId) {
    matchFilter.habit = habitId;
  }

  const logs = await HabitLog.find({
    ...matchFilter,
  }).sort({ date: 1 });

  if (!logs.length) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          currentStreak: 0,
          longestStreak: 0,
        },
        "Streak calculated successfully",
      ),
    );
  }

  const uniqueDates = [
    ...new Set(logs.map((log) => new Date(log.date).toDateString())),
  ].map((value) => new Date(value));

  let currentStreak = 0;
  let maxStreak = 0;
  let previousDate = null;

  for (const currentDate of uniqueDates) {
    let diff = 0;

    if (!previousDate) {
      currentStreak = 1;
    } else {
      diff = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }

    maxStreak = Math.max(maxStreak, currentStreak);

    previousDate = currentDate;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let liveStreak = 0;
  let cursor = new Date(today);

  const dateSet = new Set(uniqueDates.map((d) => d.toDateString()));

  while (dateSet.has(cursor.toDateString())) {
    liveStreak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        currentStreak: liveStreak,
        longestStreak: maxStreak,
      },
      "Streak calculated successfully",
    ),
  );
});

const heatmapData = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const habit = await HabitLog.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        completed: true,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
          },
        },

        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
});

export { getDashboardStats, weeklyChart, longestStreak, heatmapData };
