import ApiError from "../../../errors/api.exception";

class ChatTypeValidator {
    titleValidator(title: string) {
        if(!title) {
            throw ApiError.ValidationError("title is required");
        }
    }
}

export default new ChatTypeValidator()