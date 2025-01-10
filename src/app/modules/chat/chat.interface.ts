interface CreateChatDto {
    type_id?: number;
    user_id: number;
    title: string;
    photo?: string;
    location_id?: number;
}
interface UpdateChatDto {
    type_id?: number;
    title?: string;
    photo?: string;
    location_id?: number;
    isLocationPinned?: boolean;
}
interface ACreateChatDto {
    type_id: number;
    user_id: number;
    location_id: number;
    title: string;
    photo?: string;
}

export {
    CreateChatDto,
    ACreateChatDto,
    UpdateChatDto,
}