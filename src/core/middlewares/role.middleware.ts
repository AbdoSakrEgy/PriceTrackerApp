import { HttpStatusCode } from "./../http/http.status.code";
import { NextFunction, Request, Response } from "express";
import { decodeToken, TokenTypesEnum } from "../../utils/decodeToken.js";
import { AppError } from "../errors/app.error.js";
import { RoleEnum } from "../../types/global.types.js";

export const role = (allowedRoles: string[]) => {
  return async (req: Request | any, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    // step: check allwoed roles values are valid RoleEnum
    const validRoles = Object.values(RoleEnum) as string[];
    for (const r of allowedRoles) {
      if (!validRoles.includes(r)) {
        throw new AppError(
          HttpStatusCode.BAD_REQUEST,
          `Invalid role: ${r}. Allowed roles are: ${validRoles.join(", ")}`
        );
      }
    }
    // step: check role allow
    if (allowedRoles.includes(user.role)) {
      return next();
    }
    throw new AppError(
      HttpStatusCode.FORBIDDEN,
      `Access denied. Your role '${
        user.role
      }' is not authorized to access this resource. Allowed roles: ${allowedRoles.join(
        ", "
      )}`
    );
  };
};
