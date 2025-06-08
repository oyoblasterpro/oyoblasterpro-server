import { AppError } from "../../utils/app_error";
import { Account_Model } from "../auth/auth.schema";
import { Subscriber_Model } from "../subscriber/subscriber.schema";
import { TGroup } from "./group.interface";
import { Group_Model } from "./group.schema";
import httpStatus from 'http-status';

const create_new_group_into_db = async (payload: TGroup, email: string) => {
    // 1. Validate user
    const isUserExist = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isUserExist) {
        throw new AppError("You are not authorized or your account is blocked.", httpStatus.BAD_REQUEST);
    }
    // 2. Check for duplicate group
    const isExistGroup = await Group_Model.findOne({ groupName: payload.groupName });

    if (isExistGroup) {
        throw new AppError("Group name already exists.", httpStatus.BAD_REQUEST);
    }
    // 3. Create the group
    const result = await Group_Model.create({
        groupName: payload.groupName,
        accountId: isUserExist._id,
    });

    return result;
};
const update_group_into_db = async (payload: TGroup, email: string, id: string) => {
    // 1. Validate user
    const isUserExist = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isUserExist) {
        throw new AppError("You are not authorized or your account is blocked.", httpStatus.BAD_REQUEST);
    }
    // 2. Check group exist or not
    const isExistGroup = await Group_Model.findOne({ _id: id, accountId: isUserExist._id });

    if (!isExistGroup) {
        throw new AppError("Group info not found!!", httpStatus.BAD_REQUEST);
    }
    //3. check new group name already exist
    const isGroupNameExist = await Group_Model.findOne({ accountId: isUserExist._id, groupName: payload?.groupName })
    if (isGroupNameExist) {
        throw new AppError("Group name exist !!", httpStatus.BAD_REQUEST)
    }

    // 4. update the group
    const result = await Group_Model.findOneAndUpdate(
        {
            _id: id,
            accountId: isUserExist._id,
        },
        {
            groupName: payload?.groupName
        },
        {
            new: true
        }
    );

    return result;
};

const get_all_group_from_db = async (email: string) => {
    // 1. Validate user
    const isUserExist = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isUserExist) {
        throw new AppError("You are not authorized or your account is blocked.", httpStatus.BAD_REQUEST);
    }

    const result = await Group_Model.aggregate([
        {
            $match: {
                accountId: isUserExist._id
            }
        },
        {
            $lookup: {
                from: "subscribers", // ensure correct collection name
                localField: "_id",
                foreignField: "groupId",
                as: "subscriberDocs"
            }
        },
        {
            $addFields: {
                totalSubscriber: {
                    $cond: {
                        if: { $gt: [{ $size: "$subscriberDocs" }, 0] },
                        then: { $size: { $arrayElemAt: ["$subscriberDocs.subscribers", 0] } },
                        else: 0
                    }
                }
            }
        },
        {
            $project: {
                subscriberDocs: 0
            }
        }
    ]);


    return result;
};



const get_single_group_with_subscriber_from_db = async (email: string, groupId: string) => {
    // 1. Validate user
    const isUserExist = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isUserExist) {
        throw new AppError("You are not authorized or your account is blocked.", httpStatus.BAD_REQUEST);
    }
    const single_group = await Group_Model.findOne({ _id: groupId, accountId: isUserExist._id })
    if (!single_group) {
        throw new AppError("Group info not found!!", httpStatus.NOT_FOUND)
    }

    // find all the subscriber for this group
    const result = await Subscriber_Model.find({ groupId: single_group._id })
    return {
        group: single_group,
        subscriber: result
    }
}

const delete_group_from_db = async (email: string, groupId: string) => {
    const isUserExist = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isUserExist) {
        throw new AppError("You are not authorized or your account is blocked.", httpStatus.BAD_REQUEST);
    }
    const single_group = await Group_Model.findOne({ _id: groupId, accountId: isUserExist._id })
    if (!single_group) {
        throw new AppError("Group info not found!!", httpStatus.NOT_FOUND)
    }
    // remove all subscriber group id
    await Subscriber_Model.updateMany({ groupId: single_group._id }, { groupId: null })
    await Group_Model.findOneAndDelete({ _id: groupId, accountId: isUserExist._id })
    return;
}




export const group_services = {
    create_new_group_into_db,
    update_group_into_db,
    get_all_group_from_db,
    get_single_group_with_subscriber_from_db,
    delete_group_from_db
}