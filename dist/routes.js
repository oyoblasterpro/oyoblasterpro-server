"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./app/modules/auth/auth.route"));
const group_route_1 = __importDefault(require("./app/modules/group/group.route"));
const subscriber_route_1 = __importDefault(require("./app/modules/subscriber/subscriber.route"));
const campaign_route_1 = __importDefault(require("./app/modules/campaign/campaign.route"));
const appRouter = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/campaign', route: campaign_route_1.default },
    { path: "/auth", route: auth_route_1.default },
    { path: "/group", route: group_route_1.default },
    { path: "/subscriber", route: subscriber_route_1.default }
];
moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
exports.default = appRouter;
