import {BaseStore} from './BaseStore';
import {AppDispatcher} from '../dispatcher';

export const NoteStoreActions = {
    SET_NOTE: "SET_NOTE",
    CHANGE_TITLE: 'CHANGE_TITLE',
    CHANGE_CONTENT: 'CHANGE_CONTENT'
};

export type NoteStoreState = {
    note: any
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
                    break
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
        }, 500);
    };

    public AddSaver = (saver: () => any) => {
        this.severs.push(saver);
    };

    public RemoveSavers = (saver: () => any) => {
        this.severs = [];
    };

    private setNote = (note: any) => {
        console.log("setNote")
        console.log(note)
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
}


export const AppNoteStore = new NoteStore();