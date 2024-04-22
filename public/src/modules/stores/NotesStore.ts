import {BaseStore} from './BaseStore';
import {AppNoteRequests} from '../api';
import {AppUserStore, UserActions} from './UserStore';
import {AppDispatcher} from '../dispatcher';
import {AppToasts} from '../toasts';
import {AppNoteStore, NoteStoreActions} from './NoteStore';
import {BlockNode} from '../../components/Block/Block';
import {NoteType} from "../../utils/types";

export type NotesStoreState = {
    notes: NoteType[],
    selectedNote: NoteType,
    selectedNoteChildren: any[],
    query: string,
    offset: number,
    count: number,
    fetching: boolean
}

class NotesStore extends BaseStore<NotesStoreState> {
    state = {
        notes: [],
        selectedNote: undefined,
        selectedNoteChildren: [],
        query: '',
        offset: 0,
        count: 10,
        fetching: false,
        noteNotFound: false
    };

    constructor() {
        super();
        this.registerEvents();
    }

    private registerEvents(){
        AppDispatcher.register(async (action) => {
            switch (action.type){
                case NotesActions.SELECT_NOTE:
                    this.selectNote(action.payload);
                    break;
                case NotesActions.FETCH_NOTE:
                    await this.fetchNote(action.payload);
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
                case NotesActions.DELETE_NOTE:
                    await this.deleteNote();
                    break;
                case NotesActions.SAVE_NOTE:
                    await this.saveNote(action.payload);
                    break;
                case NotesActions.CREATE_NEW_NOTE:
                    await this.createNewNote();
                    break;
                case NotesActions.CREATE_SUB_NOTE:
                    await this.createSubNote(action.payload);
                    break;
                case NotesActions.UPLOAD_IMAGE:
                    await this.uploadImage(action.payload);
                    break;
                case NotesActions.FETCH_IMAGE:
                    await this.fetchImage(action.payload);
                    break;
                case NotesActions.UPLOAD_FILE:
                    await this.uploadFile(action.payload);
                    break;
                case NotesActions.DOWNLOAD_FILE:
                    await this.downloadFile(action.payload);
                    break;
                case NotesActions.START_FETCHING:
                    this.startFetching();
                    break;
                case NotesActions.OPEN_NOTE:
                    await this.openNote(action.payload)
                    break
            }
        });
    }

    exit () {
        this.SetState(state => ({
            ...state,
            query: '',
            offset: 0,
            selectedNote: undefined,
            notes: []
        }));
    }

    closeNote () {
        this.SetState(state => ({
            ...state,
            selectedNote: undefined
        }));
    }

    async fetchNote (id:string) {
        try {
            console.log("fetchNote")

            const note = await AppNoteRequests.Get(id, AppUserStore.state.JWT);

            console.log(note)

            this.selectNote(note);

        } catch (e) {
            console.log(e)
            AppToasts.error('Заметка не найдена');
        }
    }

    selectNote (note:NoteType) {
        this.SetState(state => ({
            ...state,
            selectedNote: note,
            selectedNoteChildren: note.data.children
        }));
    }

    async openNote(id:string) {
        try {
            console.log("openNote")

            const note = await AppNoteRequests.Get(id, AppUserStore.state.JWT);

            console.log(note)

            this.selectNote(note);

            history.pushState(null, null, '/notes/' + id)

        } catch (e) {
            console.log(e)
            AppToasts.error('Заметка не найдена');
        }
    }


    async init () {
        await this.fetchNotes(true);
        return this.state;
    }

    async searchNotes (query:string) {
        this.SetState(state => ({
            ...state,
            notes: [],
            offset: 0,
            query: query
        }));

        await this.fetchNotes(true);
    }

    async loadNotes () {
        this.SetState(state => ({
            ...state,
            offset: state.offset + state.count
        }));

        await this.fetchNotes();
    }

    async fetchNotes (reset=false) {
        try {
            const params:Record<string,any> = {
                title: this.state.query,
                offset: this.state.offset,
                count: this.state.count
            };

            let notes:NoteType[] = await AppNoteRequests.GetAll(AppUserStore.state.JWT, params);

            notes = notes.filter((note) => !note.data.parent)

            this.SetState(state => ({
                ...state,
                fetching: false,
                notes: reset ? notes : state.notes.concat(notes)
            }));

        } catch {
            AppToasts.error('Что-то пошло не так');
        }
    }

    async deleteNote() {
        try {
            const {csrf} = await AppNoteRequests.Delete(this.state.selectedNote.id, AppUserStore.state.JWT, AppUserStore.state.csrf);

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, csrf);

            this.SetState(state => ({
                ...state,
                notes: state.notes.filter(item => item.id !== this.state.selectedNote.id)
            }));

            this.closeNote();

            history.pushState(null, null, '/notes');

            AppToasts.info('Заметка успешно удалена');

        } catch {
            AppToasts.error('Что-то пошло не так');
        }
    }

    async saveNote(data) {
        try {
            const {csrf} = await AppNoteRequests.Update(data, this.state.selectedNoteChildren, AppUserStore.state.JWT, AppUserStore.state.csrf);

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, csrf);

        } catch {
            AppToasts.error('Что-то пошло не так');
        }
    }

    async createNewNote() {
        try {
            const response = await AppNoteRequests.Add(AppUserStore.state.JWT, AppUserStore.state.csrf);

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, response.headers['x-csrf-token']);

            this.SetState(state => ({
                ...state,
                offset: state.offset + 1,
                notes: [response.body, ...state.notes]
            }));

            document.getElementById(String(response.body.id)).scrollIntoView();

            this.selectNote(response.body);

            history.pushState(null, null, "/notes/" + response.body.id)

        } catch {
            AppToasts.error('Что-то пошло не так');
        }
    }

    async createSubNote(insertLink=false) {

        if (!this.state.selectedNote) {
            return
        }

        try {
            const response = await AppNoteRequests.AddSubNote(this.state.selectedNote.id, AppUserStore.state.JWT, AppUserStore.state.csrf);

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, response.headers['x-csrf-token']);

            console.log(response.body)

            const subNote = {
                id: response.body.id,
                title: "Новая заметка"
            }

            console.log(subNote)

            this.state.selectedNoteChildren = [...this.state.selectedNoteChildren, subNote]

            await this.saveNote({
                id: this.state.selectedNote.id,
                note: AppNoteStore.state.note
            })

            if (insertLink) {
                const block = AppNoteStore.state.note.blocks[AppNoteStore.state.dropdownPos.blockId];
                block.type = 'div';
                block.content = undefined;
                block.attributes = {
                    note: subNote
                };

                console.log(block)

                AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                    blockId: AppNoteStore.state.dropdownPos.blockId,
                    newBlock: block
                });

                AppDispatcher.dispatch(NoteStoreActions.REMOVE_CURSOR)
            }


        } catch (e) {
            console.log(e.message)
            AppToasts.error('Что-то пошло не так');
        }
    }

    async uploadImage({noteId, blockId, file}) {
        try {
            const response = await AppNoteRequests.UploadFile(noteId, file, AppUserStore.state.JWT, AppUserStore.state.csrf);

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, response.headers.get('x-csrf-token'));

            if (response.status == 200) {
                const body = await response.json();
                const attachId = body.path.split('.')[0];
                const url = await AppNoteRequests.GetImage(attachId, AppUserStore.state.JWT, AppUserStore.state.csrf);
                const block = AppNoteStore.state.note.blocks[blockId];

                if (block.attributes != null) {
                    block.attributes['id'] = attachId;
                    block.attributes['src'] = url;
                }

                block.content = undefined;

                AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                    blockId: blockId,
                    newBlock: block
                });
            } else {
                AppToasts.error('Не удалось загрузить изображение ' + file.name);
                const block: BlockNode = AppNoteStore.state.note.blocks[blockId];
                block.content = [];
                block.attributes = null;
                block.type = 'div';
                AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                    blockId: blockId,
                    newBlock: block
                });
            }
        } catch {
            AppToasts.error('Что-то пошло не так');
        }
    }

    async fetchImage({blockId, imageId}) {
        const url = await AppNoteRequests.GetImage(imageId, AppUserStore.state.JWT, AppUserStore.state.csrf);

        const block = AppNoteStore.state.note.blocks[blockId];
        if (block.attributes != null) {
            block.attributes['src'] = url;
        }

        block.content = undefined;

        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
            blockId: blockId,
            newBlock: block
        });
    }

    async uploadFile({noteId, blockId, file, fileName}) {
        try {
            const response = await AppNoteRequests.UploadFile(noteId, file, AppUserStore.state.JWT, AppUserStore.state.csrf);

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, response.headers.get('x-csrf-token'));

            if (response.status == 200) {
                const block = AppNoteStore.state.note.blocks[blockId];
                const body = await response.json();
                const attachId = body.path.split('.')[0];

                if (block.attributes != null) {
                    block.attributes['attach'] = attachId;
                    block.attributes['fileName'] = fileName;
                }

                block.content = undefined;

                AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                    blockId: blockId,
                    newBlock: block
                });
            } else {
                AppToasts.error('Не удалось прикрепить файл ' + file.name);
                const block: BlockNode = AppNoteStore.state.note.blocks[blockId];
                block.content = [];
                block.attributes = null;
                block.type = 'div';
                AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK, {
                    blockId: blockId,
                    newBlock: block
                });
            }
        } catch {
            AppToasts.error('Что-то пошло не так');
        }
    }

    async downloadFile({id, name}) {
        await AppNoteRequests.GetFile(id, name, AppUserStore.state.JWT, AppUserStore.state.csrf);
    }

    startFetching() {
        this.SetState(state => ({
            ...state,
            notes: [],
            fetching: true
        }));
    }
}

export const NotesActions = {
    SELECT_NOTE: 'SELECT_NOTE',
    FETCH_NOTE: 'FETCH_NOTE',
    SEARCH_NOTES: 'SEARCH_NOTES',
    LOAD_NOTES: 'LOAD_NOTES',
    CLOSE_NOTE: 'CLOSE_NOTE',
    EXIT: 'EXIT_NOTES_PAGE',
    OPEN_DELETE_NOTE_DIALOG: 'OPEN_DELETE_NOTE_DIALOG',
    CLOSE_DELETE_NOTE_DIALOG: 'CLOSE_DELETE_NOTE_DIALOG',
    DELETE_NOTE: 'DELETE_NOTE',
    SAVE_NOTE: 'SAVE_NOTE',
    CREATE_NEW_NOTE: 'CREATE_NEW_NOTE',
    UPLOAD_IMAGE: 'UPLOAD_IMAGE',
    UPLOAD_FILE: 'UPLOAD_FILE',
    DOWNLOAD_FILE: 'DOWNLOAD_FILE',
    FETCH_IMAGE: 'FETCH_IMAGE',
    START_FETCHING: 'START_FETCHING',
    OPEN_NOTE: 'OPEN_NOTE',
    CREATE_SUB_NOTE: "CREATE_SUB_NOTE"
};

export const AppNotesStore = new NotesStore();