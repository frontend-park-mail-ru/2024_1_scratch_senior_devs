export type NoteType = {
    id: string,
    parent: string,
    children: SubNoteType[],
    tags: string[],
    data: {
        title: string
        content: any[],
    },
    update_time: string,
    owner_id: string,
    collaborators: string[],
    icon: string,
    header: string,
    favorite: boolean,
    public: boolean,
    username: string,
    image_path: string
}

export type CollaboratorType = {
    id: string,
    username: string,
    avatar: string
}

export type NoteDataType = {
    title: string
    content: any[],
}

export type SubNoteType = {
    id: string,
    title: string
}
