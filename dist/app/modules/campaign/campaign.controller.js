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
exports.campaign_controllers = void 0;
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const manage_response_1 = __importDefault(require("../../utils/manage_response"));
const campaign_service_1 = require("./campaign.service");
const http_status_1 = __importDefault(require("http-status"));
// const send_mail = catchAsync(async (req, res) => {
//     const result = await mail_services.send_mail_and_save_record_into_db(req)
//     manageResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Mail send successful",
//         data: result
//     })
// })
const create_campaign = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req === null || req === void 0 ? void 0 : req.user;
    const result = yield campaign_service_1.campaign_services.save_campaign_into_db(req.body, email);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Campaign created.",
        data: result
    });
}));
const get_all_campaign = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req === null || req === void 0 ? void 0 : req.user;
    const result = yield campaign_service_1.campaign_services.get_all_campaign_from_db(email);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "All campaign fetched.",
        data: result
    });
}));
const get_single_campaign = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req === null || req === void 0 ? void 0 : req.user;
    const result = yield campaign_service_1.campaign_services.get_single_campaign_from_db(email, (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Campaign fetched.",
        data: result
    });
}));
const update_campaign = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_service_1.campaign_services.update_campaign_into_db(req);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Campaign Updated.",
        data: result
    });
}));
const delete_campaign = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_service_1.campaign_services.delete_campaign_into_db(req);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Campaign deleted.",
        data: result
    });
}));
const start_mailing = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_service_1.campaign_services.start_mailing_with_campaign(req);
    (0, manage_response_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Successfully send",
        data: result
    });
}));
exports.campaign_controllers = {
    // send_mail,
    create_campaign,
    get_all_campaign,
    get_single_campaign,
    update_campaign,
    delete_campaign,
    start_mailing
};
