import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  changeCurrentPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserDetails,
  getCurrentUser,
  deleteUser,
} from "../controllers/user.controller.js";
import {
  userLoginValidator,
  userRegisterValidator,
  changePasswordValidator,
  updateUserDetailsValidator,
} from "../validators/index.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);

router.route("/login").post(userLoginValidator(), validate, loginUser);

router.route("/refresh-token").post(refreshAccessToken);

// Secure routes

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router
  .route("/change-password")
  .post(verifyJWT, changePasswordValidator(), validate, changeCurrentPassword);

router
  .route("/update-details")
  .patch(verifyJWT, updateUserDetailsValidator(), validate, updateUserDetails);

router.route("/delete-account").delete(verifyJWT, deleteUser);

export default router;
