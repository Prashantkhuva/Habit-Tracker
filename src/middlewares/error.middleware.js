import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    message: err?.message || "Internal Server Error",
    errors: err?.errors || [],
  });
};

export { errorHandler };
