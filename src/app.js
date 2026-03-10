import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import logger from "./utils/logger.js";
import morgan from "morgan";

const app = express();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const morganFormat = ":method :url :status :response-time ms";

//  Basic configuration
app.use(helmet());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(limiter);
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  }),
);

// Cors( Cross-Origin Resource Sharing ) configuration
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN?.split(",") ||
      process.env.CORS_OROGIN?.split(",") ||
      "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Import routes

import healthCheckRouter from "./routes/healthcheck.route.js";
import userRouter from "./routes/user.route.js";
import habitRouter from "./routes/habit.route.js";
import habitLogRouter from "./routes/habitlog.route.js";
import dashboardRouter from "./routes/deshboard.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/habits", habitRouter);
app.use("/api/v1/habitlog", habitLogRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use(errorHandler);

export { app };
