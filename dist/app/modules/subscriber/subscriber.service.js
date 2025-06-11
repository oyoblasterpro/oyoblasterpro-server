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
const mailValidator_1 = require("../../utils/mailValidator");
// const create_subscriber_into_db = async (req: Request) => {
//     const filePath = req.file!.path;
//     const emails = excel_reader(filePath);
//     const email = req?.user?.email as string;
//     const isExistAccount = await Account_Model.findOne({
//         email,
//         status: "ACTIVE",
//         isDeleted: false,
//     });
//     if (!isExistAccount) {
//         // Delete file on error
//         await fs.unlink(filePath);
//         throw new AppError("You are not authorized or account blocked", httpStatus.BAD_REQUEST);
//     }
//     if (!emails.length) {
//         // Delete file on error
//         await fs.unlink(filePath);
//         throw new AppError("Please insert minimum 1 data", httpStatus.BAD_REQUEST);
//     }
//     // check email before save is valid or bounce
//     const validateEmail = []
//     for (const email of emails) {
//         if (await verifyEmail(email?.email as string)) {
//             validateEmail.push(email)
//         }
//     }
//     return { valid: validateEmail.length, total: emails.length }
//     // const payload = {
//     //     accountId: isExistAccount._id,
//     //     groupId: req?.body?.groupId,
//     //     subscribers: emails,
//     // };
//     // const result = await Subscriber_Model.insertMany(payload);
//     // ✅ Delete file only after successful save
//     // await fs.unlink(filePath);
//     // return result;
// };
// const create_subscriber_into_db = async (req: Request) => {
//     const filePath = req.file!.path;
//     const emails = excel_reader(filePath);
//     const email = req?.user?.email as string;
//     const isExistAccount = await Account_Model.findOne({
//         email,
//         status: "ACTIVE",
//         isDeleted: false,
//     });
//     if (!isExistAccount) {
//         await fs.unlink(filePath);
//         throw new AppError("You are not authorized or account blocked", httpStatus.BAD_REQUEST);
//     }
//     if (!emails.length) {
//         await fs.unlink(filePath);
//         throw new AppError("Please insert minimum 1 data", httpStatus.BAD_REQUEST);
//     }
//     try {
//         const validationResults = await Promise.all(
//             emails.map(async (item) => {
//                 const isValid = await verifyEmail(item.email as string);
//                 return isValid ? item : null;
//             })
//         );
//         const validEmails = validationResults.filter(Boolean);
//         const payload = {
//             accountId: isExistAccount._id,
//             groupId: req?.body?.groupId,
//             subscribers: validEmails,
//         };
//         const result = await Subscriber_Model.insertMany(payload);
//         // ✅ Delete file only after successful save
//         await fs.unlink(filePath);
//         return result;
//     }
//     catch (error) {
//         console.log(error)
//     }
//     finally {
//         // অবশিষ্ট থাকা ফাইল ডিলিট করো
//         await fs.unlink(filePath);
//     }
// };
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
        yield promises_1.default.unlink(filePath);
        throw new app_error_1.AppError("You are not authorized or account blocked", http_status_1.default.BAD_REQUEST);
    }
    if (!emails.length) {
        yield promises_1.default.unlink(filePath);
        throw new app_error_1.AppError("Please insert minimum 1 data", http_status_1.default.BAD_REQUEST);
    }
    // have already subscribers
    const hasSubscribers = yield subscriber_schema_1.Subscriber_Model.findOne({
        accountId: isExistAccount._id,
        groupId: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.groupId,
    });
    try {
        const io = req.app.get("io");
        const validEmails = [];
        const invalidEmails = [];
        let checked = 0;
        yield Promise.all(emails.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const targetEmail = item.email;
            const isValid = yield (0, mailValidator_1.verifyEmail)(targetEmail);
            checked += 1;
            if (isValid) {
                validEmails.push(item);
            }
            else {
                invalidEmails.push(targetEmail);
            }
            io.emit("subscriber-progress", {
                total: emails === null || emails === void 0 ? void 0 : emails.length,
                checked,
            });
        })));
        // Save invalid emails to Suppression DB (if not already saved)
        const existingSuppressed = yield subscriber_schema_1.Suppression_Model.find({ email: { $in: invalidEmails } }).distinct('email');
        const newSuppressedEmails = invalidEmails.filter(email => !existingSuppressed.includes(email));
        const suppressionDocs = newSuppressedEmails.map(email => ({ email }));
        if (suppressionDocs.length > 0) {
            yield subscriber_schema_1.Suppression_Model.insertMany(suppressionDocs);
        }
        if (hasSubscribers) {
            const existing = hasSubscribers.subscribers || [];
            const existingEmailsSet = new Set(existing.map((s) => s.email));
            const newSubs = validEmails.filter((s) => !existingEmailsSet.has(s.email));
            const updated = [...existing, ...newSubs];
            yield subscriber_schema_1.Subscriber_Model.updateOne({ _id: hasSubscribers._id }, { $set: { subscribers: updated } });
            return { total: emails === null || emails === void 0 ? void 0 : emails.length, valid: validEmails === null || validEmails === void 0 ? void 0 : validEmails.length };
        }
        else {
            const payload = {
                accountId: isExistAccount._id,
                groupId: req.body.groupId,
                subscribers: validEmails,
            };
            yield subscriber_schema_1.Subscriber_Model.create(payload);
            return { total: emails === null || emails === void 0 ? void 0 : emails.length, valid: validEmails === null || validEmails === void 0 ? void 0 : validEmails.length };
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        yield promises_1.default.unlink(filePath);
    }
});
exports.subscriber_service = {
    create_subscriber_into_db
};
