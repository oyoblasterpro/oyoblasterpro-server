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


export const subscriber_controller = {
    create_subscriber
}