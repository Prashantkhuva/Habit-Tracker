import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const createBlogPost = asyncHandler(async (req, res) => {
  const { title, slug, description, content, categories, readingTime, published, image, steps } =
    req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const finalSlug =
    slug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const existing = await Blog.findOne({ slug: finalSlug });
  if (existing) {
    throw new ApiError(409, "A post with this slug already exists");
  }

  const post = await Blog.create({
    title: title.trim(),
    slug: finalSlug,
    description: description?.trim() || "",
    content,
    categories: categories || [],
    readingTime: readingTime?.trim() || "",
    published: published?.trim() || new Date().toISOString().slice(0, 10),
    lastmod: new Date().toISOString().slice(0, 10),
    image: image?.trim() || "/og-image.png",
    steps: steps || [],
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Blog post created successfully"));
});

const getAllBlogPosts = asyncHandler(async (req, res) => {
  const posts = await Blog.find()
    .sort({ published: -1, createdAt: -1 })
    .select("-content");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Blog posts fetched successfully"));
});

const getBlogPostBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const post = await Blog.findOne({ slug });

  if (!post) {
    throw new ApiError(404, "Blog post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Blog post fetched successfully"));
});

const getBlogPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Blog.findById(id);

  if (!post) {
    throw new ApiError(404, "Blog post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Blog post fetched successfully"));
});

const updateBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, slug, description, content, categories, readingTime, published, image, steps } =
    req.body;

  const updateFields = {};

  if (title !== undefined) updateFields.title = title.trim();
  if (slug !== undefined) {
    const existing = await Blog.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      throw new ApiError(409, "A post with this slug already exists");
    }
    updateFields.slug = slug;
  }
  if (description !== undefined) updateFields.description = description.trim();
  if (content !== undefined) updateFields.content = content;
  if (categories !== undefined) updateFields.categories = categories;
  if (readingTime !== undefined) updateFields.readingTime = readingTime.trim();
  if (published !== undefined) updateFields.published = published.trim();
  if (image !== undefined) updateFields.image = image.trim();
  if (steps !== undefined) updateFields.steps = steps;
  updateFields.lastmod = new Date().toISOString().slice(0, 10);

  const post = await Blog.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { $set: updateFields },
    { returnDocument: "after" },
  );

  if (!post) {
    throw new ApiError(404, "Blog post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Blog post updated successfully"));
});

const deleteBlogPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Blog.findOneAndDelete({ _id: id, user: req.user._id });

  if (!post) {
    throw new ApiError(404, "Blog post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Blog post deleted successfully"));
});

export {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
};
