import {Router} from "express";

import authMiddleware from "../../middlewares/auth.middleware";
import multer from "multer";
import ChatController from "./chat.controller";
import roleCheckMiddleware from "../../middlewares/role-check.middleware";

const upload = multer({dest: "uploads/"});

const route: Router = Router()

route.use(authMiddleware)
route.get("", ChatController.getAllChats)
route.get("/:id", ChatController.getChatById)
route.get("/:id/subchats", ChatController.getSubChatsByChatId)
route.post("", upload.single("photo"), ChatController.createChat)

route.use(roleCheckMiddleware)
route.patch("/:id", upload.single("photo"), ChatController.update)


export default route