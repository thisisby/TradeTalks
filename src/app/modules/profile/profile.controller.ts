import {NextFunction, Request, Response} from "express";
import {UserRequest} from "../../../context";
import {CreateProfileDto, UpdateProfileDto} from "./profile.interface";
import ProfileService from "./profile.service";
import ImageUploadService from "../../../services/image-upload.service";
import ProfileValidator from "./profile.validator";
import {Roles} from "../user/user.enum";
import ApiError from "../../../errors/api.exception";

class ProfileController {
    async createProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const {description, name} = req.body;
            const {user} = req as UserRequest;

            ProfileValidator.CreateProfileValidate(description, name);

            if (await ProfileService.findAmountByUserId(user.id) >= 10 && user.role !== Roles.ADMIN) {
                throw ApiError.BadRequest('You can\'t create more than 10 profiles', "too_many_profiles");
            }

            const mainPhoto = (req.files as any)['main_photo']?.[0] as Express.Multer.File | null;
            const additionalPhotos = (req.files as any)['additional_photos'] as Express.Multer.File[] | null;

            const mainPhotoUrl = mainPhoto ? await ImageUploadService.uploadSinglePhoto(mainPhoto) : '';
            const additionalPhotoUrls = additionalPhotos ? await ImageUploadService.uploadMultiplePhotos(additionalPhotos) : [];

            const dto: CreateProfileDto = {
                name,
                description,
                main_photo: mainPhotoUrl,
                additional_photos: additionalPhotoUrls,
                user_id: user.id,
            };

            const profile = await ProfileService.save(dto);

            res
                .status(201)
                .json({
                    is_error: false,
                    message: "created",
                    profile,
                });
        } catch (e) {
            next(e);
        }
    }

    async getProfiles(req: Request, res: Response, next: NextFunction) {
        try {
            const {id} = req.params;
            const {rows, count} = await ProfileService.findUserProfiles(parseInt(id));

            res.json({
                is_error: false,
                message: "success",
                profiles: rows,
                count
            });
        } catch (e) {
            next(e);
        }
    }

    async getMyProfiles(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req as UserRequest;
            const profiles = await ProfileService.findUserProfiles(user.id);

            res.json({
                is_error: false,
                message: "success",
                profiles,
            });
        } catch (e) {
            next(e);
        }
    }

    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const {id, profileId} = req.params;
            const profile = await ProfileService.findProfile(parseInt(id), parseInt(profileId));

            res.json({
                is_error: false,
                message: "success",
                profile,
            });
        } catch (e) {
            next(e);
        }
    }


    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, description} = req.body;
            const {profileId} = req.params;
            const {user} = req as UserRequest;

            const mainPhoto = (req.files as any)['main_photo']?.[0] as Express.Multer.File | null;
            const additionalPhotos = (req.files as any)['additional_photos'] as Express.Multer.File[] | null;

            const mainPhotoUrl = mainPhoto ? await ImageUploadService.uploadSinglePhoto(mainPhoto) : '';
            const additionalPhotoUrls = additionalPhotos ? await ImageUploadService.uploadMultiplePhotos(additionalPhotos) : [];

            const dto: UpdateProfileDto = {
                description,
                name,
            };
            if (mainPhoto) {
                dto.main_photo = mainPhotoUrl
            }
            if (additionalPhotos) {
                dto.additional_photos = additionalPhotoUrls
            }

            const [affectedCount] = await ProfileService.updateById(parseInt(profileId), user, dto)

            if (affectedCount > 0) {
                res
                    .status(200)
                    .json({
                        is_error: false,
                        message: "Profile updated successfully",
                    });
            } else {
                res
                    .status(404)
                    .json({
                        is_error: true,
                        message: "Profile not found",
                    });
            }
        } catch (e) {
            next(e);
        }
    }

    async getLikes(req: Request, res: Response, next: NextFunction) {
        try {
            const {profileId} = req.params;
            const likes = await ProfileService.getLikes(parseInt(profileId));
            res.json({
                is_error: false,
                message: "success",
                likes,
            });
        } catch (e) {
            next(e);
        }
    }

    async addLike(req: Request, res: Response, next: NextFunction) {
        try {
            const {profileId} = req.params;
            const {user} = req as UserRequest;
            await ProfileService.addLike(parseInt(profileId), user.id);
            res.status(201).json({
                is_error: false,
                message: "Like added successfully",
            });
        } catch (e) {
            next(e);
        }
    }

    async deleteLike(req: Request, res: Response, next: NextFunction) {
        try {
            const {profileId} = req.params;
            const {user} = req as UserRequest;
            await ProfileService.removeLike(parseInt(profileId), user.id);
            res.json({
                is_error: false,
                message: "Like removed successfully",
            });
        } catch (e) {
            next(e);
        }
    }

    async deleteProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const {id, profileId} = req.params;
            const {user} = req as UserRequest;

            const profile = await ProfileService.findById(parseInt(profileId))

            if (profile?.user_id === user.id || user.role === Roles.ADMIN) {
                await ProfileService.deleteById(parseInt(profileId));
            }

            res
                .status(204)
                .json({
                    is_error: false,
                    message: "deleted",
                });
        } catch (e) {
            next(e);
        }
    }
}

export default new ProfileController();