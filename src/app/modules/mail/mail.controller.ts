import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { mail_services } from "./mail.service";
import httpStatus from 'http-status';

const send_mail = catchAsync(async (req, res) => {
    const filePath = req?.file?.path;
    const result = await mail_services.send_mail_and_save_record_into_db(req)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Mail send successful",
        data: result
    })
})

export const mail_controllers ={
    send_mail
}