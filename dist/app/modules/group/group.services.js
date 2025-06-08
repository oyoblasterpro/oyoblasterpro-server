"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.group_services = void 0;
const app_error_1 = require("../../utils/app_error");
const auth_schema_1 = require("../auth/auth.schema");
const subscriber_schema_1 = require("../subscriber/subscriber.schema");
const group_schema_1 = require("./group.schema");
const http_status_1 = __importDefault(require("http-status"));
const create_new_group_into_db = (payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Validate user
    const isUserExist = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isUserExist) {
        throw new app_error_1.AppError("You are not authorized or your account is blocked.", http_status_1.default.BAD_REQUEST);
    }
    // 2. Check for duplicate group
    const isExistGroup = yield group_schema_1.Group_Model.findOne({ groupName: payload.groupName });
    if (isExistGroup) {
        throw new app_error_1.AppError("Group name already exists.", http_status_1.default.BAD_REQUEST);
    }
    // 3. Create the group
    const result = yield group_schema_1.Group_Model.create({
        groupName: payload.groupName,
        accountId: isUserExist._id,
    });
    return result;
});
const update_group_into_db = (payload, email, id) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Validate user
    const isUserExist = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isUserExist) {
        throw new app_error_1.AppError("You are not authorized or your account is blocked.", http_status_1.default.BAD_REQUEST);
    }
    // 2. Check group exist or not
    const isExistGroup = yield group_schema_1.Group_Model.findOne({ _id: id, accountId: isUserExist._id });
    if (!isExistGroup) {
        throw new app_error_1.AppError("Group info not found!!", http_status_1.default.BAD_REQUEST);
    }
    //3. check new group name already exist
    const isGroupNameExist = yield group_schema_1.Group_Model.findOne({ accountId: isUserExist._id, groupName: payload === null || payload === void 0 ? void 0 : payload.groupName });
    if (isGroupNameExist) {
        throw new app_error_1.AppError("Group name exist !!", http_status_1.default.BAD_REQUEST);
    }
    // 4. update the group
    const result = yield group_schema_1.Group_Model.findOneAndUpdate({
        _id: id,
        accountId: isUserExist._id,
    }, {
        groupName: payload === null || payload === void 0 ? void 0 : payload.groupName
    }, {
        new: true
    });
    return result;
});
const get_all_group_from_db = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Validate user
    const isUserExist = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isUserExist) {
        throw new app_error_1.AppError("You are not authorized or your account is blocked.", http_status_1.default.BAD_REQUEST);
    }
    const result = yield group_schema_1.Group_Model.aggregate([
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
});
const get_single_group_with_subscriber_from_db = (email, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Validate user
    const isUserExist = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isUserExist) {
        throw new app_error_1.AppError("You are not authorized or your account is blocked.", http_status_1.default.BAD_REQUEST);
    }
    const single_group = yield group_schema_1.Group_Model.findOne({ _id: groupId, accountId: isUserExist._id });
    if (!single_group) {
        throw new app_error_1.AppError("Group info not found!!", http_status_1.default.NOT_FOUND);
    }
    // find all the subscriber for this group
    const result = yield subscriber_schema_1.Subscriber_Model.find({ groupId: single_group._id });
    return {
        group: single_group,
        subscriber: result
    };
});
const delete_group_from_db = (email, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isUserExist) {
        throw new app_error_1.AppError("You are not authorized or your account is blocked.", http_status_1.default.BAD_REQUEST);
    }
    const single_group = yield group_schema_1.Group_Model.findOne({ _id: groupId, accountId: isUserExist._id });
    if (!single_group) {
        throw new app_error_1.AppError("Group info not found!!", http_status_1.default.NOT_FOUND);
    }
    // remove all subscriber group id
    yield subscriber_schema_1.Subscriber_Model.updateMany({ groupId: single_group._id }, { groupId: null });
    yield group_schema_1.Group_Model.findOneAndDelete({ _id: groupId, accountId: isUserExist._id });
    return;
});
exports.group_services = {
    create_new_group_into_db,
    update_group_into_db,
    get_all_group_from_db,
    get_single_group_with_subscriber_from_db,
    delete_group_from_db
};
