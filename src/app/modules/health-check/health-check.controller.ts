import {NextFunction, Request, Response} from "express";
import LocationService from "../location/location.service";
import HealthCheckService from "./health-check.service";

class HealthCheckController {
    async check(req: Request, res: Response, next: NextFunction) {
        try {
            const redisCheck = await HealthCheckService.checkRedis();
            const dbCheck = await HealthCheckService.checkDatabase();

            if (redisCheck && dbCheck) {
                res.json({
                    is_error: false,
                    message: "OK",
                });
            } else {
                res.json({
                    is_error: true,
                    message: "ERROR",
                });

            }
        } catch (e) {
            next(e);
        }
    }
}

export default new HealthCheckController();