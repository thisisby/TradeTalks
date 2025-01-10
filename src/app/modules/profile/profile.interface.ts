interface CreateProfileDto {
    name: string;
    description: string;
    main_photo?: string;
    additional_photos?: string[];
    user_id: number;
}

interface UpdateProfileDto {
    name?: string;
    description?: string;
    main_photo?: string;
    additional_photos?: string[];
}

export {
    CreateProfileDto,
    UpdateProfileDto,
}