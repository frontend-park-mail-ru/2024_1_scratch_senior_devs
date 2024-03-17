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
    count: number
}

class NotesStore extends BaseStore<NotesStoreState> {
    state = {
        notes: [],
        selectedNote: undefined,
        query: "",
        offset: 0,
        count: 10
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
                    await this.exit();
                    break;
            }
        });
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
}

export const NotesActions = {
    SELECT_NOTE: "SELECT_NOTE",
    SEARCH_NOTES: "SEARCH_NOTES",
    LOAD_NOTES: "LOAD_NOTES",
    CLOSE_NOTE: "CLOSE_NOTE",
    EXIT: "EXIT"
}

export const AppNotesStore = new NotesStore();