import {Router} from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import roleCheckMiddleware from "../../middlewares/role-check.middleware";
import AdminController from "./admin.controller";
import multer from "multer";
const route: Router = Router()

const upload = multer({ dest: "uploads/" });


route.use(authMiddleware)
route.use(roleCheckMiddleware)
route.get("/users", AdminController.getAllUsers)
route.post("/users", upload.single("avatar"), AdminController.saveUser)
route.delete("/users/:id", AdminController.deleteUser)
route.patch("/users/:id", upload.single("avatar"), AdminController.updateUser)

route.get("/chats", AdminController.getAllChats)
route.post("/chats", upload.single("photo"), AdminController.createChat)
route.patch("/chats/:id", upload.single("photo"), AdminController.updateChat)
route.delete("/chats/:id", AdminController.deleteChat)

route.get("/users/:id/subscribed", AdminController.findAmountOfSubscribedChats)
route.get("/users/:id/saved", AdminController.findAmountOfSavedChats)

route.get("/online", AdminController.getUsersOnlineTime)



export default route