import { Router } from "express";
import { mail_controllers } from "./mail.controller";
import uploader from "../../middlewares/uploader";

const mailRouter = Router()

mailRouter.post("/",
    uploader.single("file"),
    (req, res, next) => {
        req.body = JSON.parse(req?.body?.data)
        next()
    },
    mail_controllers.send_mail
)



export default mailRouter;