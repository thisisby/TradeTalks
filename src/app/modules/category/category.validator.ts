import ApiError from "../../../errors/api.exception";

class CategoryValidator {
    nameValidator(name: string) {
        if(!name) {
            throw ApiError.ValidationError("name is required");
        }
    }
}

export default new CategoryValidator()