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
    color: {
      type: String,
      default: "#4F6F64",
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
    type: {
      type: String,
      enum: ["boolean", "streak", "quantity"],
      default: "boolean",
    },
  },
  {
    timestamps: true,
  },
);

export const Habit = mongoose.model("Habit", habitSchema);
