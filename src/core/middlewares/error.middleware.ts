import { NextFunction, Request, Response } from "express";
import { IError } from "./../../utils/Errors";
import { errorHandler } from "../handlers/error.handler";

export const errorMiddleware = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorHandler({ err, req, res, next });
};
