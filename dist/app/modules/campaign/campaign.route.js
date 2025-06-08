"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const request_validator_1 = __importDefault(require("../../middlewares/request_validator"));
const campaign_validation_1 = require("./campaign.validation");
const campaign_controller_1 = require("./campaign.controller");
const campaign_route = (0, express_1.Router)();
//create new campaign
campaign_route.post("/", (0, auth_1.default)("ADMIN", "USER"), (0, request_validator_1.default)(campaign_validation_1.campaign_validation.create), campaign_controller_1.campaign_controllers.create_campaign);
campaign_route.get("/", (0, auth_1.default)("ADMIN", "USER"), campaign_controller_1.campaign_controllers.get_all_campaign);
campaign_route.get("/:id", (0, auth_1.default)("ADMIN", "USER"), campaign_controller_1.campaign_controllers.get_single_campaign);
campaign_route.patch("/:id", (0, auth_1.default)("ADMIN", "USER"), campaign_controller_1.campaign_controllers.update_campaign);
campaign_route.delete("/:id", (0, auth_1.default)("ADMIN", "USER"), campaign_controller_1.campaign_controllers.delete_campaign);
campaign_route.post("/start-mailing/:id", (0, auth_1.default)("ADMIN", "USER"), campaign_controller_1.campaign_controllers.start_mailing);
exports.default = campaign_route;
