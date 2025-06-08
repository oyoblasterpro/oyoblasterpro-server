"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User_Model = void 0;
const mongoose_1 = require("mongoose");
const user_schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    photo: { type: String, required: false },
    accountId: { type: String, required: false, ref: "account" },
    address: {
        location: { type: String },
        city: { type: String },
        state: { type: String },
        postCode: { type: String },
        country: { type: String },
        timeZone: { type: String }
    }
}, {
    versionKey: false,
    timestamps: true
});
exports.User_Model = (0, mongoose_1.model)("user", user_schema);
