import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { group_services } from "./group.services";
import httpStatus from 'http-status';

const create_new_group = catchAsync(async (req, res) => {
    const { email } = req.user!
    const result = await group_services.create_new_group_into_db(req?.body, email)
    manageResponse(res, {
        success: true,
        message: "Group create successful.",
        statusCode: httpStatus.CREATED,
        data: result
    })
})
const update_group = catchAsync(async (req, res) => {
    const { email } = req.user!
    const result = await group_services.update_group_into_db(req?.body, email, req?.params?.id)
    manageResponse(res, {
        success: true,
        message: "Group update successful.",
        statusCode: httpStatus.OK,
        data: result
    })
})
const get_all_group = catchAsync(async (req, res) => {
    const { email } = req.user!
    const result = await group_services.get_all_group_from_db(email)
    manageResponse(res, {
        success: true,
        message: "Group fetched successful.",
        statusCode: httpStatus.OK,
        data: result
    })
})
const get_single_group = catchAsync(async (req, res) => {
    const { email } = req.user!
    const result = await group_services.get_single_group_with_subscriber_from_db(email, req?.params?.id)
    manageResponse(res, {
        success: true,
        message: "Group with subscriber fetched successful.",
        statusCode: httpStatus.OK,
        data: result
    })
})
const delete_group = catchAsync(async (req, res) => {
    const { email } = req.user!
    const result = await group_services.delete_group_from_db(email, req?.params?.id)
    manageResponse(res, {
        success: true,
        message: "Group delete successful.",
        statusCode: httpStatus.OK,
        data: result
    })
})


export const group_controller = {
    create_new_group,
    update_group,
    get_all_group,
    get_single_group,
    delete_group
}