export type NoteType = {
    id: string,
    parent: string,
    children: SubNoteType[],
    tags: string[],
    data: {
        title: string
        content: any[],
    },
    update_time: string
}

export type SubNoteType = {
    id: string,
    title: string
}
