import { body } from "express-validator";

/* ---------------- USER VALIDATORS ---------------- */

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

const changePasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),

    body("newPassword")
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ];
};

const updateUserDetailsValidator = () => {
  return [
    body("fullname")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Full name must be at least 3 characters long"),

    body("email").optional().trim().isEmail().withMessage("Email is invalid"),

    body().custom((value) => {
      if (!value || (!value.fullname && !value.email)) {
        throw new Error("At least one field is required: fullname or email");
      }
      return true;
    }),
  ];
};

/* ---------------- HABIT VALIDATORS ---------------- */

const createHabitValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Habit title is required")
      .isLength({ min: 3 })
      .withMessage("Habit title must be at least 3 characters long"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 3 })
      .withMessage("Description must be at least 3 characters long"),

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Category is required")
      .isIn(["Health", "Fitness", "Learning", "Productivity", "Mindfulness"])
      .withMessage("Invalid category"),

    body("frequency")
      .trim()
      .notEmpty()
      .withMessage("Frequency is required")
      .isIn(["daily", "weekly"])
      .withMessage("Frequency must be 'daily' or 'weekly'"),
  ];
};

const updateHabitValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Habit title must be at least 3 characters long"),

    body("description")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Description must be at least 3 characters long"),

    body("category")
      .optional()
      .isIn(["Health", "Fitness", "Learning", "Productivity", "Mindfulness"])
      .withMessage("Invalid category"),

    body("frequency")
      .optional()
      .trim()
      .isIn(["daily", "weekly"])
      .withMessage("Frequency must be 'daily' or 'weekly'"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  changePasswordValidator,
  updateUserDetailsValidator,
  createHabitValidator,
  updateHabitValidator,
};
