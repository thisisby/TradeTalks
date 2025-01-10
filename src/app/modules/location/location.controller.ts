import {NextFunction, Request, Response} from "express";
import UserService from "../user/user.service";
import LocationService from "./location.service";
import UserValidator from "../user/user.validator";
import ApiError from "../../../errors/api.exception";
import {SaveUserDto, UpdateUserDto} from "../user/user.interface";
import LocationValidator from "./location.validator";

class LocationController {

    async getAllLocations(req: Request, res: Response, next: NextFunction) {
        try {
            const locations = await LocationService.findAll()

            res.json({
                is_error: false,
                message: "success",
                locations,
            });
        } catch (e) {
            next(e);
        }
    }

    async getLocationById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const location = await LocationService.findById(parseInt(id))

            res.json({
                is_error: false,
                message: "success",
                location,
            });
        } catch (e) {
            next(e);
        }
    }

    async updateLocation(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const {name} = req.body;

            LocationValidator.nameValidator(name)

            const [affectedCount] = await LocationService.updateById(parseInt(id), name);

            if (affectedCount > 0) {
                res
                    .status(200)
                    .json({
                        is_error: false,
                        message: "Location updated successfully",
                    });
            } else {
                res
                    .status(404)
                    .json({
                        is_error: true,
                        message: "Location not found",
                    });
            }
        } catch (e) {
            next(e);
        }
    }

    async saveLocation(req: Request, res: Response, next: NextFunction) {
        try {
            const {name} = req.body;
            LocationValidator.nameValidator(name)


            const location = await LocationService.save(name);

            res
                .status(201)
                .json({
                    is_error: false,
                    message: "created",
                    location,
                });

        } catch (e) {
            next(e);
        }
    }

    async deleteLocation(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            await LocationService.deleteById(parseInt(id));

            res
                .status(204)
                .json({
                    is_error: false,
                    message: "deleted",
                });
        } catch (e) {
            next(e);
        }
    }

}

export default new LocationController()