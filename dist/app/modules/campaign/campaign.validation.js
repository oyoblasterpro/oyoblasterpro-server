"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaign_validation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    groupId: zod_1.z.string(),
    subject: zod_1.z.string(),
    text: zod_1.z.string(),
    html: zod_1.z.string(),
    userId: zod_1.z.string().optional()
});
exports.campaign_validation = {
    create
};
