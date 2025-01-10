import {SubChat} from "./sub-chat.entity";
import {CreateSubChat, UpdateSubChat} from "./sub-chat.interface";
import {Chat} from "../chat/chat.entity";
import ApiError from "../../../errors/api.exception";
import {User} from "../user/user.entity"
import {Roles} from "../user/user.enum";

class SubChatService {

    async save(user: User, dto: CreateSubChat): Promise<SubChat> {
        const chat = await Chat.findByPk(dto.chat_id);
        if ((chat && chat.user_id === user.id) || user.role === Roles.ADMIN) {
            return await SubChat.create({...dto});
        } else {
            throw ApiError.BadRequest("unauthorized to create a sub-chat for this chat", "access_denied")
        }
    }

    async updateById(id: number, dto: UpdateSubChat) {
        return await SubChat.update({...dto}, {
            where: {id},
        });
    }

    async findAllSubChats(): Promise<SubChat[]> {
        return await SubChat.findAll();
    }

    async findSubChatById(subChatId: number): Promise<SubChat | null> {
        return await SubChat.findByPk(subChatId);
    }

    async getSubChatsByChatId(chatId: number): Promise<SubChat[]> {
        return await  SubChat.findAll({
            where: {
                chat_id: chatId,
            },
        });
    }

    async deleteSubChat(subChatId: number): Promise<void> {
       await SubChat.destroy({
            where: {
                id: subChatId,
            },
        });
    }

    async findSubChatsByChatId(id: number): Promise<SubChat[]> {
        return await SubChat.findAll({
            where: {
                chat_id: id,
            },
            order: [["id", "ASC"]],
        });
    }

}

export default new SubChatService();
