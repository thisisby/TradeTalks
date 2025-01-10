import jwt from "jsonwebtoken";

import {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET,} from "../../../config/settings"
import {GenerateTokensDTO} from "./auth.interface";

function generateTokens(id: number): GenerateTokensDTO {
    const accessToken = jwt.sign(
        {id},
        JWT_ACCESS_SECRET,
        {expiresIn: '3600d'}
    );
    const refreshToken = jwt.sign(
        {id},
        JWT_REFRESH_SECRET,
        {expiresIn: '180d'}
    );

    return {
        accessToken,
        refreshToken
    }
}

function verifyAccessToken(token: string) {
    try {
        return jwt.verify(
            token,
            JWT_ACCESS_SECRET
        );
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            throw e
        }
        return '';
    }
}

function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(
            token,
            JWT_REFRESH_SECRET
        );
    } catch (e) {
        return '';
    }
}

export {
    generateTokens,
    verifyAccessToken,
    verifyRefreshToken,
}