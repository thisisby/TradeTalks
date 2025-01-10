import {Router} from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import LocationController from "./location.controller";
import roleCheckMiddleware from "../../middlewares/role-check.middleware";

const route: Router = Router()

route.use(authMiddleware)
route.get("/", LocationController.getAllLocations)
route.get("/:id", LocationController.getLocationById)

route.use(roleCheckMiddleware)
route.patch("/:id", LocationController.updateLocation)
route.post("/", LocationController.saveLocation)
route.delete("/:id", LocationController.deleteLocation)

export default route