import {Message} from "./message.entity";
import {CreateMessageDto} from "./message.interface";
import {Op} from 'sequelize';
import {User} from "../user/user.entity";

class MessageService {
    async findById(id: number): Promise<Message | null> {
        return await Message.findOne({where: {id}, include: [User]});
    }

    async find(options: any): Promise<Message | null> {
        return await Message.findOne(options)
    }

    async findAll(): Promise<Message[]> {
        return await Message.findAll();
    }

    async findSubChatMessages(options: any, user_id: number): Promise<{ rows: Message[], count: number }> {
        const messages = await Message.findAndCountAll(options);

        await this.markMessagesAsRead(messages.rows, user_id);

        return messages;
    }

    async findSubChatUnreadMessages(subChat_id: number, user_id: number): Promise<Message[]> {
        return await Message.findAll({
            where: {
                subChat_id,
                isRead: false,
                user_id: {
                    [Op.not]: user_id
                }
            },
            include: [User],
            order: [['createdAt', 'DESC']]
        });
    }

    async markMessagesAsRead(messages: Message[], user_id: number): Promise<void> {
        for (const message of messages) {
            if (message.user_id !== user_id) {
                message.isRead = true;
                await message.save();
            }
        }
    }

    async findLastMessageInSubChat(subChatId: number): Promise<Message | null> {
        return await Message.findOne({
            where: {subChat_id: subChatId},
            order: [['createdAt', 'DESC']],
            include: [User],
        });
    }


    async save(dto: CreateMessageDto): Promise<Message> {
        return await Message.create({...dto});
    }

    async deleteById(id: number, subChat_id: number): Promise<void> {
        await Message.destroy({where: {id, subChat_id}});
    }

}

export default new MessageService()