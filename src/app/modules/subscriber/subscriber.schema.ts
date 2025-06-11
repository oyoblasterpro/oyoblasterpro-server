import { model, Schema, Types } from "mongoose";
import { TSubscriber, TSuppression } from "./subscriber.interface";

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


const suppression_schema = new Schema<TSuppression>({
    email: { type: String, index: true }
})

export const Suppression_Model = model("suppression", suppression_schema)

export const Subscriber_Model = model("subscriber", subscriber_schema)