import { Types } from "mongoose";

export type Sub = {
    name?: string;
    email: string;
    phone?: string;
    location?: string;
}
export type TSubscriber = {
    accountId?: Types.ObjectId,
    groupId?: Types.ObjectId,
    subscribers?: Sub
}

