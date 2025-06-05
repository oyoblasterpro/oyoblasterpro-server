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
    try {
        const info = await transporter.sendMail({
            from: 'info@digitalcreditai.com', // Must be a verified email
            to,
            subject,
            text,
            html,
        });

        // console.log('📧 Email sent!');
        // console.log('Envelope:', info.envelope);
        // console.log('MessageId:', info.messageId);
    } catch (err) {
        console.error('Email send failed:', err);
    }
};

export default sendMail;
