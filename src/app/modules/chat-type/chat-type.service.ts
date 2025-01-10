import {ChatType} from "./chat-type.entity";

class ChatTypeService {
    async findById(id: number): Promise<ChatType | null> {
        return await ChatType.findOne({ where: { id } });
    }

    async findAll(): Promise<ChatType[]> {
        return await ChatType.findAll({
            order: [["id", "ASC"]],
        });
    }

    async save(title: string, isEditable: boolean, isAvailable: boolean): Promise<ChatType> {
        return await ChatType.create({ title, isEditable, isAvailable });
    }

    async updateById(id: number, dto: any): Promise<[number]> {
        return await ChatType.update({ ...dto }, { where: { id } });
    }

    async deleteById(id: number): Promise<void> {
        await ChatType.destroy({ where: { id } });
    }
}

export default new ChatTypeService()