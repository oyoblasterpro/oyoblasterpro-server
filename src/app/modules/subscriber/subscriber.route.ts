import { Router } from "express";
import uploader from "../../middlewares/uploader";
import { subscriber_controller } from "./subscriber.controller";
import RequestValidator from "../../middlewares/request_validator";
import { subscriber_validation } from "./subscriber.validation";
import auth from "../../middlewares/auth";
const subscriber_route = Router()

subscriber_route.get("/", auth("ADMIN", "USER"), subscriber_controller.get_all_subscriber)
subscriber_route.post("/",
    auth("ADMIN", "USER"),
    uploader.single("file"),
    (req, res, next) => {
        req.body = JSON.parse(req?.body?.data)
        next()
    },
    RequestValidator(subscriber_validation.create)
    ,
    subscriber_controller.create_subscriber
)




export default subscriber_route;