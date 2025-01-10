
class ApiError extends Error {
  status: number;
  error_info: string;
  errors: any;
  is_error: boolean;

  constructor(
    status: number,
    message: string,
    error_info: string = "",
    errors: any = []
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.error_info = error_info;
    this.is_error = true;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Token is not valid", "invalid_token");
  }

  static BadRequest(message: string, error_info: string, errors: any = []) {
    return new ApiError(400, message, error_info, errors);
  }

  static NotFound(message: string, error_info: string, errors: any = []) {
    return new ApiError(404, message, error_info, errors);
  }

  static InternalError(message: string, error_info: string, errors: any = []) {
    return new ApiError(500, message, error_info, errors);
  }

  static ValidationError(message: string, errors: any = []) {
    return new ApiError(400, message, "validation_error", errors);
  }
}

export default ApiError;
