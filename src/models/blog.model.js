import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    categories: {
      type: [String],
      default: [],
    },
    readingTime: {
      type: String,
      trim: true,
      default: "",
    },
    published: {
      type: String,
      trim: true,
      default: "",
    },
    lastmod: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: "/og-image.png",
    },
    steps: {
      type: [String],
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

blogSchema.index({ slug: 1 });
blogSchema.index({ published: -1 });

export const Blog = mongoose.model("Blog", blogSchema);
