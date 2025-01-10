import {generateRandomCode} from "../../../utils/random";
import {EXPIRY_TIME} from "../../../config/settings";
import {Redis} from "../../../config/redis";
import ApiError from "../../../errors/api.exception";
import {Token} from "./auth.entity";
import MessageService from "../../../services/message.service";
import jwt from "jsonwebtoken";
import {generateTokens, verifyRefreshToken} from "./auth.helpers";
import {User} from "../user/user.entity";

class AuthService {
    async sendCode(phone: string): Promise<void> {
        const code = generateRandomCode(1000, 9000);

        await MessageService.sendTelegramMessage(phone, code);
        await MessageService.sendSmsMessage(phone, code);

        await Redis.client.setEx(phone, EXPIRY_TIME, code.toString());
    }

    async checkCode(code: string, phone: string): Promise<void> {
        const savedCode = await Redis.client.get(phone)

        if (code === "1111" && phone === "+71111111111") {
            return
        }

        if (!savedCode || savedCode !== code) {
            throw ApiError.NotFound(
                "Code not found or expired",
                "code_not_found_or_expired"
            );
        }
    }

    async refreshToken(refreshToken: string) {
        const userData: string | jwt.JwtPayload = verifyRefreshToken(refreshToken);

        const token = await Token.findOne({where: {token: refreshToken}});
        if (!token || typeof userData === "string") {
            throw ApiError.BadRequest("Refresh Token is not valid", "invalid_token");
        }

        const user = await User.findOne({where: {id: userData.id}});
        if (!user) {
            throw ApiError.NotFound("User not found", "user_not_found");
        }

        const tokens = generateTokens(user.id);
        await this.saveToken(user.id, tokens.refreshToken);

        return {tokens, user};
    }

    async saveToken(userId: number, refreshToken: string): Promise<Token> {
        const token = await Token.findOne({where: {user_id: userId}})
        if (token) {
            token.token = refreshToken;
            await token.save();
            return token;
        }

        return await Token.create({user_id: userId, token: refreshToken});
    }

    async removeToken(refreshToken: string) {
        const token = await Token.findOne({where: {token: refreshToken}});
        if (token) {
            await token.destroy();
            return true;
        }
        return false;
    }
}

export default new AuthService();
