import { model, Schema, Types } from "mongoose";
import { TSubscriber } from "./subscriber.interface";

const sub = new Schema(
    {
        name: { type: String, required: false },
        email: { type: String, required: false },
        phone: { type: String, required: false },
        location: { type: String, required: false },
    },
    { _id: false }
);


const subscriber_schema = new Schema<TSubscriber>(
    {
        accountId: { type: Types.ObjectId, required: false },
        groupId: { type: Types.ObjectId, required: true },
        subscribers: { type: [sub], required: false }
    },
    {
        versionKey: false,
        timestamps: true
    }
)




export const Subscriber_Model = model("subscriber", subscriber_schema)