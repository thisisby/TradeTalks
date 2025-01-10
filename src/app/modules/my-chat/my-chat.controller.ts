import {NextFunction, Request, Response} from "express";
import {UserRequest} from "../../../context";
import MyChatValidator from "./my-chat.validator";
import UserService from "../user/user.service";
import ApiError from "../../../errors/api.exception";
import ChatService from "../chat/chat.service";
import MyChatService from "./my-chat.service";
import {CreatePersonalChatDto} from "./my-chat.interface";
import ProfileService from "../profile/profile.service";
import {CategoryEnum} from "../../../constants/category.constant";

class MyChatController {
    async createPersonalChat(req: Request, res: Response, next: NextFunction) {
        try {
            const {user_id} = req.body;
            const {user} = req as UserRequest;

            MyChatValidator.CreateMyChatValidator(user_id);

            if(user.id === user_id) {
                throw ApiError.BadRequest("can't send message yourself", "can't_send_message_yourself");
            }

            const userExists = await UserService.findById(user_id)
            if (!userExists) {
                throw ApiError.NotFound("user not found", "user_not_found");
            }

            const MyChatExists = await MyChatService.findPersonalChatByUsersId(user.id, userExists.id)
            if(MyChatExists) {
                throw ApiError.BadRequest("chat already exists", "chat_already_exists")
            }

            const myChat = await MyChatService.savePersonalChat(user, userExists)

            res.json({
                message: "success",
                myChat,
            })
        } catch (e) {
            next(e);
        }
    }

    async createSavedChat(req: Request, res: Response, next: NextFunction) {
        try {
            const {chat_id} = req.body;
            const {user} = req as UserRequest;

            MyChatValidator.SaveChat(chat_id);

            const chatExists = await ChatService.findById(chat_id)
            if (!chatExists) {
                throw ApiError.NotFound("chat not found", "chat_not_found");
            }

            const existingMyChat = await MyChatService.findByChatAndUser(chat_id, user.id, CategoryEnum.SAVED);
            if (existingMyChat) {
                throw ApiError.BadRequest("chat already saved", "chat_already_saved");
            }

            const myChat = await MyChatService.saveToSavedChat(chat_id, user.id)
            res.json({
                message: "success",
                myChat
            })
        } catch (e) {
            next(e);
        }
    }

    async createSubscribeChat(req: Request, res: Response, next: NextFunction) {
        try {
            const {chat_id} = req.body;
            const {user} = req as UserRequest;

            MyChatValidator.SaveChat(chat_id);

            const chatExists = await ChatService.findById(chat_id)
            if (!chatExists) {
                throw ApiError.NotFound("chat not found", "chat_not_found");
            }

            const existingMyChat = await MyChatService.findByChatAndUser(chat_id, user.id, CategoryEnum.SUBSCRIBED);
            if (existingMyChat) {
                throw ApiError.BadRequest("chat already subscribed", "chat_already_subscribed");
            }

            const myChat = await MyChatService.saveToSubscribeChat(chat_id, user.id)
            res.json({
                message: "success",
                myChat
            })
        } catch (e) {
            next(e);
        }
    }

    async getPersonalChats(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req as UserRequest;

            const myChats = await MyChatService.findMyChats(user.id)
            res.json({
                message: "success",
                myChats
            })
        } catch (e) {
            next(e);
        }
    }

    async getPersonalChatByChatId(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const {user} = req as UserRequest;

            const myChat = await MyChatService.findPersonalChatByChatId(parseInt(id), user.id)
            if(!myChat) {
                throw ApiError.NotFound("chat not found", "chat_not_found");
            }
            res.json({
                message: "success",
                myChat
            })
        } catch (e) {
            next(e);
        }
    }

    async getSavedChats(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req as UserRequest;

            const myChats = await MyChatService.findMySavedChats(user.id)
            res.json({
                message: "success",
                myChats
            })
        } catch (e) {
            next(e);
        }
    }

    async getUserSavedChats(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params
            const {user} = req as UserRequest;

            const {rows, count} = await MyChatService.findUserSavedChats(parseInt(id))
            res.json({
                message: "success",
                chats: rows,
                count,
            })
        } catch (e) {
            next(e);
        }
    }

    async deleteMyChats(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const {user} = req as UserRequest;

            const myChats = await MyChatService.deleteMyChat(user.id, parseInt(id))
            res.json({
                message: "success",
                myChats
            })
        } catch (e) {
            next(e);
        }
    }

    async getSubscribedChats(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req as UserRequest;

            const myChats = await MyChatService.findMySubscribedChats(user.id)
            res.json({
                message: "success",
                myChats
            })
        } catch (e) {
            next(e);
        }
    }

    async updateNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { user } = req as UserRequest;
            const {is_notification} = req.body;

            const [affectedCount] =  await MyChatService.updateNotification(parseInt(id), user.id, is_notification);
            if (affectedCount > 0) {
                res
                    .status(200)
                    .json({
                        is_error: false,
                        message: "MyChat updated successfully",
                    });
            } else {
                res
                    .status(404)
                    .json({
                        is_error: true,
                        message: "MyChat not found",
                    });
            }
        } catch (e) {
            next(e);
        }
    }
}

export default new MyChatController()