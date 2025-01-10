interface CheckCodeDto {
    phone: string,
    device_token: string,
    code: string,
}

interface UserRedis{
    socketId: string,
    online: boolean,
}
interface GenerateTokensDTO {
    accessToken: string;
    refreshToken: string;
}

export {
    CheckCodeDto,
    GenerateTokensDTO,
    UserRedis,
}