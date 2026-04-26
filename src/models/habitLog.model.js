import mongoose, { Schema, Types } from "mongoose";

const habitlogSchema = new Schema(
  {
    habit: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    date: {
      type: Number,
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      required: true,
      index: true,
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
