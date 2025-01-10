import {NextFunction, Request, Response} from "express";
import ChatTypeService from "./chat-type.service";
import chatTypeValidator from "./chat-type.validator";

class ChatTypeController {
    async getAllChatTypes(req: Request, res: Response, next: NextFunction) {
        try {
            const chatTypes = await ChatTypeService.findAll();

            res.json({
                is_error: false,
                message: "success",
                chatTypes,
            });
        } catch (e) {
            next(e);
        }
    }

    async getChatTypeById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const chatType = await ChatTypeService.findById(parseInt(id));

            res.json({
                is_error: false,
                message: "success",
                chatType,
            });
        } catch (e) {
            next(e);
        }
    }

    async updateChatType(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const {title, isEditable, isAvailable} = req.body;

            const dto = {
                title,
                isEditable,
                isAvailable,
            }

            const [affectedCount] = await ChatTypeService.updateById(parseInt(id), dto);

            if (affectedCount > 0) {
                res.status(200).json({
                    is_error: false,
                    message: "Chat type updated successfully",
                });
            } else {
                res.status(404).json({
                    is_error: true,
                    message: "Chat type not found",
                });
            }
        } catch (e) {
            next(e);
        }
    }

    async saveChatType(req: Request, res: Response, next: NextFunction) {
        try {
            const {title, isEditable, isAvailable} = req.body;

            chatTypeValidator.titleValidator(title)

            const chatType = await ChatTypeService.save(title, isEditable, isAvailable);

            res.status(201).json({
                is_error: false,
                message: "created",
                chatType,
            });
        } catch (e) {
            next(e);
        }
    }

    async deleteChatType(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            await ChatTypeService.deleteById(parseInt(id));

            res.status(204).json({
                is_error: false,
                message: "deleted",
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new ChatTypeController();