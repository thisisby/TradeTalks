import {CreateProfileDto, UpdateProfileDto} from "./profile.interface";
import {Profile} from "./profile.entity";
import {User} from "../user/user.entity";
import {Comment} from "../comment/comment.entity";
import {Like} from "../like/like.entity";
import ApiError from "../../../errors/api.exception";
import {Roles} from "../user/user.enum";

class ProfileService {
    async save(dto: CreateProfileDto): Promise<Profile> {
        return await Profile.create({...dto});
    }

    async updateById(id: number, user: User, dto: UpdateProfileDto) {
        if (user.role === Roles.ADMIN) {
            return await Profile.update(dto, {where: {id}})
        }
        return await Profile.update(dto, {where: {id, user_id: user.id}});
    }



    async findAll() {
        const profiles = await Profile.findAll({
            include: [User, {model: Comment, include: [{model: User}]}, Like],
            attributes: {
                exclude: ['user_id'],
            },
            order: [["id", "ASC"]],
        });

        return profiles;
    }

    async findById(id: number) {
        return await Profile.findOne({where: {id}});
    }

    async find(options: any) {
        return await Profile.findOne(options);
    }

    async findAmountByUserId(user_id: number) {
        return await Profile.count({where: {user_id}});
    }

    async findUserProfiles(user_id: number): Promise<{ rows: Profile[], count: number }> {
        return await Profile.findAndCountAll({
            where: {user_id},
            include: [User, {model: Comment, include: [{model: User}]}, Like],
        });

    }

    async findProfile(user_id: number, id: number) {
        const profile = await Profile.findOne({
            where: {id, user_id},
            include: [User, {model: Comment, include: [{model: User}]}, Like],
        });

        if (!profile) {
            throw ApiError.NotFound("Profile not found", "profile_not_found");
        }

        return profile;
    }

    async getLikes(profile_id: number): Promise<number> {
        const profile = await Profile.findByPk(profile_id, {include: [Like]});
        if (!profile) {
            throw ApiError.NotFound("Profile not found", "profile_not_found");
        }
        return profile.likes.length;
    }

    async addLike(profile_id: number, user_id: number): Promise<void> {
        const existingLike = await Like.findOne({where: {profile_id, user_id}});

        if (existingLike) {
            throw ApiError.BadRequest("User has already liked this profile", "already_liked");
        }

        const profile = await Profile.findByPk(profile_id);
        const user = await User.findByPk(user_id);

        if (!profile || !user) {
            throw ApiError.NotFound("Profile or User not found", "profile_or_user_not_found");
        }

        await Like.create({profile_id, user_id});
    }

    async removeLike(profile_id: number, user_id: number): Promise<void> {
        await Like.destroy({where: {profile_id, user_id}});
    }

    async deleteById(id: number): Promise<void> {
        await Profile.destroy({where: {id}})
    }

}

export default new ProfileService();