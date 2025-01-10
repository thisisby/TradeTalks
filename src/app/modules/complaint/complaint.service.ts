import {Complaint} from "./complaint.entity";
import {CreateComplaintDto} from "./complaint.interface";
import {Chat} from "../chat/chat.entity";
import {User} from "../user/user.entity";
import {ComplaintEnum} from "./complaint.enum";
import {Profile} from "../profile/profile.entity";
import {Message} from "../message/message.entity";
import {Comment} from "../comment/comment.entity";

class ComplaintService {
    async findById(id: number): Promise<Complaint | null> {
        return await Complaint.findOne({where: {id}})
    }

    async findAll(): Promise<Complaint[]> {
        return await Complaint.findAll({
            include: [{model: User, as: "target"}, Chat, Comment, Profile, Message]
        });
    }

    async save(dto: CreateComplaintDto): Promise<Complaint> {
        const objToSave: any = {
            text: dto.text,
            user_id: dto.user_id,
            entity_type: dto.entity_type,
            target_id: dto.target_id
        };
        switch (dto.entity_type) {
            case ComplaintEnum.CHAT:
                objToSave.chat_id = dto.entity_id;
                break;
            case ComplaintEnum.MESSAGE:
                objToSave.message_id = dto.entity_id;
                break;
            case ComplaintEnum.PROFILE:
                objToSave.profile_id = dto.entity_id;
                break;
            case ComplaintEnum.COMMENT:
                objToSave.comment_id = dto.entity_id;
                break;
        }
        return await Complaint.create({...objToSave});
    }

    async deleteById(id: number): Promise<void> {
        await Complaint.destroy({where: {id}})
    }

    async findByChatId(chat_id:number): Promise<Complaint[]> {
       return await Complaint.findAll({
           where: {chat_id},
           include: [{model: User, as: "user"}, Chat, Comment, Profile, Message]
       })
    }

    async findByUserId(user_id: number): Promise<Complaint[]> {
        return await Complaint.findAll({
            where: {user_id},
            include: [{model: User, as: "user"}, Chat, Comment, Profile, Message]
        })
    }

    async getComplaintsByTargetId(target_id: number): Promise<{ rows: Complaint[]; count: number }> {
        return await Complaint.findAndCountAll({
            where: {target_id},
            include: [{model: User, as: "user"}, Chat, Comment, Profile, Message]
        })
    }
}

export default new ComplaintService()