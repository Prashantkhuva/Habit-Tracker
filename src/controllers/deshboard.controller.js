import mongoose from "mongoose";
import { Habit } from "../models/habit.model.js";
import { HabitLog } from "../models/habitLog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();

  const [dashboardStats] = await HabitLog.aggregate([
    {
      $facet: {
        totalCompletions: [
          { $match: { user: userId } },
          { $count: "count" },
        ],
        completedToday: [
          { $match: { user: userId, date: todayTs } },
          { $count: "count" },
        ],
      },
    },
  ]);

  const [habitCount] = await Habit.aggregate([
    { $match: { user: userId } },
    { $count: "count" },
  ]);

  const totalHabits = habitCount?.count || 0;
  const completedToday = dashboardStats?.completedToday?.[0]?.count || 0;
  const totalCompletions = dashboardStats?.totalCompletions?.[0]?.count || 0;

  const completionRate =
    totalHabits === 0 ? 0 : Math.floor((completedToday / totalHabits) * 100);

  return res.status(200).json(
    new ApiResponse(
      200,
      { totalHabits, completedToday, totalCompletions, completionRate },
      "Dashboard stats fetched successfully",
    ),
  );
});

const weeklyChart = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const weeklyData = await HabitLog.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
        completed: true,
        date: {
          $gte: monday.getTime(),
          $lte: sunday.getTime(),
        },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: { $toDate: "$date" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const result = days.map((day, index) => {
    const found = weeklyData.find((d) => d._id === index + 1);
    return { day, count: found ? found.count : 0 };
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
    matchFilter.habit = new mongoose.Types.ObjectId(habitId);
  }

  const uniqueDays = await HabitLog.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$date" } },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  if (!uniqueDays.length) {
    return res.status(200).json(
      new ApiResponse(200, { currentStreak: 0, longestStreak: 0 }, "Streak calculated successfully"),
    );
  }

  const dates = uniqueDays.map((d) => new Date(d._id));

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    maxStreak = Math.max(maxStreak, currentStreak);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let liveStreak = 0;
  const dateSet = new Set(uniqueDays.map((d) => d._id));

  const formatDate = (d) => d.toISOString().slice(0, 10);
  let cursor = formatDate(today);

  while (dateSet.has(cursor)) {
    liveStreak++;
    const prev = new Date(cursor);
    prev.setDate(prev.getDate() - 1);
    cursor = formatDate(prev);
  }

  return res.status(200).json(
    new ApiResponse(200, { currentStreak: liveStreak, longestStreak: maxStreak }, "Streak calculated successfully"),
  );
});

const heatmapData = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  oneYearAgo.setHours(0, 0, 0, 0);

  const data = await HabitLog.aggregate([
    {
      $match: {
        user: userId,
        completed: true,
        date: { $gte: oneYearAgo.getTime() },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: { $toDate: "$date" },
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Heatmap data fetched successfully"));
});

export { getDashboardStats, weeklyChart, longestStreak, heatmapData };
