import {NextFunction, Request, Response} from "express";
import UserService from "../user/user.service";
import UserValidator from "../user/user.validator";
import userValidator from "../user/user.validator";
import ApiError from "../../../errors/api.exception";
import LocationService from "../location/location.service";
import {Location} from "../location/location.entity"
import {SaveUserDto, UpdateUserDto} from "../user/user.interface";
import awsService from "../../../services/aws.service";
import util from "util";
import fs from "fs";
import AdminService from "./admin.service";
import {ACreateChatDto, UpdateChatDto} from "../chat/chat.interface";
import {UserRequest} from "../../../context";
import ChatValidator from "../chat/chat.validator";
import ImageUploadService from "../../../services/image-upload.service";
import ChatTypeService from "../chat-type/chat-type.service";
import ChatService from "../chat/chat.service";
import {CreateSubChat} from "../sub-chat/sub-chat.interface";
import SubChatService from "../sub-chat/sub-chat.service";
import {literal, Op} from "sequelize";
import MyChatService from "../my-chat/my-chat.service";
import {User} from "../user/user.entity";
import {ChatType} from "../chat-type/chat-type.entity";


const unlinkFile = util.promisify(fs.unlink);


class AdminController {

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const {location_id} = req.query
            const fromDate = req.query.fromDate as string | undefined;
            const toDate = req.query.toDate as string | undefined;

            const filter: any = {};
            if (fromDate) {
                filter.createdAt = {[Op.gte]: new Date(fromDate)};
            }
            if (toDate) {
                filter.createdAt = {...filter.createdAt, [Op.lte]: new Date(toDate)};
            }
            if (location_id) {
                filter.location_id = location_id
            }

            const options = {
                where: filter,
                include: [Location]
            }

            const {rows, count} = await UserService.findAll(options)

            res.json({
                is_error: false,
                message: "success",
                data: rows,
                count,
            });
        } catch (e) {
            next(e);
        }
    }

    async getUsersOnlineTime(req: Request, res: Response, next: NextFunction) {
        try {
            const fromDate = req.query.fromDate as string | undefined;
            const toDate = req.query.toDate as string | undefined;

            const options = {
                where: {
                    signInTime: {
                        [Op.between]: [fromDate, toDate],
                    },
                },
            }

            const {rows, count} = await UserService.findBySignTime(options)

            res.json({
                is_error: false,
                message: "success",
                data: rows,
                count,
            });
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const {id} = req.params;
            const {name, phone, device_token, location_id, role, blockHours, blockReason} = req.body;

            let avatarUrl = "";
            if (file) {
                userValidator.avatarValidate(file.mimetype, file.size);
                const result = await awsService.uploadImage(file);
                avatarUrl = result.Location;
                await unlinkFile(file.path);
            }

            if (role) {
                UserValidator.roleValidator(role);
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
                role,
                blockReason,
            }
            if (avatarUrl !== "") {
                updateDto.avatar = avatarUrl;
            }

            const [affectedCount] = await UserService.updateById(parseInt(id, 10), updateDto, blockHours);

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

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const userId = parseInt(id, 10);
            await UserService.deleteById(userId);

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

    async saveUser(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const dto: SaveUserDto = req.body;
            UserValidator.saveUserValidate(dto);

            let avatarUrl = "";
            if (file) {
                userValidator.avatarValidate(file.mimetype, file.size);
                const result = await awsService.uploadImage(file);
                avatarUrl = result.Location;
                await unlinkFile(file.path);
            }

            const locationExists = await LocationService.findById(dto.location_id)
            if (!locationExists) {
                throw ApiError.NotFound("location not found", "location_not_found")
            }
            const userExists = await UserService.findByPhone(dto.phone)
            if (userExists) {
                throw ApiError.BadRequest("phone already exists", "phone_already_exists")
            }

            dto.avatar = avatarUrl

            const user = await UserService.save(dto);

            res
                .status(201)
                .json({
                    is_error: false,
                    message: "created",
                    user,
                });

        } catch (e) {
            next(e);
        }
    }

    async createChat(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const dto: ACreateChatDto = req.body;
            const {user} = req as UserRequest;

            ChatValidator.createAChatValidate(dto);

            let photoUrl = "";
            if (file) {
                photoUrl = await ImageUploadService.uploadSinglePhoto(file);
                dto.photo = photoUrl
            }

            const typeExists = await ChatTypeService.findById(dto.type_id);
            if (!typeExists) {
                throw ApiError.NotFound("chat type not found", "chat_type_not_found")
            }
            if (dto.location_id) {
                const locationExists = await LocationService.findById(dto.location_id)
                if (!locationExists) {
                    throw ApiError.NotFound("location not found", "location_not_found")
                }
            }
            dto.user_id = user.id

            const chat = await ChatService.save(dto);
            if (chat) {
                const subChatDto: CreateSubChat = {
                    title: "Главный",
                    chat_id: chat.id,
                };
                await SubChatService.save(user, subChatDto);
            }

            res
                .status(201)
                .json({
                    is_error: false,
                    message: "created",
                    chat,
                });
        } catch (e) {
            next(e);
        }
    }

    async updateChat(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const {id} = req.params;
            const dto: UpdateChatDto = req.body;
            const {user} = req as UserRequest;

            let photoUrl = "";
            if (file) {
                photoUrl = await ImageUploadService.uploadSinglePhoto(file);
                dto.photo = photoUrl
            }

            if (dto.type_id) {
                const typeExists = await ChatTypeService.findById(dto.type_id);
                if (!typeExists) {
                    throw ApiError.NotFound("chat type not found", "chat_type_not_found")
                }
            }

            if (dto.location_id) {
                const locationExists = await LocationService.findById(dto.location_id)
                if (!locationExists) {
                    throw ApiError.NotFound("location not found", "location_not_found")
                }
            }

            if (photoUrl !== "") {
                dto.photo = photoUrl;
            }

            const [affectedCount] = await ChatService.updateByAdmin(parseInt(id), dto);
            if (affectedCount > 0) {
                res
                    .status(200)
                    .json({
                        is_error: false,
                        message: "Chat updated successfully",
                    });
            } else {
                res
                    .status(404)
                    .json({
                        is_error: true,
                        message: "Chat not found",
                    });
            }
        } catch (e) {
            next(e);
        }
    }

    async getAllChats(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                type_id,
                page = 1,
                limit = 10,
                location_id,
                title
            } = req.query
            const fromDate = req.query.fromDate as string | undefined;
            const toDate = req.query.toDate as string | undefined;

            const filter: any = {
                isPersonal: false,
            };
            let order:any  = [['createdAt', 'DESC']];

            if (fromDate) {
                filter.createdAt = {[Op.gte]: new Date(fromDate)};
            }
            if (toDate) {
                filter.createdAt = {...filter.createdAt, [Op.lte]: new Date(toDate)};
            }
            if (type_id) {
                filter.type_id = type_id;
            }

            if (location_id) {
                filter.location_id = location_id;
            }


            if (title) {
                filter.title = {
                    [Op.iLike]: `%${title}%`, // Case-insensitive search
                };
                order = [
                    [literal(`CASE WHEN "Chat"."title" = '${title}' THEN 1
                             WHEN "Chat"."title" LIKE '${title} %' THEN 2
                             WHEN "Chat"."title" LIKE '% ${title}' THEN 3
                             WHEN "Chat"."title" LIKE '% ${title} %' THEN 4
                             ELSE 5
                        END`)]
                ];
            }

            console.log("Offset: ", (+page-1) * (+limit))
            console.log("Limit: ", +limit)
            const options = {
                offset: (+page-1) * (+limit),
                limit: +limit,
                subQuery: false,
                where: filter,
                include: [User, ChatType, Location],
                order: order
            };


            const {rows, count} = await ChatService.findAll(options)

            res.json({
                is_error: false,
                message: "success",
                data: rows,
                count,
            });
        } catch (e) {
            next(e);
        }
    }

    async deleteChat(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            await ChatService.deleteById(parseInt(id));

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

    async findAmountOfSubscribedChats(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const {rows, count} = await MyChatService.findAmountOfSubscribedChats(parseInt(id))
            res
                .json({
                    is_error: false,
                    chats: rows,
                    count,
                });
        } catch (e) {
            next(e);
        }
    }

    async findAmountOfSavedChats(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const {rows, count} = await MyChatService.findAmountOfSavedChats(parseInt(id))
            res
                .json({
                    is_error: false,
                    chats: rows,
                    count,
                });
        } catch (e) {
            next(e);
        }
    }
}

export default new AdminController()