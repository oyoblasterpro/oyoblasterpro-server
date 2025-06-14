import { Types } from "mongoose";

export type Sub = {
    email: string;
    [key: string]: any
}
export type TSubscriber = {
    accountId?: Types.ObjectId,
    groupId?: Types.ObjectId,
    subscribers?: Sub[]
}

export type TSuppression = {
    email: string
}