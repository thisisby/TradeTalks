import {NextFunction, Request, Response} from "express";
import ApiError from "../../../errors/api.exception";
import HistoryService from "./history.service";
import ChatService from "../chat/chat.service";
import {UserRequest} from "../../../context";

class HistoryController {
    async recordUserVisit(req: Request, res: Response, next: NextFunction) {
        try {
            const { chatId } = req.body;
            const {user} = req as UserRequest;

            if (!user.id || !chatId) {
                throw ApiError.BadRequest("chatId is required", "chatId_required");
            }

            const chatExists = await ChatService.findById(chatId);
            if (!chatExists) {
                throw ApiError.BadRequest("Chat not found", "chat_not_found");
            }

            const historyExists = await HistoryService.findUserChatVisit(user.id, chatId);
            if (historyExists) {
                await HistoryService.updateUserVisit(user.id, chatId, new Date());
                res.status(201).json({
                    is_error: false,
                    message: "User visit updated successfully",
                });
                return;
            }
            await HistoryService.recordUserVisit(user.id, chatId);

            res.status(201).json({
                is_error: false,
                message: "User visit recorded successfully",
            });
        } catch (e) {
            next(e);
        }
    }

    async getUserVisitHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req as UserRequest;
            const history = await HistoryService.getUserVisitHistory(user.id);

            const visitedChats = [];
            for (const visit of history) {
                const chat = await ChatService.findById(visit.chatId);
                visitedChats.push(chat);
            }

            res.json({
                is_error: false,
                message: "success",
                visitedChats,
            });
        } catch (e) {
            next(e);
        }
    }

    async deleteUserVisit(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req as UserRequest;
            const { chatId } = req.body;
            if (!user.id || !chatId) {
                throw ApiError.BadRequest("chatId is required", "chatId_required");
            }

            await HistoryService.deleteUserVisit(user.id, chatId);

            res.status(200).json({
                is_error: false,
                message: "User visit deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new HistoryController()