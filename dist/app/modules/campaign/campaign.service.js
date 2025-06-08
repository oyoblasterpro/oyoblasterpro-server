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
exports.campaign_services = void 0;
const campaign_schema_1 = require("./campaign.schema");
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = require("../../utils/app_error");
const group_schema_1 = require("../group/group.schema");
const auth_schema_1 = require("../auth/auth.schema");
const subscriber_schema_1 = require("../subscriber/subscriber.schema");
const mail_sender_1 = __importDefault(require("../../utils/mail_sender"));
const save_campaign_into_db = (payload, email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isExistUser) {
        throw new app_error_1.AppError("You are not authorized or block account", http_status_1.default.BAD_REQUEST);
    }
    // check group exist
    const isGroupExist = yield group_schema_1.Group_Model.findOne({ _id: payload.groupId, accountId: isExistUser._id });
    if (!isGroupExist) {
        throw new app_error_1.AppError("Group not found!!", http_status_1.default.BAD_REQUEST);
    }
    // check already campaign name exist
    const isCampaignExist = yield campaign_schema_1.Campaign_Model.findOne({ subject: payload.subject, userId: isExistUser._id, groupId: isGroupExist._id });
    if (isCampaignExist) {
        throw new app_error_1.AppError("Campaign name already exist!!", http_status_1.default.BAD_REQUEST);
    }
    // create new payload
    const campaign_payload = Object.assign(Object.assign({}, payload), { userId: isExistUser._id, groupId: isGroupExist._id });
    const result = yield campaign_schema_1.Campaign_Model.create(campaign_payload);
    return result;
});
const get_all_campaign_from_db = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // find account exist
    const isExistUser = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isExistUser) {
        throw new app_error_1.AppError("You are not authorized or block account", http_status_1.default.BAD_REQUEST);
    }
    const result = yield campaign_schema_1.Campaign_Model.find({ userId: isExistUser._id }).populate("groupId");
    return result;
});
const get_single_campaign_from_db = (email, campaignId) => __awaiter(void 0, void 0, void 0, function* () {
    // find account exist
    const isExistUser = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isExistUser) {
        throw new app_error_1.AppError("You are not authorized or block account", http_status_1.default.BAD_REQUEST);
    }
    const result = yield campaign_schema_1.Campaign_Model.find({ userId: isExistUser._id, _id: campaignId }).populate("groupId");
    if (!result) {
        throw new app_error_1.AppError("Campaign not found!!", http_status_1.default.OK);
    }
    return result;
});
const update_campaign_into_db = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    // find account exist
    const isExistUser = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isExistUser) {
        throw new app_error_1.AppError("You are not authorized or block account", http_status_1.default.BAD_REQUEST);
    }
    const isExistCampaign = yield campaign_schema_1.Campaign_Model.find({ userId: isExistUser._id, _id: id });
    if (!isExistCampaign) {
        throw new app_error_1.AppError("Campaign not found!!", http_status_1.default.OK);
    }
    // update campaign
    const result = yield campaign_schema_1.Campaign_Model.findOneAndUpdate({ userId: isExistUser._id, _id: id }, payload, { new: true });
    return result;
});
const delete_campaign_into_db = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    // find account exist
    const isExistUser = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isExistUser) {
        throw new app_error_1.AppError("You are not authorized or block account", http_status_1.default.BAD_REQUEST);
    }
    const isExistCampaign = yield campaign_schema_1.Campaign_Model.find({ userId: isExistUser._id, _id: id });
    if (!isExistCampaign) {
        throw new app_error_1.AppError("Campaign not found!!", http_status_1.default.OK);
    }
    // update campaign
    yield campaign_schema_1.Campaign_Model.findOneAndDelete({ userId: isExistUser._id, _id: id });
    return;
});
const start_mailing_with_campaign = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const { id } = req.params;
    // Find user
    const isExistUser = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isExistUser) {
        throw new app_error_1.AppError("You are not authorized or block account", http_status_1.default.BAD_REQUEST);
    }
    // Find campaign
    const isExistCampaign = yield campaign_schema_1.Campaign_Model.findOne({ userId: isExistUser._id, _id: id });
    if (!isExistCampaign) {
        throw new app_error_1.AppError("Campaign not found!!", http_status_1.default.NOT_FOUND);
    }
    // Find subscriber group
    const subscriber = yield subscriber_schema_1.Subscriber_Model.findOne({ accountId: isExistUser._id, groupId: isExistCampaign.groupId });
    if (!subscriber || !Array.isArray(subscriber.subscribers)) {
        throw new app_error_1.AppError("No subscribers found for this campaign group", http_status_1.default.NOT_FOUND);
    }
    const total = subscriber.subscribers.length;
    let sent = 0;
    for (const sub of subscriber.subscribers) {
        yield (0, mail_sender_1.default)(sub.email, isExistCampaign.subject, isExistCampaign.text, isExistCampaign.html);
        sent++;
    }
    yield campaign_schema_1.Campaign_Model.findOneAndUpdate({ userId: isExistUser._id, _id: id }, { isDelivered: true });
    // Return progress summary
    return {
        totalMails: total,
        mailsSent: sent,
    };
});
exports.campaign_services = {
    save_campaign_into_db,
    get_all_campaign_from_db,
    get_single_campaign_from_db,
    update_campaign_into_db,
    delete_campaign_into_db,
    start_mailing_with_campaign
};
