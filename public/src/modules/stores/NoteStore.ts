import {BaseStore} from './BaseStore';
import {AppDispatcher} from '../dispatcher';

export const NoteStoreActions = {
    SET_NOTE: "SET_NOTE",
    CHANGE_TITLE: 'CHANGE_TITLE',
    CHANGE_CONTENT: 'CHANGE_CONTENT',
    OPEN_DROPDOWN: "OPEN_DROPDOWN",
    CLOSE_DROPDOWN: "CLOSE_DROPDOWN",
    PUSH_SAVE: "PUSH_SAVE"
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
        }
    };

    private severs: Array<() => any> = [];

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
                    break;
                case NoteStoreActions.PUSH_SAVE:
                    this.saveNote(true);
            }
        });
    };

    private timerId;

    private saveNote = (immediately=false) => {
        clearTimeout(this.timerId);

        if (immediately) {
            this.severs.forEach((saver) => {
                saver();
            });

            return
        }

        this.timerId = setTimeout(() => {
            this.severs.forEach((saver) => {
                saver();
            });
        }, 250);
    };

    public AddSaver = (saver: () => any) => {
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
        this.saveNote();
    };

    private changeContent = (content: any) => {
        this.state.note.blocks = content
        this.saveNote();
    }

    private openDropdown = () => {
        this.SetState(state => ({
            ...state,
            dropdownOpen: true
        }))
    }

    private closeDropdown = () => {
        this.SetState(state => ({
            ...state,
            dropdownOpen: false
        }))
    }
}


export const AppNoteStore = new NoteStore();