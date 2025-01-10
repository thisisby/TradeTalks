import {NextFunction, Request, Response,} from "express";

import logger from "../../config/logger";
import ApiError from "../../errors/api.exception";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ApiError) {
        logger.error({
            message: err?.message,
            error_info: err?.error_info,
            errors: err?.errors,
        });

        return res.status(err.status).json({
            message: err.message,
            error_info: err.error_info,
            errors: err.errors,
            is_error: err.is_error,
        });
    }

    logger.error(err);

    return res.status(500).json({
        ok: false,
        message: "Something went wrong. Server Error!",
        errors: err
    })
}

