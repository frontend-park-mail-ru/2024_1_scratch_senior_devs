import {BaseStore} from './BaseStore';
import {AppDispatcher} from '../dispatcher';
import {AppNotesStore} from "./NotesStore";

export const NoteStoreActions = {
    CLEAR_NOTE: "CLEAR_NOTE",
    SET_NOTE: "SET_NOTE",
    CHANGE_TITLE: 'CHANGE_TITLE',
    CHANGE_CONTENT: 'CHANGE_CONTENT',
    OPEN_DROPDOWN: "OPEN_DROPDOWN",
    CLOSE_DROPDOWN: "CLOSE_DROPDOWN",
    PUT_TO_CACHE: "PUT_TO_CACHE"
};

export type NoteStoreState = {
    note: any,
    dropdownOpen: boolean
}

export type CursorPosition = {
    blockId: number,
    pos: number
}

export type DropdownPosition = {
    left: number,
    top: number,
    isOpen: boolean,
    blockId: number
}

class NoteStore extends BaseStore<NoteStoreState> {
    state = {
        dropdownOpen: false,
        note: {
            title: '',
            blocks: Array<any>()
        },
        cache: {}
    };

    private severs: Array<(data) => any> = [];

    constructor() {
        super();
        this.registerEvents();
    }

    private registerEvents = () => {
        AppDispatcher.register((action) => {
            switch (action.type) {
                case NoteStoreActions.SET_NOTE:
                    this.setNote(action.payload);
                    break
                case NoteStoreActions.CHANGE_TITLE:
                    this.changeTitle(action.payload);
                    break;
                case NoteStoreActions.CHANGE_CONTENT:
                    this.changeContent(action.payload);
                    break
                case NoteStoreActions.CLEAR_NOTE:
                    this.clearNote();
                    break
                case NoteStoreActions.PUT_TO_CACHE:
                    this.updateCache(action.payload);
                    break
            }
        });
    };

    private timerId;

    private saveNote = (data, immediately=false) => {
        clearTimeout(this.timerId);

        if (immediately) {
            this.severs.forEach((saver) => {
                saver(data);
            });

            return
        }

        this.timerId = setTimeout(() => {
            this.severs.forEach((saver) => {
                saver(data);
            });
        }, 250);
    };

    public AddSaver = (saver: (data) => any) => {
        this.severs.push(saver);
    };

    public RemoveSavers = (saver: () => any) => {
        this.severs = [];
    };

    private setNote = (note: any) => {
        this.SetState(state => ({
            ...state,
            note: note
        }));
    };

    private changeTitle = (title: string) => {
        this.state.note.title = title;
        this.onNoteChanged()
    };

    private changeContent = (content: any) => {
        this.state.note.blocks = content
        this.onNoteChanged()
    }

    private onNoteChanged = () => {
        if (AppNotesStore.state.selectedNote) {
            this.saveNote({id: AppNotesStore.state.selectedNote.id, parent: AppNotesStore.state.selectedNote.parent, note: this.state.note});
        }
    }

    private clearNote = () => {
        this.SetState(state => ({
            ...state,
            note: {
                title: '',
                blocks: Array<any>()
            }
        }))
    }

    private updateCache = ({key, value}) => {
        this.state.cache[key] = value
    }
}


export const AppNoteStore = new NoteStore();