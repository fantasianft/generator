import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import express, { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import "express-async-errors";

import BaseRouter from "./routes";
import logger from "@shared/logger";
import cors from "cors";
import path from "path";

const app = express();
const { BAD_REQUEST } = StatusCodes;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, '/../public')));

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// Add APIs
app.use("/api", BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.err(err, true);
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
});

// Export express instance
export default app;
