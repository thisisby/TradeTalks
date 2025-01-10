import {Router} from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import MessageController from "./message.controller";
import multer from "multer";

const route: Router = Router()
const upload = multer({ dest: "uploads/" });

route.use(authMiddleware)

route.post("/:subChat_id", upload.single("photo"), MessageController.saveMessage)
route.get("/:subChat_id", MessageController.getPersonalSubChatMessages)
route.get("/:subChat_id/location/:location_id", MessageController.getSubChatMessages)
route.delete("/:subChat_id/message/:id", MessageController.deleteMessage)

export default route