import {SaveUserDto} from "./user.interface";
import ApiError from "../../../errors/api.exception";
import {Roles} from "./user.enum";
import {User} from "./user.entity";
import {IMAGEMIMETYPES} from "../../../config/settings";

class UserValidator {

    userValidate(user: User) {
        if (!user) {
            throw ApiError.UnauthorizedError();
        }
    }

    saveUserValidate(dto: SaveUserDto) {
        const {name, phone, device_token, location_id, role} = dto;

        if (!phone) {
            throw ApiError.ValidationError("phone is required");
        }

        if (!device_token) {
            throw ApiError.ValidationError("device_token is required");
        }

        if (!name) {
            throw ApiError.ValidationError("name is required");
        }

        if (!location_id) {
            throw ApiError.ValidationError("location_id is required");
        }

        if(role) {
            this.roleValidator(role)
        }
    }

    roleValidator(role: string) {
        if (role) {
            if (!Object.values(Roles).includes(role as Roles)) {
                throw ApiError.BadRequest("Invalid user role", "invalid_user_role");
            }
        }
    }

    avatarValidate(fileType: string, fileSize: number) {
        const maxSizeInBytes = 5 * 1024 * 1024;
        if (!IMAGEMIMETYPES.includes(fileType)) {
            throw ApiError.ValidationError(
                "avatar should be in the following formats: [jpg, jpeg, png]"
            );
        }

        if (fileSize > maxSizeInBytes) {
            throw ApiError.ValidationError(
                "Image size exceeds the maximum allowed size (5MB)."
            );
        }
    }


}

export default new UserValidator();