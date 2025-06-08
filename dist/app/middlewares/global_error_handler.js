"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = require("../utils/app_error");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode | http_status_1.default.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || 'Something went wrong!';
    let error = err;
    if (err instanceof app_error_1.AppError) {
        message = err === null || err === void 0 ? void 0 : err.message;
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        error = err === null || err === void 0 ? void 0 : err.stack;
    }
    res.status(statusCode).json({
        success,
        message,
        error,
    });
};
exports.default = globalErrorHandler;
