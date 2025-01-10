import {Router} from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import MyChatController from "./my-chat.controller";
import ChatController from "../chat/chat.controller";
import roleCheckMiddleware from "../../middlewares/role-check.middleware";
const route: Router = Router()



route.use(authMiddleware)
route.delete("/:id", MyChatController.deleteMyChats)
route.patch("/:id", MyChatController.updateNotification)
route.post("/personal", MyChatController.createPersonalChat)
route.get("/messaged-chats", ChatController.getChatsWithUserMessage)
route.get("/personal", MyChatController.getPersonalChats)
route.get("/personal/:id", MyChatController.getPersonalChatByChatId)
route.get("/saved", MyChatController.getSavedChats)
route.get("/subscribe", MyChatController.getSubscribedChats)
route.post("/saved", MyChatController.createSavedChat)
route.post("/subscribe", MyChatController.createSubscribeChat)
route.get("/history", ChatController.getVisitedChats)

route.use(roleCheckMiddleware)
route.get("/saved/:id", MyChatController.getUserSavedChats)


export default route