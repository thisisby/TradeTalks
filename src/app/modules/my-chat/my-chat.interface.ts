import {CategoryEnum} from "../../../constants/category.constant";

interface CreateMyChatDto {
    user_id: number;
    category_id: CategoryEnum;
    chat_id: number;
    receiver_id?: number;
    is_notification?: true;
}

interface CreatePersonalChatDto {
    user_id: number;
}

export {
    CreateMyChatDto,
    CreatePersonalChatDto,
}