import { Types } from "mongoose";


export type TCampaign = {
    subject: string;
    text: string;
    html: string;
    groupId: Types.ObjectId;
    userId: Types.ObjectId;
    isDelivered?: boolean;
}