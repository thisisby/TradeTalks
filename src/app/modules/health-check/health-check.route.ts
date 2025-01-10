import {Router} from "express";
import HealthCheckController from "./health-check.controller";

const route: Router = Router();

route.get("", HealthCheckController.check)

export default route