interface CreatePersonalMsgDto {
    text: string;
    photo?: string;
    user_id: number;
    subChat_id: number;
    receiver_id: number;
}

interface UserStatus {
    userId: number,
    status: boolean
}

interface CreateGroupMsgDto {
    text: string;
    photo?: string;
    user_id: number;
    subChat_id: number;
    group_id: number;
    location_id: number;
}

interface UserInRedis {
    userId: number;
    socketId: string;
    online: boolean,
    device_token?: string;
    name?: string;
    phone: string;
}

export {
    CreatePersonalMsgDto,
    CreateGroupMsgDto,
    UserStatus,
    UserInRedis
}