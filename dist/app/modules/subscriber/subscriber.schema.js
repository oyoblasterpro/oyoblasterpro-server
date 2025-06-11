"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriber_Model = exports.Suppression_Model = void 0;
const mongoose_1 = require("mongoose");
const sub = new mongoose_1.Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    location: { type: String, required: false },
}, { _id: false });
const subscriber_schema = new mongoose_1.Schema({
    accountId: { type: mongoose_1.Types.ObjectId, required: false },
    groupId: { type: mongoose_1.Types.ObjectId, required: true },
    subscribers: { type: [sub], required: false }
}, {
    versionKey: false,
    timestamps: true
});
const suppression_schema = new mongoose_1.Schema({
    email: { type: String, index: true }
});
exports.Suppression_Model = (0, mongoose_1.model)("suppression", suppression_schema);
exports.Subscriber_Model = (0, mongoose_1.model)("subscriber", subscriber_schema);
