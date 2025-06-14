import catchAsync from "../../utils/catch_async"
import manageResponse from "../../utils/manage_response"
import httpStatus from 'http-status';
import { subscriber_service } from "./subscriber.service";

const create_subscriber = catchAsync(async (req, res) => {
    const result = await subscriber_service.create_subscriber_into_db(req)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Subscribers created!!",
        data: result
    })
})
const get_all_subscriber = catchAsync(async (req, res) => {
    const { groupId } = req?.query
    const { email } = req?.user!
    const result = await subscriber_service.get_all_subscribers(groupId as string, email)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Subscribers fetched!!",
        data: result
    })
})


export const subscriber_controller = {
    create_subscriber,
    get_all_subscriber
}