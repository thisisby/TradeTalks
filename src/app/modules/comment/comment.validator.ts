import ApiError from "../../../errors/api.exception";

class CommentValidator {
    validateComment(text: string) {
        if (!text) {
            throw ApiError.ValidationError("text is required");
        }
    }
}

export default new CommentValidator()