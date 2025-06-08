"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign_Model = void 0;
const mongoose_1 = require("mongoose");
const campaign_schema = new mongoose_1.Schema({
    groupId: { type: mongoose_1.Schema.Types.ObjectId, required: false, ref: "group" },
    subject: { type: String, required: true },
    text: { type: String, required: true },
    html: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: false, ref: "account" },
    isDelivered: { type: Boolean, default: false, required: false }
}, {
    versionKey: false,
    timestamps: true
});
exports.Campaign_Model = (0, mongoose_1.model)("campaign", campaign_schema);
