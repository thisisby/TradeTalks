import {NextFunction, Request, Response} from "express";
import UserService from "./user.service";
import {SaveUserDto, UpdateUserDto} from "./user.interface";
import LocationService from "../location/location.service";
import ApiError from "../../../errors/api.exception";
import {UserRequest} from "../../../context";
import userValidator from "./user.validator";
import * as util from "util";
import * as fs from "fs";
import awsService from "../../../services/aws.service";
import ComplaintService from "../complaint/complaint.service";

const unlinkFile = util.promisify(fs.unlink);

class UserController {
   async getBanInfo(req: Request, res: Response, next: NextFunction) {
       try {
           const { user } = req as UserRequest;
           const {rows, count} = await ComplaintService.getComplaintsByTargetId(user.id)

           res.json({
               is_error: false,
               message: "success",
               complaints: rows,
               count,
           });
       } catch (e) {
           next(e);
       }
   }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const user = await UserService.findById(parseInt(id))

            if(!user) {
                throw ApiError.NotFound("user not found", "user_note_found")
            }

            res.json({
                is_error: false,
                message: "success",
                user,
            });
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const { user } = req as UserRequest;
            const {name, phone, device_token, location_id} = req.body;

            userValidator.userValidate(user);

            let avatarUrl = "";
            if (file) {
                userValidator.avatarValidate(file.mimetype, file.size);
                const result = await awsService.uploadImage(file);
                avatarUrl = result.Location;
                await unlinkFile(file.path);
            }


            if (phone) {
                const isPhoneExist = await UserService.findByPhone(phone);
                if (isPhoneExist) {
                    throw ApiError.BadRequest("phone already exists", "phone_already_exists")
                }
            }

            if (location_id) {
                const isLocationExist = await LocationService.findById(location_id);
                if (!isLocationExist) {
                    throw ApiError.NotFound("location not found", "location_not_found")
                }
            }

            const updateDto: UpdateUserDto = {
                name,
                phone,
                device_token,
                location_id,
            }
            if (avatarUrl !== "") {
                updateDto.avatar = avatarUrl;
            }

            const [affectedCount] = await UserService.updateById(user.id, updateDto, null);

            if (affectedCount > 0) {
                res
                    .status(200)
                    .json({
                        is_error: false,
                        message: "User updated successfully",
                    });
            } else {
                res
                    .status(404)
                    .json({
                        is_error: true,
                        message: "User not found",
                    });
            }
        } catch (e) {
            next(e);
        }
    }

    async deleteMe(req: Request, res: Response, next: NextFunction) {
        try {
            const { user } = req as UserRequest;

            await UserService.deleteById(user.id)
            res.status(204)
                .json({
                    is_error: false,
                    message: "deleted",
                });
        } catch (e) {
            next(e);
        }
    }

}

export default new UserController();