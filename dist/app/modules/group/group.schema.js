"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group_Model = void 0;
const mongoose_1 = require("mongoose");
const group_schema = new mongoose_1.Schema({
    groupName: { type: String, required: true },
    accountId: { type: mongoose_1.Types.ObjectId, required: false, ref: "account" }
}, {
    versionKey: false,
    timestamps: true
});
exports.Group_Model = (0, mongoose_1.model)("group", group_schema);
