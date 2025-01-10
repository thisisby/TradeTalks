import ApiError from "../../../errors/api.exception";

class ProfileValidator {
    CreateProfileValidate(description: string, name: string) {
        if (!name) {
            throw ApiError.ValidationError("name is required");
        }
        if(!description) {
            throw ApiError.ValidationError("description is required");
        }
    }
}

export default new ProfileValidator();