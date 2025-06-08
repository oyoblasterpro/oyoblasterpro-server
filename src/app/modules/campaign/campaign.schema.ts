import { model, Schema } from "mongoose";
import { TCampaign } from "./campaign.interface";

const campaign_schema = new Schema<TCampaign>({
    groupId: { type: Schema.Types.ObjectId, required: false, ref: "group" },
    subject: { type: String, required: true },
    text: { type: String, required: true },
    html: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: false, ref: "account" },
    isDelivered: { type: Boolean, default: false, required: false }
}, {
    versionKey: false,
    timestamps: true
})


export const Campaign_Model = model("campaign", campaign_schema)