import mongoose, { Schema } from "mongoose";

const habitSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    category: {
      type: String,
      enum: ["Health", "Fitness", "Learning", "Productivity", "Mindfulness"],
      default: "Productivity",
    },
    status: {
      type: String,
      enum: ["active", "paused", "archived"],
      default: "active",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Habit = mongoose.model("Habit", habitSchema);
