"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.role = void 0;
const http_status_code_1 = require("./../http/http.status.code");
const app_error_js_1 = require("../errors/app.error.js");
const global_types_js_1 = require("../../types/global.types.js");
const role = (allowedRoles) => {
    return async (req, res, next) => {
        const user = res.locals.user;
        // step: check allwoed roles values are valid RoleEnum
        const validRoles = Object.values(global_types_js_1.RoleEnum);
        for (const r of allowedRoles) {
            if (!validRoles.includes(r)) {
                throw new app_error_js_1.AppError(http_status_code_1.HttpStatusCode.BAD_REQUEST, `Invalid role: ${r}. Allowed roles are: ${validRoles.join(", ")}`);
            }
        }
        // step: check role allow
        if (allowedRoles.includes(user.role)) {
            return next();
        }
        throw new app_error_js_1.AppError(http_status_code_1.HttpStatusCode.FORBIDDEN, `Access denied. Your role '${user.role}' is not authorized to access this resource. Allowed roles: ${allowedRoles.join(", ")}`);
    };
};
exports.role = role;
