"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.group_validation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({ groupName: zod_1.z.string({ message: "Group name is required!" }) });
const update = zod_1.z.object({ groupName: zod_1.z.string().optional() });
exports.group_validation = {
    create,
    update
};
