import mongoose, { Schema, Types } from "mongoose";

const habitlogSchema = new Schema(
  {
    habit: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Number,
    },
    completed: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

habitlogSchema.index(
  {
    habit: 1,
    user: 1,
    date: 1,
  },
  { unique: true },
);

export const HabitLog = mongoose.model("HabitLog", habitlogSchema);
