import {History} from "./history.entity";
import {ids} from "googleapis/build/src/apis/ids";

class HistoryService{
    async recordUserVisit(userId: number, chatId: number): Promise<void> {
        await History.create({ userId, chatId });
    }

    async getUserVisitHistory(userId: number): Promise<History[]> {
        return await History.findAll({ where: { userId }, order: [["updatedAt", "DESC"]] });
    }

    async deleteUserVisit(userId: number, chatId: number): Promise<void> {
        await History.destroy({ where: { userId, chatId } });
    }

    async updateUserVisit(userId: number, chatId: number, newTimestamp: Date): Promise<void> {
        await History.update({chatId}, {where: { userId, chatId }});
    }

    async findUserChatVisit(userId: number, chatId: number): Promise<History | null> {
        return await History.findOne({ where: { userId, chatId } });
    }
}

export default new HistoryService()