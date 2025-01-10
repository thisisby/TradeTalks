import {NextFunction, Request, Response} from "express";
import MessageValidator from "./message.validator";
import MessageService from "./message.service";
import {UserRequest} from "../../../context";
import {CreateMessageDto} from "./message.interface";
import ImageUploadService from "../../../services/image-upload.service";
import SubChatService from "../sub-chat/sub-chat.service";
import ApiError from "../../../errors/api.exception";
import {User} from "../user/user.entity";
import {Op} from "sequelize";
import {Roles} from "../user/user.enum";
import LocationService from "../location/location.service";

class MessageController {
    async saveMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const dto: CreateMessageDto = req.body
            const {subChat_id} = req.params
            const {user} = req as UserRequest;

            MessageValidator.createMessageValidate(dto);

            let photoUrl = "";
            if (file) {
                photoUrl = await ImageUploadService.uploadSinglePhoto(file);
                dto.photo = photoUrl
            }
            const subChatExists = await SubChatService.findSubChatById(parseInt(subChat_id))
            if (!subChatExists) {
                throw ApiError.NotFound("subChat not found", "subChat_not_found")
            }
            if (subChatExists.isPinned && user.role !== Roles.ADMIN) {
                throw ApiError.BadRequest("subChat is pinned", "subChat_is_pinned")
            }
            dto.subChat_id = parseInt(subChat_id)
            dto.user_id = user.id;

            const data = await MessageService.save(dto);

            res.status(201).json({
                is_error: false,
                message: "created",
                data,
            });
        } catch (e) {
            next(e);
        }
    }

    async getSubChatMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const {subChat_id, location_id} = req.params
            const {user} = req as UserRequest;
            const {
                page = 1,
                limit = 10,
                latestTimestamp,
            } = req.query;
            const options = {
                offset: ((+page) - 1) * (+limit),
                limit: +limit,
                where: {
                    subChat_id,
                    location_id,
                    createdAt: {
                        [Op.lte]: latestTimestamp || new Date(),
                    },
                },
                include: [User],
                order: [['createdAt', 'DESC']]
            };

            const subChatExists = await SubChatService.findSubChatById(parseInt(subChat_id))
            if (!subChatExists) {
                throw ApiError.NotFound("subChat not found", "subChat_not_found")
            }
            const messages = await MessageService.findSubChatMessages(options, user.id);

            res.json({
                is_error: false,
                message: "success",
                messages,
            });
        } catch (e) {
            next(e);
        }
    }

    async getPersonalSubChatMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const {subChat_id} = req.params
            const {user} = req as UserRequest;
            const {
                page = 1,
                limit = 10,
                latestTimestamp,
            } = req.query;
            const options = {
                offset: ((+page) - 1) * (+limit),
                limit: +limit,
                where: {
                    subChat_id,
                    createdAt: {
                        [Op.lte]: latestTimestamp || new Date(),
                    },
                },
                include: [User],
                order: [['createdAt', 'DESC']]
            };

            const subChatExists = await SubChatService.findSubChatById(parseInt(subChat_id))
            if (!subChatExists) {
                throw ApiError.NotFound("subChat not found", "subChat_not_found")
            }
            const messages = await MessageService.findSubChatMessages(options, user.id);

            res.json({
                is_error: false,
                message: "success",
                messages,
            });
        } catch (e) {
            next(e);
        }
    }

    async deleteMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const {subChat_id, id} = req.params;
            const {user} = req as UserRequest;

            const message = await MessageService.findById(parseInt(id))
            if(message?.user_id === user.id || user.role === Roles.ADMIN) {
                await MessageService.deleteById(parseInt(id), parseInt(subChat_id));
            }

            res.status(204).json({
                is_error: false,
                message: "deleted",
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new MessageController()