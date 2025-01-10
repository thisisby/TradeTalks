import {CreateComplaintDto} from "./complaint.interface";
import ApiError from "../../../errors/api.exception";

class ComplaintValidator {
    validateCreateComplaint(dto: CreateComplaintDto) {
        const {text, user_id, entity_id} = dto;

        if(!text) {
            throw ApiError.ValidationError("text is required");
        }
        if(!user_id) {
            throw ApiError.ValidationError("user_id is required");
        }
        if(!entity_id) {
            throw ApiError.ValidationError("entity_id is required");
        }
    }
}

export default new ComplaintValidator()