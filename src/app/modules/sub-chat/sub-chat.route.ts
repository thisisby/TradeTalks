import {Router} from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import SubChatController from "./sub-chat.controller";
import roleCheckMiddleware from "../../middlewares/role-check.middleware";

const route: Router = Router()

route.use(authMiddleware)
route.post("", SubChatController.createSubChat)
route.get("/:id", SubChatController.getSubChatById)
route.delete("/:id", SubChatController.deleteSubchat)

route.use(roleCheckMiddleware)
route.patch("/:id", SubChatController.updateSubChat)

export default route