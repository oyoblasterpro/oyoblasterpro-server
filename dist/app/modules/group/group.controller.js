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
exports.group_controller = void 0;
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const manage_response_1 = __importDefault(require("../../utils/manage_response"));
const group_services_1 = require("./group.services");
const http_status_1 = __importDefault(require("http-status"));
const create_new_group = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield group_services_1.group_services.create_new_group_into_db(req === null || req === void 0 ? void 0 : req.body, email);
    (0, manage_response_1.default)(res, {
        success: true,
        message: "Group create successful.",
        statusCode: http_status_1.default.CREATED,
        data: result
    });
}));
const update_group = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req.user;
    const result = yield group_services_1.group_services.update_group_into_db(req === null || req === void 0 ? void 0 : req.body, email, (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, manage_response_1.default)(res, {
        success: true,
        message: "Group update successful.",
        statusCode: http_status_1.default.OK,
        data: result
    });
}));
const get_all_group = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const result = yield group_services_1.group_services.get_all_group_from_db(email);
    (0, manage_response_1.default)(res, {
        success: true,
        message: "Group fetched successful.",
        statusCode: http_status_1.default.OK,
        data: result
    });
}));
const get_single_group = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req.user;
    const result = yield group_services_1.group_services.get_single_group_with_subscriber_from_db(email, (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, manage_response_1.default)(res, {
        success: true,
        message: "Group with subscriber fetched successful.",
        statusCode: http_status_1.default.OK,
        data: result
    });
}));
const delete_group = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req.user;
    const result = yield group_services_1.group_services.delete_group_from_db(email, (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, manage_response_1.default)(res, {
        success: true,
        message: "Group delete successful.",
        statusCode: http_status_1.default.OK,
        data: result
    });
}));
exports.group_controller = {
    create_new_group,
    update_group,
    get_all_group,
    get_single_group,
    delete_group
};
