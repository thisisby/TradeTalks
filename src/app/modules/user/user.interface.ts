import {Roles} from "./user.enum";

interface UpdateUserDto {
    name?: string;
    phone?: string;
    device_token?: string;
    location_id?: number;
    avatar?: string;
    role?: Roles;
    blockedUntil?: Date;
    blockReason?: string;
}

interface SaveUserDto {
    name: string;
    phone: string;
    device_token: string;
    location_id: number;
    avatar?: string;
    role?: string;
}

export {
    UpdateUserDto,
    SaveUserDto,
}