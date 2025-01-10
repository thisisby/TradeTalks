import ApiError from "../../../errors/api.exception";
import {CreateChatDto} from "./chat.interface";

class ChatValidator {
    createChatValidate(dto: CreateChatDto) {
        const {title} = dto;
        if (!title) {
            throw ApiError.ValidationError("title is required");
        }
    }

    createAChatValidate(dto: CreateChatDto) {
        const {type_id, title} = dto;

        if (!type_id) {
            throw ApiError.ValidationError("type_id is required");
        }

        if (!title) {
            throw ApiError.ValidationError("title is required");
        }
    }
}

export default new ChatValidator()