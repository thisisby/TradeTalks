import {Comment} from "./comment.entity";
import {SaveCommentDto} from "./comment.interface";
import {ForeignKeyConstraintError, UniqueConstraintError} from "sequelize";
import ApiError from "../../../errors/api.exception";
import {User} from "../user/user.entity";

class CommentService {
    async findByProfileId(profile_id: number): Promise<{ rows: Comment[]; count: number }> {
        return await Comment.findAndCountAll({
            where: {profile_id},
            include: [User],
            attributes: {
                exclude: ['user_id'],
            },
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id: number){
        return await Comment.findOne({where: {id}});
    }

    async find(options: any){
        return await Comment.findOne(options);
    }

    async save(dto: SaveCommentDto): Promise<Comment> {
        try {
            return await Comment.create({...dto});
        } catch (e) {
            if (e instanceof ForeignKeyConstraintError) {
                throw ApiError.NotFound("Profile not found", "profile_not_found");
            }
            throw e;
        }
    }

    async updateById(id: number, user_id: number, text: string): Promise<[affectedCount: number]> {
        return await Comment.update({text}, {where: {id, user_id}});
    }

    async deleteById(id: number): Promise<void> {
        await Comment.destroy({where: {id}});
    }
}

export default new CommentService();
