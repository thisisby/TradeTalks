import {CreateChatDto, UpdateChatDto} from "./chat.interface";
import {Chat} from "./chat.entity";
import {History} from "../history/history.entity";
import {User} from "../user/user.entity";
import {ChatType} from "../chat-type/chat-type.entity";
import {Location} from "../location/location.entity"
import {SubChat} from "../sub-chat/sub-chat.entity";
import {Redis} from "../../../config/redis";
import {Message} from "../message/message.entity";

class ChatService {
    async save(dto: CreateChatDto): Promise<Chat> {
        return await Chat.create({...dto});
    }

    async update(id: number, dto: UpdateChatDto, user_id: number): Promise<[number, Chat[]]> {
        const [updatedRowsCount, updatedChats] = await Chat.update(dto, {
            where: {id, isPersonal: false},
            returning: true,
        });

        return [updatedRowsCount, updatedChats];
    }

    async updateByAdmin(id: number, dto: UpdateChatDto): Promise<[number, Chat[]]> {
        const [updatedRowsCount, updatedChats] = await Chat.update(dto, {
            where: {id},
            returning: true,
        });

        return [updatedRowsCount, updatedChats];
    }

    async findAll(options: any): Promise<{ rows: Chat[]; count: number }> {
        return await Chat.findAndCountAll(options);
    }

    async findById(id: number): Promise<Chat | null> {
        return await Chat.findByPk(id, {
            include: [User, ChatType, Location, SubChat],
        });
    }

    async find(options: any): Promise<Chat | null> {
        return await Chat.findOne(options)
    }

    async findChatsByUserId(user_id: number): Promise<Chat[]> {
        return await Chat.findAll({
            where: {user_id, isPersonal: false},
            include: [ChatType, Location],
        })
    }

    async saveVisitRecord(key: string, chat_id: number): Promise<void> {
        const maxHistoryLimit = 30;

        const chatExists = await this.findById(chat_id)
        if (chatExists && chatExists.isPersonal === false) {
            const currentLength = await Redis.client.lLen(key);
            if (currentLength >= maxHistoryLimit) {
                await Redis.client.rPop(key);
            }
            await Redis.client.lPush(key, chat_id.toString());
        }
    }

    async getVisitedChatsDetails(userId: number): Promise<Chat[]> {
        const chatIds = await this.getVisitedChats(userId);
        const chats = await this.getChatDetails(chatIds);
        return chats;
    }

    async getVisitedChats(userId: number): Promise<number[]> {
        const key = `user:${userId}:chatHistory`;
        const chatIds = await Redis.client.lRange(key, 0, -1);
        return chatIds.map((id) => parseInt(id, 10));
    }

    async getChatDetails(chatIds: number[]): Promise<Chat[]> {
        const validChatIds = Array.from(new Set(chatIds.filter(id => !isNaN(id))));

        if (validChatIds.length === 0) {
            return [];
        }

        const chats = await Chat.findAll({
            where: {
                id: validChatIds,
            },
            include: [User, ChatType, Location],
        });

        const idIndexMap = new Map(validChatIds.map((id, index) => [id, index]));

        // Sort the chats array based on the order of validChatIds
        chats.sort((chatA, chatB) => {
            const indexA = idIndexMap.get(chatA.id) ?? -1;
            const indexB = idIndexMap.get(chatB.id) ?? -1;
            return indexA - indexB;
        });

        return chats;
    }


    async deleteById(id: number): Promise<void> {
        await History.destroy({where: {chatId: id}})
        await Chat.destroy({where: {id}})
    }


    async getChatsWithUserMessages(user_id: number): Promise<Chat[]> {
        const subChatsWithUserMessages = await SubChat.findAll({
            include: [
                {
                    model: Message,
                    where: {
                        user_id: user_id,
                    },
                    order: [['createdAt', 'DESC']],
                },
            ],
            limit: 15,
        });

        subChatsWithUserMessages.sort((a, b) => {
            const lastMessageA = a.messages[0];
            const lastMessageB = b.messages[0];

            if (!lastMessageA) return 1;
            if (!lastMessageB) return -1;

            return new Date(lastMessageB.createdAt).getTime() - new Date(lastMessageA.createdAt).getTime();
        });


        const chatIds = subChatsWithUserMessages.map((subChat) => subChat.chat_id);
        const uniqueChatIds = [...new Set(chatIds)];

        const chatsWithUserMessages = await Chat.findAll({
            where: {
                id: uniqueChatIds,
                isPersonal: false,
            },
        });

        const sortedChatsWithUserMessages = uniqueChatIds
            .map((chatId) => chatsWithUserMessages.find((chat) => chat.id === chatId)!)
            .filter((chat): chat is Chat => chat !== undefined);

        return sortedChatsWithUserMessages;

    }


}

export default new ChatService();
