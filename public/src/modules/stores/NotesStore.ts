import {BaseStore} from "./BaseStore";
import {AppNoteRequests} from "../api";
import {AppUserStore} from "./UserStore";
import {AppDispatcher} from "../dispatcher";

type Note = {
    id: number,
    title: string,
    content: string,
    update_time: string
}

export type NotesStoreState = {
    notes: Note[],
    selectedNote: Note,
    query: string,
    offset: number,
    count: number,
    modalOpen: boolean
}

class NotesStore extends BaseStore<NotesStoreState> {
    state = {
        notes: [],
        selectedNote: undefined,
        query: "",
        offset: 0,
        count: 10,
        modalOpen: false
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

        const notes = await AppNoteRequests.GetAll(AppUserStore.state.JWT, params)

        this.SetState(state => ({
            ...state,
            notes: reset ? notes : state.notes.concat(notes)
        }))
    }

    async deleteNote() {
        console.log("deleteNote")
        console.log(this.state.selectedNote.id)
        // TODO
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
    DELETE_NOTE: "DELETE_NOTE"
}

export const AppNotesStore = new NotesStore();