export type NoteType = {
    id: string,
    data: {
        parent: string,
        children: [],
        title: string
        content: string,
    },
    update_time: string
}
