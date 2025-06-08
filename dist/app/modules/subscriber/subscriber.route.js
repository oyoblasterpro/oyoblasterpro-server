"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploader_1 = __importDefault(require("../../middlewares/uploader"));
const subscriber_controller_1 = require("./subscriber.controller");
const request_validator_1 = __importDefault(require("../../middlewares/request_validator"));
const subscriber_validation_1 = require("./subscriber.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const subscriber_route = (0, express_1.Router)();
subscriber_route.post("/", (0, auth_1.default)("ADMIN", "USER"), uploader_1.default.single("file"), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, request_validator_1.default)(subscriber_validation_1.subscriber_validation.create), subscriber_controller_1.subscriber_controller.create_subscriber);
exports.default = subscriber_route;
