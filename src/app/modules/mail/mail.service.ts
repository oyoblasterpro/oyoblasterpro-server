import { Request } from "express";
import { excel_reader } from "../../utils/excel_reader";
import mail_sender from "../../utils/mail_sender"

const send_mail_and_save_record_into_db = async (req: Request) => {
    const emails = excel_reader(req?.file?.path!);
    const { subject, text, html } = req?.body

    for (const email of emails) {
        await mail_sender(email, subject, text, html);
    }

    return { total: emails.length };
}


export const mail_services = {
    send_mail_and_save_record_into_db
}