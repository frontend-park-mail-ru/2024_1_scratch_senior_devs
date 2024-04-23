export type NoteType = {
    id: string,
    data: {
        parent: string,
        children: [],
        title: string
        content: any[],
    },
    update_time: string
}
