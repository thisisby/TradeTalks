import {Router} from "express";

import ChatTypeController from "./chat-type.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import roleCheckMiddleware from "../../middlewares/role-check.middleware";

const route: Router = Router()

route.use(authMiddleware)
route.get("", ChatTypeController.getAllChatTypes)
route.get("/:id", ChatTypeController.getChatTypeById)

route.use(roleCheckMiddleware)
route.post("", ChatTypeController.saveChatType)
route.patch("/:id", ChatTypeController.updateChatType)
route.delete("/:id", ChatTypeController.deleteChatType)

export default route