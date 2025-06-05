import { model, Schema, Types } from "mongoose";
import { TAccount } from "./auth.interface";
import { ObjectId } from "mongodb";

const authSchema = new Schema<TAccount>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    lastPasswordChange: { type: String },
    isDeleted: { type: Boolean, default: false },
    status: { type: String, default: "ACTIVE" },
    role: { type: String, default: "USER" },
}, {
    versionKey: false,
    timestamps: true
});


export const Account_Model = model("account", authSchema)