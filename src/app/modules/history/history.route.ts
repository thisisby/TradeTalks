import {Router} from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import HistoryController from "./history.controller";

const route: Router = Router()

route.use(authMiddleware)
route.post("/", HistoryController.recordUserVisit)
route.get("/", HistoryController.getUserVisitHistory)
route.delete("/", HistoryController.deleteUserVisit)
export default route
