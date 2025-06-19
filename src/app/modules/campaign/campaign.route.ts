import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { campaign_validation } from "./campaign.validation";
import { campaign_controllers } from "./campaign.controller";

const campaign_route = Router()

//create new campaign

campaign_route.post("/", auth("ADMIN", "USER"), RequestValidator(campaign_validation.create), campaign_controllers.create_campaign)
campaign_route.get("/", auth("ADMIN", "USER"), campaign_controllers.get_all_campaign)
campaign_route.get("/:id", auth("ADMIN", "USER"), campaign_controllers.get_single_campaign)
campaign_route.patch("/:id", auth("ADMIN", "USER"), campaign_controllers.update_campaign)
campaign_route.delete("/:id", auth("ADMIN", "USER"), campaign_controllers.delete_campaign)
campaign_route.post("/start-mailing/:id", auth("ADMIN", "USER"), campaign_controllers.start_mailing)
campaign_route.post("/send-test-mail", campaign_controllers.send_test)

export default campaign_route;