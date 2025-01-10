import {ComplaintEnum} from "./complaint.enum";

interface CreateComplaintDto {
    text: string;
    user_id?: number;
    entity_id: number;
    entity_type: ComplaintEnum;
    target_id?: number;
}


export {
    CreateComplaintDto,
}