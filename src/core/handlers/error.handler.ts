import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error";

export const errorHandler = ({
  err,
  req,
  res,
  next,
}: {
  err: AppError;
  req: Request;
  res: Response;
  next: NextFunction;
}) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    stack: err.stack,
  });
};
