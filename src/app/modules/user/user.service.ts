import {User} from "./user.entity";
import {SaveUserDto, UpdateUserDto} from "./user.interface";
import {Location} from "../location/location.entity";
import {ComplaintEnum} from "../complaint/complaint.enum";
import {Message} from "../message/message.entity";
import {Comment} from "../comment/comment.entity";
import {Profile} from "../profile/profile.entity";
import {Complaint} from "../complaint/complaint.entity";


class UserService {
    async findByPhone(phone: string): Promise<User | null> {
        return await User.findOne({where: {phone}});
    }

    async create(device_token: string, phone: string): Promise<User> {
        return await User.create({
            phone,
            device_token,
        })
    }

    async save(dto: SaveUserDto): Promise<User> {
        return await User.create({...dto});
    }

    async deleteById(id: number): Promise<void> {
        await User.destroy({where: {id}})
    }

    async findAll(options: any): Promise<{ rows: User[]; count: number }> {
        return await User.findAndCountAll(options);
    }

    async findBySignTime(options: any): Promise<{ rows: User[]; count: number }> {
        return await User.findAndCountAll(options);
    }

    async updateSignInTime(userId: number): Promise<[number]> {
        const currentDate = new Date();

        return await User.update({signInTime: currentDate}, {where: {id: userId}});
    }

    async findById(id: number): Promise<User | null> {
        return await User.findOne({where: {id}, include: [Location]});
    }

    async updateById(id: number, dto: UpdateUserDto, blockHours: number | null): Promise<[affectedCount: number]> {
        if (blockHours) {
            let myDate = new Date();
            dto.blockedUntil = addHoursToDate(myDate, +blockHours);
        }

        const [affectedCount] = await User.update(dto, {where: {id}});

        if (blockHours && affectedCount > 0) {
            const complaints = await Complaint.findAll({
                where: {target_id: id},
            });

            for (const complaint of complaints) {
                switch (complaint.entity_type) {
                    case ComplaintEnum.MESSAGE:
                        await Message.destroy({where: {id: complaint.message_id}});
                        console.log('message deleted id = ', complaint.message_id)
                        break;
                    case ComplaintEnum.COMMENT:
                        await Comment.destroy({where: {id: complaint.comment_id}});
                        console.log('comment deleted id = ', complaint.comment_id)
                        break;
                    case ComplaintEnum.PROFILE:
                        await Profile.destroy({where: {id: complaint.profile_id}});
                        console.log('profile deleted id = ', complaint.profile_id)
                        break;
                    default:
                        break;
                }
            }
        }

        return [affectedCount];
    }


}
function addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
}
export default new UserService();