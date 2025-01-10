import {Category} from "./category.entity";

class CategoryService {
    async findById(id: number): Promise<Category | null> {
        return await Category.findOne({ where: { id } });
    }

    async findAll(): Promise<Category[]> {
        return await Category.findAll();
    }

    async save(name: string): Promise<Category> {
        return await Category.create({ name });
    }

    async updateById(id: number, name: string): Promise<[number]> {
        return await Category.update({ name }, { where: { id } });
    }

    async deleteById(id: number): Promise<void> {
        await Category.destroy({ where: { id } });
    }
}

export default new CategoryService()