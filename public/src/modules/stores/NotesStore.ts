import {BaseStore} from "./BaseStore";
import {AppNoteRequests} from "../api";
import {AppUserStore, UserActions} from "./UserStore";
import {AppDispatcher} from "../dispatcher";
import {AppToasts} from "../toasts";
import {AppNoteStore, NoteStoreActions} from './NoteStore';

export type Note = {
    id: number,
    data: {
        title: string
        content: string,
    },
    update_time: string
}

export type NotesStoreState = {
    notes: Note[],
    selectedNote: Note,
    query: string,
    offset: number,
    count: number,
    modalOpen: boolean,
    saving: boolean
}

class NotesStore extends BaseStore<NotesStoreState> {
    state = {
        notes: [],
        selectedNote: undefined,
        query: "",
        offset: 0,
        count: 10,
        modalOpen: false,
        saving: undefined
    }

    constructor() {
        super();
        this.registerEvents()
    }

    private registerEvents(){
        AppDispatcher.register(async (action) => {
            switch (action.type){
                case NotesActions.SELECT_NOTE:
                    await this.selectNote(action.payload);
                    break;
                case NotesActions.CLOSE_NOTE:
                    this.closeNote();
                    break;
                case NotesActions.SEARCH_NOTES:
                    await this.searchNotes(action.payload);
                    break;
                case NotesActions.LOAD_NOTES:
                    await this.loadNotes();
                    break;
                case NotesActions.EXIT:
                    this.exit();
                    break;
                case NotesActions.OPEN_DELETE_NOTE_DIALOG:
                    this.openModal();
                    break;
                case NotesActions.CLOSE_DELETE_NOTE_DIALOG:
                    this.closeModal();
                    break;
                case NotesActions.DELETE_NOTE:
                    await this.deleteNote();
                    break;
                case NotesActions.SAVE_NOTE:
                    await this.saveNote(action.payload);
                    break;
                case NotesActions.CREATE_EMPTY_NOTE:
                    await this.createEmptyNote();
                    break;
                case NotesActions.UPLOAD_IMAGE:
                    await this.uploadImage(action.payload);
            }
        });
    }

    openModal () {
        this.SetState(state => ({
            ...state,
            modalOpen: true
        }))
    }

    closeModal () {
        this.SetState(state => ({
            ...state,
            modalOpen: false
        }))
    }

    exit () {
        this.SetState(state => ({
            ...state,
            query: "",
            offset: 0,
            selectedNote: undefined,
            notes: []
        }))
    }

    closeNote () {
        this.SetState(state => ({
            ...state,
            selectedNote: undefined
        }))
    }

    async selectNote (id:number) {
        const note = await AppNoteRequests.Get(id, AppUserStore.state.JWT)
        this.SetState(state => ({
            ...state,
            selectedNote: note
        }))
    }

    async init () {
        await this.fetchNotes()
        return this.state
    }

    async searchNotes (query) {
        this.SetState(state => ({
            ...state,
            offset: 0,
            query: query
        }))

        await this.fetchNotes(true)
    }

    async loadNotes () {
        this.SetState(state => ({
            ...state,
            offset: state.offset + state.count
        }))

        await this.fetchNotes()
    }

    async fetchNotes (reset: boolean=false) {
        const params:Record<string,any> = {
            title: this.state.query,
            offset: this.state.offset,
            count: this.state.count
        }

        console.log("fetchNotes")
        console.log(params)

        const notes = await AppNoteRequests.GetAll(AppUserStore.state.JWT, params)

        this.SetState(state => ({
            ...state,
            notes: reset ? notes : state.notes.concat(notes)
        }))

        console.log(notes)
    }

    async deleteNote() {
        console.log("deleteNote")
        const {status, csrf} = await AppNoteRequests.Delete(this.state.selectedNote.id, AppUserStore.state.JWT, AppUserStore.state.csrf)

        if (status == 204) {
            this.SetState(state => ({
                ...state,
                notes: state.notes.filter(item => item.id !== this.state.selectedNote.id)
            }))

            this.closeNote()

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, csrf)

        }
    }

    async saveNote(data) {
        console.log("saveNote")


        // if (this.state.selectedNote.id == data.id) {

            console.log("asdf")
            // this.SetState(state => ({
            //     ...state,
            //     saving: true
            // }))

            const {status, csrf} = await AppNoteRequests.Update(data, AppUserStore.state.JWT, AppUserStore.state.csrf)

            if (status === 200) {
                AppDispatcher.dispatch(UserActions.UPDATE_CSRF, csrf)
                AppToasts.success("Заметка успешно сохранена")
            }

            // this.SetState(state => ({
            //     ...state,
            //     saving: false
            // }))

            // TODO: Смена стейта вызывает анфокус заметки ;(
            // this.SetState(state => ({
            //     ...state,
            //     selectedNote: {
            //         id: state.selectedNote.id,
            //         data: note.data,
            //         update_time: note.update_time
            //     }
            // }))

            // this.SetState(state => ({
            //     ...state,
            //     notes: state.notes.map(n => n.id == note.id ? note : n)
            // }))

    }

    async createEmptyNote() {
        const response = await AppNoteRequests.Add(AppUserStore.state.JWT, AppUserStore.state.csrf)

        AppDispatcher.dispatch(UserActions.UPDATE_CSRF, response.headers["x-csrf-token"])

        // const note = {
        //     data: {
        //         content: "",
        //         title: "Новая заметка"
        //     },
        //     update_time: new Date().toISOString()
        // }
        //

        // const notes = this.state.notes
        //
        // notes.push(response.body)

        this.SetState(state => ({
            ...state,
            offset: state.offset + 1,
            notes: [...state.notes, response.body],
            // TODO: notes: [response.body, ...state.notes]
        }))

        console.log(this.state.notes)

        await this.selectNote(response.body.id)

        document.getElementById(String(response.body.id)).scrollIntoView()
    }

    async uploadImage({noteId, blockId, file}) {
        console.log("uploadImage")
        const {status, csrf, path} = await AppNoteRequests.UploadImage(noteId, file, AppUserStore.state.JWT, AppUserStore.state.csrf)

        console.log(status)
        if (status == 200) {
            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, csrf)

            // TODO

            const block = AppNoteStore.state.note.blocks[blockId]

            console.log(block)
            console.log(block.attributes)
            console.log( "src" in block.attributes)
            if (block.attributes != null) {
                console.log("asdfasdfasdfasdfasd")
                block.attributes["src"] = path;
            }

            AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                blockId: blockId,
                newBlock: block
            })
        }
    }
}

export const NotesActions = {
    SELECT_NOTE: "SELECT_NOTE",
    SEARCH_NOTES: "SEARCH_NOTES",
    LOAD_NOTES: "LOAD_NOTES",
    CLOSE_NOTE: "CLOSE_NOTE",
    EXIT: "EXIT_NOTES_PAGE",
    OPEN_DELETE_NOTE_DIALOG: "OPEN_DELETE_NOTE_DIALOG",
    CLOSE_DELETE_NOTE_DIALOG: "CLOSE_DELETE_NOTE_DIALOG",
    DELETE_NOTE: "DELETE_NOTE",
    SAVE_NOTE: "SAVE_NOTE",
    CREATE_EMPTY_NOTE: "CREATE_EMPTY_NOTE",
    UPLOAD_IMAGE: "UPLOAD_IMAGE"
}

export const AppNotesStore = new NotesStore();