import { AppError } from "../../utils/app_error";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { Account_Model } from "../auth/auth.schema";
import { Group_Model } from "../group/group.schema";
import { TCampaign } from "./campaign.interface";
import { Campaign_Model } from "./campaign.schema";
import { campaign_services } from "./campaign.service";
import httpStatus from 'http-status';

// const send_mail = catchAsync(async (req, res) => {
//     const result = await mail_services.send_mail_and_save_record_into_db(req)
//     manageResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Mail send successful",
//         data: result
//     })
// })

const create_campaign = catchAsync(async (req, res) => {
    const { email } = req?.user!
    const result = await campaign_services.save_campaign_into_db(req.body, email)
    manageResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Campaign created.",
        data: result
    })
})
const get_all_campaign = catchAsync(async (req, res) => {
    const { email } = req?.user!
    const result = await campaign_services.get_all_campaign_from_db(email)
    manageResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All campaign fetched.",
        data: result
    })
})
const get_single_campaign = catchAsync(async (req, res) => {
    const { email } = req?.user!
    const result = await campaign_services.get_single_campaign_from_db(email, req?.params?.id)
    manageResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Campaign fetched.",
        data: result
    })
})
const update_campaign = catchAsync(async (req, res) => {
    const result = await campaign_services.update_campaign_into_db(req)
    manageResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Campaign Updated.",
        data: result
    })
})
const delete_campaign = catchAsync(async (req, res) => {
    const result = await campaign_services.delete_campaign_into_db(req)
    manageResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Campaign deleted.",
        data: result
    })
})
const start_mailing = catchAsync(async (req, res) => {
    const result = await campaign_services.start_mailing_with_campaign(req)
    manageResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully send",
        data: result
    })
})
const send_test = catchAsync(async (req, res) => {
    const result = await campaign_services.send_test_mail(req?.body?.email)
    manageResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Successfully send",
        data: result
    })
})


export const campaign_controllers = {
    // send_mail,
    create_campaign,
    get_all_campaign,
    get_single_campaign,
    update_campaign,
    delete_campaign,
    start_mailing,
    send_test

}