import { Types } from "mongoose";

export type TGroup = {
    groupName: string;
    accountId?: Types.ObjectId
}