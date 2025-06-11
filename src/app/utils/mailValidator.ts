import dns from 'dns/promises';
import { SMTPClient } from 'smtp-client';
import axios from 'axios';
import { Suppression_Model } from '../modules/subscriber/subscriber.schema';

// 1. Email regex validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 2. Disposable email list checker (API or static list)
const isDisposableEmail = async (email: string) => {
    try {
        const res = await axios.get(`https://verifier.meetchopra.com/verify/${email}`);
        return res.data.reason === 'disposable';
    } catch (err) {
        return false;
    }
};


// 3. Check MX record
const hasMXRecord = async (domain: string) => {
    try {
        const records = await dns.resolveMx(domain);
        return records.length > 0;
    } catch {
        return false;
    }
};

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

const isSuppressed = async (email: string): Promise<boolean> => {
    const suppressed = await Suppression_Model.findOne({ email });
    return !!suppressed;
};

export const verifyEmail = async (email: string) => {
    if (!emailRegex.test(email)) return false;
    if (await isSuppressed(email)) return false;
    if (await isDisposableEmail(email)) return false;
    const domain = email.split('@')[1];
    if (!await hasMXRecord(domain)) return false;

    return true;
};