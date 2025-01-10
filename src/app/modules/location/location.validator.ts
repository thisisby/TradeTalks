import ApiError from "../../../errors/api.exception";

class LocationValidator {

    nameValidator(name: string) {
        if(!name) {
            throw ApiError.ValidationError("name is required");
        }
    }
}

export default new LocationValidator()