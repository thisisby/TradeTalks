import ApiError from "../../../errors/api.exception";

class AuthValidator {
    sendCodeValidate(phone: string) {
        if (!phone) {
            throw ApiError.ValidationError("phone is required");
        }
    }

    checkCodeValidate(code: string, device_token: string, phone: string) {
        if (!phone) {
            throw ApiError.ValidationError("phone is required");
        }

        if (!device_token) {
            throw ApiError.ValidationError("device_token is required");
        }

        if (!code) {
            throw ApiError.ValidationError("code is required");
        }
    }

    refreshValidate(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.BadRequest("refreshToken is required", "refresh_token_required")
        }
    }
}

export default new AuthValidator();