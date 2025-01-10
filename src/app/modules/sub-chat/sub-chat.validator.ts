import ApiError from "../../../errors/api.exception";

class SubChatValidator {

    titleValidator(title: string) {
        if(!title) {
            throw ApiError.ValidationError("title is required");
        }
    }
}

export default new SubChatValidator()