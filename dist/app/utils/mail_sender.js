"use strict";
// src/utils/sendMail.ts
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
const nodemailer_1 = __importDefault(require("nodemailer"));
const client_sesv2_1 = require("@aws-sdk/client-sesv2");
const configs_1 = require("../configs");
// ✅ SESv2 Client Initialization
const sesClient = new client_sesv2_1.SESv2Client({
    region: 'us-east-1', // or your region
    credentials: {
        accessKeyId: configs_1.configs.aws.access_key_id,
        secretAccessKey: configs_1.configs.aws.access_secret_key,
    },
});
// ✅ Nodemailer Transporter using SES SDK v3
const transporter = nodemailer_1.default.createTransport({
    SES: { sesClient, SendEmailCommand: client_sesv2_1.SendEmailCommand },
});
// ✅ Email Sender Function
const sendMail = (to, subject, text, html) => __awaiter(void 0, void 0, void 0, function* () {
    const info = yield transporter.sendMail({
        from: 'info@digitalcreditai.com',
        to,
        subject,
        text,
        html,
    });
    return info;
});
exports.default = sendMail;
