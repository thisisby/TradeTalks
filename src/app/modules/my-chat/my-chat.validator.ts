import ApiError from "../../../errors/api.exception";
import {CreateMyChatDto, CreatePersonalChatDto} from "./my-chat.interface";
import userRoute from "../user/user.route";

class MyChatValidator {

    CreateMyChatValidator(user_id: number) {
        if(!user_id) {
            throw ApiError.ValidationError("user_id is required");
        }

    }

    SaveChat(chat_id: number) {
        if(!chat_id) {
            throw ApiError.ValidationError("chat_id is required");
        }
    }
}

export default new MyChatValidator()