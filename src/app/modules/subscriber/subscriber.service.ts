import { Request } from "express";
import { excel_reader } from "../../utils/excel_reader";
import { AppError } from "../../utils/app_error";
import httpStatus from 'http-status';
import { Subscriber_Model, Suppression_Model } from "./subscriber.schema";
import { Account_Model } from "../auth/auth.schema";
import fs from 'fs/promises';
import { verifyEmail } from "../../utils/mailValidator";
import { Sub } from "./subscriber.interface";

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



const create_subscriber_into_db = async (req: Request) => {
    const filePath = req.file!.path;
    const emails = excel_reader(filePath);
    const email = req?.user?.email as string;

    const isExistAccount = await Account_Model.findOne({
        email,
        status: "ACTIVE",
        isDeleted: false,
    });

    if (!isExistAccount) {
        await fs.unlink(filePath);
        throw new AppError("You are not authorized or account blocked", httpStatus.BAD_REQUEST);
    }

    if (!emails.length) {
        await fs.unlink(filePath);
        throw new AppError("Please insert minimum 1 data", httpStatus.BAD_REQUEST);
    }
    // have already subscribers
    const hasSubscribers = await Subscriber_Model.findOne({
        accountId: isExistAccount._id,
        groupId: req?.body?.groupId,
    });


    try {
        const io = req.app.get("io");
        const validEmails: any[] = [];
        const invalidEmails: string[] = [];
        let checked = 0
        await Promise.all(
            emails.map(async (item) => {
                const targetEmail = item.email as string;
                const isValid = await verifyEmail(targetEmail);
                checked += 1
                if (isValid) {
                    validEmails.push(item);
                } else {
                    invalidEmails.push(targetEmail);
                }
                io.emit("subscriber-progress", {
                    total: emails?.length,
                    checked,
                });
            })
        );

        // Save invalid emails to Suppression DB (if not already saved)
        const existingSuppressed = await Suppression_Model.find({ email: { $in: invalidEmails } }).distinct('email');
        const newSuppressedEmails = invalidEmails.filter(email => !existingSuppressed.includes(email));
        const suppressionDocs = newSuppressedEmails.map(email => ({ email }));
        if (suppressionDocs.length > 0) {
            await Suppression_Model.insertMany(suppressionDocs);
        }


        if (hasSubscribers) {
            const existing = hasSubscribers.subscribers || [];
            const existingEmailsSet = new Set(existing.map((s: Sub) => s.email));
            const newSubs = validEmails.filter((s: Sub) => !existingEmailsSet.has(s.email));

            const updated = [...existing, ...newSubs];

            await Subscriber_Model.updateOne(
                { _id: hasSubscribers._id },
                { $set: { subscribers: updated } }
            );

            return { total: emails?.length, valid: validEmails?.length };
        } else {
            const payload = {
                accountId: isExistAccount._id,
                groupId: req.body.groupId,
                subscribers: validEmails,
            };
            await Subscriber_Model.create(payload);

            return { total: emails?.length, valid: validEmails?.length };
        }
    } catch (error) {
        console.log(error);
    } finally {
        await fs.unlink(filePath);
    }
};



export const subscriber_service = {
    create_subscriber_into_db
}