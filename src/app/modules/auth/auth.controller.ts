import {NextFunction, Request, Response,} from "express";

import AuthValidator from "./auth.validator";
import AuthService from "./auth.service";
import UserService from "../user/user.service";
import {generateTokens} from "./auth.helpers";
import {Redis} from "../../../config/redis";
import {UserRequest} from "../../../context";

class AuthController {
    async sendCode(req: Request, res: Response, next: NextFunction) {
        try {
            const {phone} = req.body;
            AuthValidator.sendCodeValidate(phone)

            await AuthService.sendCode(phone);

            res.json({
                is_error: false,
                message: "code_sent"
            });
        } catch (e) {
            next(e);
        }
    }


    async checkCode(req: Request, res: Response, next: NextFunction) {
        try {
            const {code, device_token, phone} = req.body;
            AuthValidator.checkCodeValidate(code, device_token, phone)

            await AuthService.checkCode(code, phone);

            let user = await UserService.findByPhone(phone);
            if (!user) {
                user = await UserService.create(device_token, phone)
            }

            const tokens = generateTokens(user.id);
            const savedToken = await AuthService.saveToken(user.id, tokens.refreshToken);

            await Redis.client.del(phone);

            res.cookie(
                "refreshToken",
                tokens.refreshToken,
                {
                    maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                }
            );

            res.json({
                is_error: false,
                message: "code_valid",
                ...tokens,
                user
            });

        } catch (e) {
            next(e);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            await AuthService.removeToken(refreshToken);

            res.clearCookie("refreshToken");

            res.json({
                is_error: false,
                message: "logout_success"
            });
        } catch (e) {
            next(e);
        }
    }

    async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const {user} = req as UserRequest;
            await UserService.updateSignInTime(user.id)
            res.json({
                is_error: false,
                message: "get_me_success",
                user
            });
        } catch (e) {
            next(e);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            AuthValidator.refreshValidate(refreshToken);

            const {tokens, user} = await AuthService.refreshToken(refreshToken);

            res.cookie(
                "refreshToken",
                tokens.refreshToken,
                {
                    maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                }
            );

            res.json({
                is_error: false,
                message: "refresh_success",
                ...tokens,
                user,
            });
        } catch (e) {
            next(e);
        }
    }

}

export default new AuthController();
