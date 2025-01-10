import {NextFunction, Request, Response} from "express";
import CommentService from "./comment.service";
import {SaveCommentDto} from "./comment.interface";
import {UserRequest} from "../../../context";
import commentValidator from "./comment.validator";
import ApiError from "../../../errors/api.exception";
import ProfileService from "../profile/profile.service";
import {Roles} from "../user/user.enum";

class CommentController {
    async getCommentsByProfileId(req: Request, res: Response, next: NextFunction) {
        try {
            const {profileId} = req.params;
            const {rows, count} = await CommentService.findByProfileId(parseInt(profileId));

            res.json({
                is_error: false,
                message: "success",
                comments: rows,
                count
            });
        } catch (e) {
            next(e);
        }
    }

    async createComment(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req as UserRequest;
            const {profileId} = req.params;
            const {text} = req.body;

            commentValidator.validateComment(text);

            const dto: SaveCommentDto = {
                text,
                profile_id: parseInt(profileId),
                user_id: user.id,
            };

            const comment = await CommentService.save(dto);

            res.status(201).json({
                is_error: false,
                message: "Comment created successfully",
                comment,
            });
        } catch (e) {
            next(e);
        }
    }

    async updateComment(req: Request, res: Response, next: NextFunction) {
        try {
            const {profileId, commentId} = req.params;
            const {user} = req as UserRequest;
            const {text} = req.body;

            commentValidator.validateComment(text);

            const [affectedCount] = await CommentService.updateById(parseInt(commentId), user.id, text);

            if (affectedCount > 0) {
                res.status(200).json({
                    is_error: false,
                    message: "Comment updated successfully",
                });
            } else {
                throw ApiError.NotFound("Comment not found", "comment_not_found");
            }
        } catch (e) {
            next(e);
        }
    }

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            const {profileId, commentId} = req.params;
            const {user} = req as UserRequest;

            const comment = await CommentService.findById(parseInt(commentId))

            if(comment?.user_id === user.id || user.role === Roles.ADMIN) {
                await CommentService.deleteById(parseInt(commentId));
            }

            res.status(200).json({
                is_error: false,
                message: "Comment deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new CommentController();
