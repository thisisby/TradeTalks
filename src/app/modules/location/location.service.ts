import {Location} from "./location.entity";
import {User} from "../user/user.entity";

class LocationService {
    async findById(id: number): Promise<Location | null> {
        return await Location.findOne({where: {id}})
    }

    async findAll(): Promise<Location[]> {
        return await Location.findAll({
            order: [["id", "ASC"]],
        });
    }

    async save(name: string): Promise<Location> {
        return await Location.create({name});
    }

    async updateById(id: number, name: string): Promise<[affectedCount: number]> {
        return await Location.update({name}, {where: {id}});
    }

    async deleteById(id: number): Promise<void> {
        await Location.destroy({where: {id}})
    }
}

export default new LocationService();