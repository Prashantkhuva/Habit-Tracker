import cron from "node-cron";
import Habit from "../models/habit.model.js";
import HabitLog from "../models/habitLog.model.js";
import User from "../models/user.model.js";

export const startReminderJob = () => {
  // runs every day at 9 PM
  cron.schedule("0 22 * * *", async () => {
    console.log("Running daily habit reminder job...");

    // Getting today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const users = await User.find();

      for (const user of users) {
        const habits = await Habit.find({
          userId: user._id,
          status: "active",
        });

        let incompleteHabits = 0;

        for (const habit of habits) {
          const log = await HabitLog.findOne({
            userId: user._id,
            habitId: habit._id,
            date: {
              $gte: today,
              $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
            completed: true,
          });

          if (!log) {
            incompleteHabits++;
          }
        }

        if (incompleteHabits > 0) {
          console.log(
            `Reminder for ${user.username}: You still have ${incompleteHabits} habits to complete today.`,
          );
        }
      }
    } catch (error) {
      console.error("Reminder job error:", error);
    }
  });
};
