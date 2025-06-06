import { Router } from "express";
import auth from "../../middlewares/auth";
import { group_controller } from "./group.controller";

const groupRouter = Router()


groupRouter.post("/", auth("ADMIN", "USER"), group_controller.create_new_group)
groupRouter.patch("/:id", auth("ADMIN", "USER"), group_controller.update_group)
groupRouter.get("/:id", auth("ADMIN", "USER"), group_controller.get_single_group)
groupRouter.delete("/:id", auth("ADMIN", "USER"), group_controller.delete_group)
groupRouter.get("/", auth("ADMIN", "USER"), group_controller.get_all_group)


export default groupRouter;