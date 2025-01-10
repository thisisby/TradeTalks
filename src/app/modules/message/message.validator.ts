import {CreateMessageDto} from "./message.interface";
import ApiError from "../../../errors/api.exception";

class MessageValidator{
    createMessageValidate(dto: CreateMessageDto) {
        const {text} = dto
        if(!text) {
            throw ApiError.ValidationError("text is required");
        }

    }
}

export default new MessageValidator()