interface CreateMessageDto {
    text: string;
    photo?: string;
    user_id: number;
    subChat_id: number;
    location_id?: number;
    isRead?: boolean;
}

interface CreatePersonalMessageDto {
    text: string;
    photo?: string;
    user_id: number;
    subChat_id: number;
    receiver_id: number;
}

interface CreateGroupMessageDto {
    text: string;
    photo?: string;
    user_id: number;
    subChat_id: number;
    groupName: string;
}

export {
    CreateMessageDto,
    CreatePersonalMessageDto,
    CreateGroupMessageDto,
}