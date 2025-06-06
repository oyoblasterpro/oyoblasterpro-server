import { Request } from "express";
import { excel_reader } from "../../utils/excel_reader";
import { AppError } from "../../utils/app_error";
import httpStatus from 'http-status';
import { Subscriber_Model } from "./subscriber.schema";
import { Account_Model } from "../auth/auth.schema";
import fs from 'fs/promises';

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
        // Delete file on error
        await fs.unlink(filePath);
        throw new AppError("You are not authorized or account blocked", httpStatus.BAD_REQUEST);
    }

    if (!emails.length) {
        // Delete file on error
        await fs.unlink(filePath);
        throw new AppError("Please insert minimum 1 data", httpStatus.BAD_REQUEST);
    }

    const payload = {
        accountId: isExistAccount._id,
        groupId: req?.body?.groupId,
        subscribers: emails,
    };

    const result = await Subscriber_Model.insertMany(payload);

    // ✅ Delete file only after successful save
    await fs.unlink(filePath);

    return result;
};



export const subscriber_service = {
    create_subscriber_into_db
}