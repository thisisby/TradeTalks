import {NextFunction, Request, Response} from "express";
import ImageUploadService from "../../../services/image-upload.service";
import ApiError from "../../../errors/api.exception";
import {CreateChatDto, UpdateChatDto} from "./chat.interface";
import ChatValidator from "./chat.validator";
import ChatService from "./chat.service";
import {literal, Op} from "sequelize";
import {User} from "../user/user.entity";
import {ChatType} from "../chat-type/chat-type.entity";
import ChatTypeService from "../chat-type/chat-type.service";
import {Location} from "../location/location.entity"
import {UserRequest} from "../../../context";
import SubChatService from "../sub-chat/sub-chat.service";
import {CreateSubChat} from "../sub-chat/sub-chat.interface";
import {Roles} from "../user/user.enum";


class ChatController {
    async createChat(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const {type_id, user_id, title, photo}: CreateChatDto = req.body;
            const {user} = req as UserRequest;

            const trimTitle = title.trim()
            const dto = {
                type_id,
                user_id,
                title: trimTitle,
                photo,
                location_id: user.location_id,
                isLocationPinned: false,
            }
            ChatValidator.createChatValidate(dto);

            let photoUrl = "";
            if (file) {
                photoUrl = await ImageUploadService.uploadSinglePhoto(file);
                dto.photo = photoUrl
            }

            if (type_id) {
                const typeExists = await ChatTypeService.findById(type_id);
                if (!typeExists) {
                    throw ApiError.NotFound("chat type not found", "chat_type_not_found")
                }
                if (!typeExists.isEditable && user.role !== Roles.ADMIN) {
                    throw ApiError.BadRequest("chat type is not editable", "chat_type_not_editable")
                }
            }

            if (type_id === 3) {
                dto.isLocationPinned = true;
                dto.location_id = 1;
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

    async getAllChats(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                page = 1,
                limit = 10,
                type_id,
                location_id,
                title
            } = req.query;
            const {user} = req as UserRequest;


            const filter: any = {};
            let titleReplacements: any = {};
            let order: any = [
                [literal(`CASE 
                WHEN "Chat"."isLocationPinned" = false AND "Chat"."location_id" = ${user.location_id} THEN 1
                WHEN "Chat"."isLocationPinned" = false THEN 2
                WHEN "Chat"."location_id" = ${user.location_id} THEN 3
                ELSE 4 
                END`)],
                [literal(`MD5(CAST("Chat"."id" AS TEXT) || ROUND(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) / (60 * 10)))`)],
            ];

            if (type_id) {
                filter.type_id = type_id;
                filter[Op.and] = [
                    {
                        [Op.or]: [
                            {isLocationPinned: false},
                            {
                                [Op.and]: [
                                    {isLocationPinned: true},
                                    {location_id: 99999}
                                ]
                            },
                            {
                                [Op.and]: [
                                    {isLocationPinned: true},
                                    {location_id: user.location_id}
                                ]
                            }
                        ]
                    }
                ];
            } else {
                filter[Op.or] = [
                    {type_id: {[Op.eq]: null}},
                    {type_id: {[Op.eq]: 99999}},
                ];
            }

            if (title) {
                const titleWords = title.toString().split(' ');
                filter.title = {
                    [Op.and]: titleWords.map(word => ({
                        [Op.iLike]: `%${word}%`,
                    })),
                };
                titleReplacements = {
                    title: title,
                    titleWithSpace: `${title} %`,
                    titleStartsWith: `${title}%`,
                    titleContains: `%${title}%`,
                };

                filter[Op.and] = [
                    {
                        [Op.or]: [
                            {isLocationPinned: false},
                            {
                                [Op.and]: [
                                    {isLocationPinned: true},
                                    {location_id: 99999}
                                ]
                            },
                            {
                                [Op.and]: [
                                    {isLocationPinned: true},
                                    {location_id: user.location_id}
                                ]
                            }
                        ]
                    }
                ];

                order = [
                    ["isLocationPinned", "ASC"],
                    [literal(`CASE 
                        WHEN "Chat"."location_id" = ${user.location_id} THEN 1 
                        WHEN "Chat"."location_id" = 99999 THEN 2
                        ELSE 3 
                    END`)],
                    literal(`
                      CASE
        WHEN UPPER(TRIM(REPLACE("Chat"."title", E'\n', ' '))) = UPPER(:title) THEN 1
        WHEN UPPER(TRIM(REPLACE("Chat"."title", E'\n', ' '))) LIKE UPPER(:titleWithSpace) THEN 2
        WHEN UPPER(TRIM(REPLACE("Chat"."title", E'\n', ' '))) LIKE UPPER(:titleStartsWith) THEN 3
        WHEN UPPER(TRIM(REPLACE("Chat"."title", E'\n', ' '))) LIKE UPPER(:titleContains) THEN 4
        ELSE 5
      END
                    `)
                ];
            }

            if (location_id) {
                filter.location_id = location_id;
            }

            filter.isPersonal = false;

            const options = {
                offset: ((+page) - 1) * (+limit),
                limit: +limit,
                subQuery: false,
                where: filter,
                include: [User, ChatType, Location],
                order: order,
                replacements: titleReplacements
            };


            const {count, rows} = await ChatService.findAll(options);

            res.status(200).json({
                is_error: false,
                message: "success",
                chats: rows,
                totalChats: count,
            });
        } catch (e) {
            next(e);
        }
    }

    async getMyChats(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req as UserRequest;

            const chats = await ChatService.findChatsByUserId(user.id);

            res.status(200).json({
                is_error: false,
                message: "success",
                chats: chats
            });
        } catch (e) {
            next(e);
        }
    }


    async getChatById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            const chat = await ChatService.findById(parseInt(id));

            if (!chat) {
                throw ApiError.NotFound("Chat not found", "chat_not_found");
            }

            res.status(200).json({
                is_error: false,
                message: "success",
                chat,
            });
        } catch (e) {
            next(e);
        }
    }

    async getSubChatsByChatId(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            const subChats = await SubChatService.findSubChatsByChatId(parseInt(id))

            res.status(200).json({
                is_error: false,
                message: "success",
                subChats,
            });
        } catch (e) {
            next(e);
        }
    }

    async recordVisit(req: Request, res: Response, next: NextFunction) {
        try {

            const {chat_id} = req.body;
            const {user} = req as UserRequest;

            const key = `user:${user.id}:chatHistory`;

            await ChatService.saveVisitRecord(key, chat_id);

            res.status(200).json({
                is_error: false,
                message: "success",
            });
        } catch (e) {
            next(e);
        }
    }

    async getVisitedChats(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req as UserRequest;
            const chats = await ChatService.getVisitedChatsDetails(user.id)

            res.status(200).json({
                is_error: false,
                message: "success",
                chats,
            });
        } catch (e) {
            next(e);
        }
    }

    async getChatsWithUserMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req as UserRequest;
            const chats = await ChatService.getChatsWithUserMessages(user.id)

            res.status(200).json({
                is_error: false,
                message: "success",
                chats,
            });
        } catch (e) {
            next(e);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const file = req.file;
            const {isLocationPinned, location_id, type_id} = req.body;
            const {user} = req as UserRequest;

            let dto: UpdateChatDto = {};
            if (user.role === Roles.ADMIN) {
                dto = {
                    isLocationPinned: isLocationPinned,
                    location_id: location_id,
                    type_id: type_id
                };
            }

            const chatExists = await ChatService.findById(parseInt(id));
            if (!chatExists) {
                throw ApiError.NotFound("chat not found", "chat_not_found")
            }

            const chatType = await ChatTypeService.findById(chatExists.type_id);
            if (!chatType || !chatType.isEditable) {
                throw ApiError.NotFound("chat-type not found or not editable", "chat-type_not_found_or_not_editable")
            }


            let photoUrl = '';

            if (file) {
                photoUrl = await ImageUploadService.uploadSinglePhoto(file);
                dto.photo = photoUrl;
            }

            const [row, chats] = await ChatService.update(parseInt(id), dto, user.id);

            res.status(201).json({
                is_error: false,
                message: 'Updated successfully',
                row,
                chats,
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new ChatController()