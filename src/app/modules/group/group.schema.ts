import { model, Schema, Types } from "mongoose";
import { TGroup } from "./group.interface";

const group_schema = new Schema<TGroup>({
    groupName: { type: String, required: true },
    accountId: { type: Types.ObjectId, required: false, ref: "account" }
}, {
    versionKey: false,
    timestamps: true
})


export const Group_Model = model("group", group_schema)