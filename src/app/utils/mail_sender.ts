// src/utils/sendMail.ts

import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { configs } from '../configs';


// ✅ SESv2 Client Initialization
const sesClient = new SESv2Client({
    region: 'us-east-1', // or your region
    credentials: {
        accessKeyId: configs.aws.access_key_id!,
        secretAccessKey: configs.aws.access_secret_key!,
    },
});

// ✅ Nodemailer Transporter using SES SDK v3
const transporter = nodemailer.createTransport({
    SES: { sesClient, SendEmailCommand },
});

// ✅ Email Sender Function
const sendMail = async (to: string, subject: string, text: string, html: string) => {
    const info = await transporter.sendMail({
        from: 'info@digitalcreditai.com',
        to,
        subject,
        text,
        html,
    });
    return info
};

export default sendMail;
