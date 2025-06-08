"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_error_1 = require("../utils/app_error");
const genarate_token_1 = require("../utils/genarate_token");
const configs_1 = require("../configs");
const auth = (...roles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new app_error_1.AppError('You are not authorize!!', 401);
            }
            const verifiedUser = (0, genarate_token_1.verifyToken)(token, configs_1.configs.jwt.access_token);
            if (!roles.length || !roles.includes(verifiedUser.role)) {
                throw new app_error_1.AppError('You are not authorize!!', 401);
            }
            req.user = verifiedUser;
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = auth;
