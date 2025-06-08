"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const group_controller_1 = require("./group.controller");
const groupRouter = (0, express_1.Router)();
groupRouter.post("/", (0, auth_1.default)("ADMIN", "USER"), group_controller_1.group_controller.create_new_group);
groupRouter.patch("/:id", (0, auth_1.default)("ADMIN", "USER"), group_controller_1.group_controller.update_group);
groupRouter.get("/:id", (0, auth_1.default)("ADMIN", "USER"), group_controller_1.group_controller.get_single_group);
groupRouter.delete("/:id", (0, auth_1.default)("ADMIN", "USER"), group_controller_1.group_controller.delete_group);
groupRouter.get("/", (0, auth_1.default)("ADMIN", "USER"), group_controller_1.group_controller.get_all_group);
exports.default = groupRouter;
