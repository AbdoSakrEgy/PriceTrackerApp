"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
  statusCode;
  constructor(message, statusCode, options) {
    super(message, options);
    this.statusCode = statusCode;
  }
}
exports.AppError = AppError;
