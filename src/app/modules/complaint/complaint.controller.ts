import {NextFunction, Request, Response} from "express";
import ComplaintService from "./complaint.service";
import ApiError from "../../../errors/api.exception";
import {CreateComplaintDto} from "./complaint.interface";
import ComplaintValidator from "./complaint.validator";
import {UserRequest} from "../../../context";
import ChatService from "../chat/chat.service";
import UserService from "../user/user.service";
import {ComplaintEnum} from "./complaint.enum";
import MessageService from "../message/message.service";
import ProfileService from "../profile/profile.service";
import CommentService from "../comment/comment.service";

class ComplaintController {
    async getAllComplaints(req: Request, res: Response, next: NextFunction) {
        try {
            const complaints = await ComplaintService.findAll();

            res.json({
                is_error: false,
                message: "success",
                complaints,
            });
        } catch (e) {
            next(e);
        }
    }

    async getComplaintById(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const complaint = await ComplaintService.findById(parseInt(id));

            if (!complaint) {
                throw ApiError.NotFound("complaint not found", "complaint_not_found")
            }
            res.json({
                is_error: false,
                message: "success",
                complaint,
            });
        } catch (e) {
            next(e);
        }
    }

    async createComplaint(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: CreateComplaintDto = req.body;
            const {user} = req as UserRequest;
            dto.user_id = user.id

            ComplaintValidator.validateCreateComplaint(dto);

            const options = {
                where: {
                    id: dto.entity_id,
                    user_id: dto.target_id,
                }
            }

            switch (dto.entity_type) {
                case ComplaintEnum.CHAT:
                    const chatExists = await ChatService.find(options);
                    if (!chatExists) {
                        throw ApiError.NotFound("chat not found", "chat_not_found")
                    }
                    break;
                case ComplaintEnum.MESSAGE:
                    const messageExists = await MessageService.find(options);
                    if (!messageExists) {
                        throw ApiError.NotFound("message not found", "message_not_found")
                    }
                    break;
                case ComplaintEnum.PROFILE:
                    const profileExists = await ProfileService.find(options);
                    if (!profileExists) {
                        throw ApiError.NotFound("profile not found", "profile_not_found")
                    }
                    break;
                case ComplaintEnum.COMMENT:
                    const commentExists = await CommentService.find(options);
                    if (!commentExists) {
                        throw ApiError.NotFound("comment not found", "comment_not_found")
                    }
                    break;
                default:
                    throw ApiError.BadRequest("invalid complaint type", "invalid_complaint_type")
            }

            const complaint = await ComplaintService.save(dto);

            res.json({
                is_error: false,
                message: "created",
                complaint,
            });
        } catch (e) {
            next(e);
        }
    }


    async getUserComplaints(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            const userExists = await UserService.findById(parseInt(id));
            if (!userExists) {
                throw ApiError.NotFound("user not found", "user_not_found")
            }

            const complaints = await ComplaintService.findByUserId(parseInt(id));

            res.json({
                is_error: false,
                message: "success",
                complaints,
            });
        } catch (e) {
            next(e);
        }
    }

    async getChatComplaints(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;

            const chatExists = await ChatService.findById(parseInt(id));
            if (!chatExists) {
                throw ApiError.NotFound("chat not found", "chat_not_found")
            }

            const complaints = await ComplaintService.findByChatId(parseInt(id));

            res.json({
                is_error: false,
                message: "success",
                complaints,
            });
        } catch (e) {
            next(e);
        }
    }

    async deleteComplaint(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            await ComplaintService.deleteById(parseInt(id))
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

export default new ComplaintController()