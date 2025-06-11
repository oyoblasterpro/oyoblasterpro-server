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
exports.verifyEmail = void 0;
const promises_1 = __importDefault(require("dns/promises"));
const axios_1 = __importDefault(require("axios"));
const subscriber_schema_1 = require("../modules/subscriber/subscriber.schema");
// 1. Email regex validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 2. Disposable email list checker (API or static list)
const isDisposableEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios_1.default.get(`https://verifier.meetchopra.com/verify/${email}`);
        return res.data.reason === 'disposable';
    }
    catch (err) {
        return false;
    }
});
// 3. Check MX record
const hasMXRecord = (domain) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield promises_1.default.resolveMx(domain);
        return records.length > 0;
    }
    catch (_a) {
        return false;
    }
});
// 4. Check CNAME record
// const hasCNAMERecord = async (domain: string) => {
//     try {
//         const records = await dns.resolveCname(domain);
//         return records.length > 0;
//     } catch {
//         return false;
//     }
// };
// // 5. SMTP connection test
// const canConnectSMTP = async (email: string) => {
//     const domain = email.split('@')[1];
//     try {
//         const mxRecords = await dns.resolveMx(domain);
//         const mxHost = mxRecords.sort((a, b) => a.priority - b.priority)[0].exchange;
//         const client = new SMTPClient({
//             host: mxHost,
//             port: 25,
//         });
//         await client.connect();
//         await client.rcpt({ to: email });
//         await client.quit();
//         return true;
//     } catch (err) {
//         return false;
//     }
// };
// export const verifyEmail = async (email: string) => {
//     if (!emailRegex.test(email)) {
//         return false;
//     }
//     const disposable = await isDisposableEmail(email)
//     if (disposable) return false
//     const domain = email.split('@')[1];
//     const hasMx = await hasMXRecord(domain);
//     if (!hasMx) return false;
//     return true;
// };
const isSuppressed = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const suppressed = yield subscriber_schema_1.Suppression_Model.findOne({ email });
    return !!suppressed;
});
const verifyEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!emailRegex.test(email))
        return false;
    if (yield isSuppressed(email))
        return false;
    if (yield isDisposableEmail(email))
        return false;
    const domain = email.split('@')[1];
    if (!(yield hasMXRecord(domain)))
        return false;
    return true;
});
exports.verifyEmail = verifyEmail;
