interface CreateSubChat {
    title: string;
    chat_id: number;
}

interface UpdateSubChat {
    title?: string;
    isPinned?: boolean;
}

export {
    CreateSubChat,
    UpdateSubChat,
}