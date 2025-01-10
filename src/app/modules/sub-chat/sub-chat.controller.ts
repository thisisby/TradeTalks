import {NextFunction, Request, Response} from "express";
import SubChatService from "./sub-chat.service";
import {CreateSubChat, UpdateSubChat} from "./sub-chat.interface";
import {UserRequest} from "../../../context";
import {Roles} from "../user/user.enum";
import ChatService from "../chat/chat.service";
import LocationValidator from "../location/location.validator";
import LocationService from "../location/location.service";
import SubChatValidator from "./sub-chat.validator";

class SubChatController {
    async createSubChat(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: CreateSubChat = req.body;
            const {user} = req as UserRequest;

            const subChat = await SubChatService.save(user, dto);

            res.status(201).json({
                is_error: false,
                message: "SubChat created successfully",
                subChat,
            });
        } catch (e) {
            next(e);
        }
    }

    async getSubChatById(req: Request, res: Response, next: NextFunction) {
        try {
            const subChatId = +req.params.id;

            const subChat = await SubChatService.findSubChatById(subChatId);

            if (subChat) {
                res.status(200).json({
                    is_error: false,
                    message: "Success",
                    subChat,
                });
            } else {
                res.status(404).json({
                    is_error: true,
                    message: "SubChat not found",
                });
            }
        } catch (e) {
            next(e);
        }
    }

    async deleteSubchat(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const {user} = req as UserRequest;

            const subChat = await SubChatService.findSubChatById(parseInt(id));
            if (subChat) {
                const chat = await ChatService.findById(subChat.chat_id)

                if (chat?.user_id === user.id || user.role === Roles.ADMIN) {
                    await SubChatService.deleteSubChat(parseInt(id));
                }
            }

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

    async updateSubChat(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const dto: UpdateSubChat = req.body;

            const [affectedCount] = await SubChatService.updateById(parseInt(id), dto);

            if (affectedCount > 0) {
                res
                    .status(200)
                    .json({
                        is_error: false,
                        message: "Subchat updated successfully",
                    });
            } else {
                res
                    .status(404)
                    .json({
                        is_error: true,
                        message: "Subchat not found",
                    });
            }
        } catch (e) {
            next(e);
        }
    }
}

export default new SubChatController();
