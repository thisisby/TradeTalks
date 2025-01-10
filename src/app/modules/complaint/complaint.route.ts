import {Router} from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import ComplaintController from "./complaint.controller";
import roleCheckMiddleware from "../../middlewares/role-check.middleware";

const route: Router = Router();

route.use(authMiddleware)
route.get("/users/:id", ComplaintController.getUserComplaints)
route.get("/chats/:id", ComplaintController.getChatComplaints)

route.get("/", ComplaintController.getAllComplaints)
route.post("/", ComplaintController.createComplaint)
route.get("/:id", ComplaintController.getComplaintById)

route.use(roleCheckMiddleware)
route.delete("/:id", ComplaintController.deleteComplaint)

export default route