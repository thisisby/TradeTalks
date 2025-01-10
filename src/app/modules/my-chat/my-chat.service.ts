import {CreateMyChatDto} from "./my-chat.interface";
import {MyChats} from "./my-chat.entity";
import ChatService from "../chat/chat.service";
import {CreateSubChat} from "../sub-chat/sub-chat.interface";
import SubChatService from "../sub-chat/sub-chat.service";
import {User} from "../user/user.entity";
import {Chat} from "../chat/chat.entity";
import {Category} from "../category/category.entity";
import {CategoryEnum} from "../../../constants/category.constant";
import {fn, where} from "sequelize"
class MyChatService {
    async savePersonalChat(sender: User, receiver: User) {
        const defaultChat = {
            user_id: sender.id,
            title: receiver.name ? receiver.name : receiver.phone,
            isPersonal: true,
        }
        const newChat = await ChatService.save(defaultChat)

        if (newChat) {
            const subChatDto: CreateSubChat = {
                title: "Главный",
                chat_id: newChat.id,
            };
            await SubChatService.save(sender, subChatDto);
            const dto: CreateMyChatDto = {
                user_id: receiver.id,
                chat_id: newChat.id,
                receiver_id: sender.id,
                category_id: CategoryEnum.PERSONAL,
                is_notification: true,
            }
            const dto2: CreateMyChatDto = {
                user_id: sender.id,
                chat_id: newChat.id,
                receiver_id: receiver.id,
                category_id: CategoryEnum.PERSONAL,
                is_notification: true,
            }
            await MyChats.create({...dto})
            return await MyChats.create({...dto2})
        }
    }

    async findPersonalChatByUsersId (user_id: number, receiver_id: number) {
        return await MyChats.findOne({where: {user_id, receiver_id}});
    }

    async saveToSavedChat(chat_id: number, user_id: number) {
        const dto:CreateMyChatDto = {
            user_id,
            chat_id,
            category_id: CategoryEnum.SAVED,
        }
        return await MyChats.create({...dto})
    }

    async saveToSubscribeChat(chat_id: number, user_id: number) {
        const dto:CreateMyChatDto = {
            user_id,
            chat_id,
            category_id: CategoryEnum.SUBSCRIBED,
        }
        return await MyChats.create({...dto})
    }

    async findByChatAndUser(chat_id: number, user_id: number, category_id: CategoryEnum) {
        return await MyChats.findOne({
            where: {
                chat_id,
                user_id,
                category_id,
            },
        });
    }

    async findMyChats(user_id: number) {
        return await MyChats.findAll({where: {user_id, category_id: CategoryEnum.PERSONAL}, include:[Chat, Category,  { model: User, as: 'receiver' },]})
    }

    async findWithOptions(options: any): Promise<MyChats[]> {
        return await MyChats.findAll(options)
    }

    async findMySavedChats(user_id: number) {
        return await MyChats.findAll({where: {user_id, category_id: CategoryEnum.SAVED}, include:[Chat, Category]})
    }

    async findUserSavedChats(user_id: number):  Promise<{rows: MyChats[], count: number}> {
        return await MyChats.findAndCountAll({where: {user_id, category_id: CategoryEnum.SAVED}, include:[Chat, Category]})
    }

    async findMySubscribedChats(user_id: number) {
        return await MyChats.findAll({
            where: {user_id, category_id: CategoryEnum.SUBSCRIBED},
            include:[Chat, Category],
            limit: 15,
            order: [['createdAt', 'DESC']]
        })
    }

    async findAmountOfSubscribedChats(user_id: number) {
        return await MyChats.findAndCountAll({
            where: {
                user_id,
                category_id: CategoryEnum.SUBSCRIBED,
            },
            include: [Chat]
        })
    }

    async findAmountOfSavedChats(user_id: number) {
        return await MyChats.findAndCountAll({
            where: {
                user_id,
                category_id: CategoryEnum.SAVED,
            },
            include: [Chat]
        })
    }

    async deleteMyChat(user_id: number, id: number) {
       return await MyChats.destroy({where: {user_id, id}})
    }

    async updateNotification(id: number, user_id: number,is_notification: boolean){
        const [updatedRowsCount, updatedChats] = await MyChats.update({is_notification}, {
            where: {id, user_id},
            returning: true,
        });

        return [updatedRowsCount, updatedChats];
    }

    async findPersonalChatByChatId(chat_id: number, user_id: number) {
        return await MyChats.findOne({
            where: {
                chat_id,
                user_id,
                category_id: CategoryEnum.PERSONAL
            },
            include: [Chat, { model: User, as: 'receiver' }]
        })
    }
}

export default new MyChatService()