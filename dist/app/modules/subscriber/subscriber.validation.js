"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriber_validation = exports.create = void 0;
const zod_1 = require("zod");
const subSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
});
// Schema for the main `subscriber_schema`
exports.create = zod_1.z.object({
    accountId: zod_1.z.string().optional(),
    groupId: zod_1.z.string(),
    subscribers: zod_1.z.array(subSchema).optional(),
});
exports.subscriber_validation = {
    create: exports.create
};
