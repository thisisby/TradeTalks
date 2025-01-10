import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

import {verifyAccessToken} from "../modules/auth/auth.helpers";
import {User} from "../modules/user/user.entity";
import {UserRequest} from "../../context";
import logger from "../../config/logger";


export default async function (req: Request, res: Response, next: NextFunction) {
    let token;

    if (req.headers && req.headers.authorization?.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded: string | jwt.JwtPayload = verifyAccessToken(token);

            if (typeof decoded !== "string") {
                const id: number = decoded.id;

                const user = await User.findOne({where: {id}});
                if (!user) {
                    return res
                        .status(404)
                        .json({
                            is_error: true,
                            message: "user_not_found"
                        });
                }
                (req as UserRequest).user = user;

                next();
            } else {
                res
                    .status(400)
                    .json({
                        is_error: true,
                        message: "invalid_token",
                    });
                return;
            }
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                res
                    .status(401)
                    .json({
                        is_error: true,
                        message: "token_expired",
                    });
                return;
            }
            res
                .status(400)
                .json({
                    is_error: true,
                    message: "invalid_token",
                });
            logger.error(`Invalid Token: ${e}`);
            return;
        }
    }

    if (!token) {
        res
            .status(401)
            .json({
                is_error: true,
                message: "token_not_found",
            });
        return;
    }
}
