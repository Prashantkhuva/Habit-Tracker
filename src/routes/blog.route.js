import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blog.controller.js";
import {
  createBlogValidator,
  updateBlogValidator,
} from "../validators/index.js";

const router = Router();

// Public routes
router.route("/posts").get(getAllBlogPosts);
router.route("/posts/:slug").get(getBlogPostBySlug);

// Protected routes
router
  .route("/posts")
  .post(verifyJWT, createBlogValidator(), validate, createBlogPost);
router
  .route("/post/:id")
  .get(verifyJWT, getBlogPostById);
router
  .route("/post/:id")
  .patch(verifyJWT, updateBlogValidator(), validate, updateBlogPost);
router
  .route("/post/:id")
  .delete(verifyJWT, deleteBlogPost);

export default router;
