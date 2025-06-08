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
exports.subscriber_service = void 0;
const excel_reader_1 = require("../../utils/excel_reader");
const app_error_1 = require("../../utils/app_error");
const http_status_1 = __importDefault(require("http-status"));
const subscriber_schema_1 = require("./subscriber.schema");
const auth_schema_1 = require("../auth/auth.schema");
const promises_1 = __importDefault(require("fs/promises"));
const create_subscriber_into_db = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const filePath = req.file.path;
    const emails = (0, excel_reader_1.excel_reader)(filePath);
    const email = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.email;
    const isExistAccount = yield auth_schema_1.Account_Model.findOne({
        email,
        status: "ACTIVE",
        isDeleted: false,
    });
    if (!isExistAccount) {
        // Delete file on error
        yield promises_1.default.unlink(filePath);
        throw new app_error_1.AppError("You are not authorized or account blocked", http_status_1.default.BAD_REQUEST);
    }
    if (!emails.length) {
        // Delete file on error
        yield promises_1.default.unlink(filePath);
        throw new app_error_1.AppError("Please insert minimum 1 data", http_status_1.default.BAD_REQUEST);
    }
    const payload = {
        accountId: isExistAccount._id,
        groupId: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.groupId,
        subscribers: emails,
    };
    const result = yield subscriber_schema_1.Subscriber_Model.insertMany(payload);
    // ✅ Delete file only after successful save
    yield promises_1.default.unlink(filePath);
    return result;
});
exports.subscriber_service = {
    create_subscriber_into_db
};
