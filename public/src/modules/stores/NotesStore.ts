import {BaseStore} from './BaseStore';
import {AppNoteRequests} from '../api';
import {AppUserStore, UserActions} from './UserStore';
import {AppDispatcher} from '../dispatcher';
import {AppToasts} from '../toasts';
import {NoteDataType, NoteType} from "../../utils/types";
import {decode, parseNoteTitle} from "../utils";
import {WebSocketConnection} from "../websocket";
import {AppNoteStore} from "./NoteStore";
import {insertBlockPlugin} from "../../components/Editor/Plugin";

export type NotesStoreState = {
    notes: NoteType[],
    selectedNote: NoteType,
    selectedNoteChildren: any[]
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

    private ws

    constructor() {
        super();
        this.registerEvents();

        window.addEventListener("storage", e => {
            if (e.key == "selectedNote") {
                let note = JSON.parse(localStorage.getItem("selectedNote"))

                if (note && this.state.selectedNote && this.state.selectedNote.id == note.id) {
                    const updatedNote = this.state.selectedNote
                    updatedNote.data = {
                        title: note.note.title,
                        content: note.note.blocks
                    }

                    this.SetState(state => ({
                        ...state,
                        selectedNote: updatedNote
                    }))
                }
            }
        })
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
                    await this.deleteNote(action.payload);
                    break;
                case NotesActions.SAVE_NOTE:
                    await this.saveNote(action.payload);
                    break;
                case NotesActions.CREATE_NEW_NOTE:
                    await this.createNewNote();
                    break;
                case NotesActions.CREATE_SUB_NOTE:
                    await this.createSubNote();
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
                case NotesActions.CREATE_TAG:
                    await this.createTag(action.payload)
                    break
                case NotesActions.REMOVE_TAG:
                    await this.removeTag(action.payload)
                    break
                case NotesActions.ADD_COLLABORATOR:
                    await this.addCollaborator(action.payload)
                    break
                case NotesActions.GET_TAGS:
                    await this.fetchTags()
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
        localStorage.setItem("selectedNote", null)

        const notes = this.state.notes;
        notes.forEach((note, index) => {
            if (note.id == this.state.selectedNote.id) {
                notes[index] = this.state.selectedNote;
            }
        });

        this.SetState(s=>({
            ...s,
            selectedNote: undefined,
            notes: notes
        }));

        this.ws?.close()
    }

    async fetchNote (id:string) {
        try {

            const note = await AppNoteRequests.Get(id, AppUserStore.state.JWT);

            this.selectNote(note);

        } catch (e) {
            AppToasts.error('Заметка не найдена');
        }
    }

    async fetchSubNote (noteId) {
        try {
            const note = await AppNoteRequests.Get(noteId, AppUserStore.state.JWT);

            const data = {
                id: noteId,
                title: parseNoteTitle(note.data.title)
            }

            this.SetState(state => ({
                ...state,
                selectedNoteChildren: state.selectedNoteChildren.map(subnote => subnote.id != note.id ? subnote : data)
            }))

            // this.state.selectedNoteChildren = this.state.selectedNoteChildren.map(subnote => subnote.id != note.id ? subnote : data)

        } catch {
            this.SetState(state => ({
                ...state,
                selectedNoteChildren: state.selectedNoteChildren.filter(note => note.id != noteId)
            }))
        }
    }

    selectNote (note:NoteType) {
        this.SetState(state => ({
            ...state,
            selectedNote: note,
            selectedNoteChildren: note.children
        }));

        this.ws = new WebSocketConnection(`note/${note.id}/subscribe_on_updates`)

        this.ws.onMessage((event) => {
            let data = JSON.parse(event.data)
            if (data.username == AppUserStore.state.username) {
                return
            }

            const noteData = decode(data.message_info) as NoteDataType
            if (JSON.stringify(noteData) == JSON.stringify(this.state.selectedNote.data)) {
                return
            }

            const updatedNote = this.state.selectedNote
            updatedNote.data = noteData

            this.SetState(state => ({
                ...state,
                selectedNote: updatedNote
            }));
        })
    }

    async openNote(id:string) {
        try {
            const note = await AppNoteRequests.Get(id, AppUserStore.state.JWT);

            this.selectNote(note);

            history.pushState(null, null, '/notes/' + id)

        } catch (e) {
            
            AppToasts.error('Заметка не найдена');
        }
    }

    async init () {
        await this.fetchNotes(true);
        await this.fetchTags()
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

            this.SetState(state => ({
                ...state,
                fetching: false,
                notes: reset ? notes : state.notes.concat(notes)
            }));

        } catch {
            AppToasts.error('Что-то пошло не так');
        }
    }

    async deleteNote({id, redirect=true}:{id:string, redirect:boolean}) {
        try {
            const {csrf} = await AppNoteRequests.Delete(id, AppUserStore.state.JWT, AppUserStore.state.csrf);

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, csrf);

            if (!redirect) {
                return
            }

            this.SetState(state => ({
                ...state,
                notes: state.notes.filter(item => item.id !== id)
            }));

            if (this.state.selectedNote.parent != "00000000-0000-0000-0000-000000000000") {
                await this.openNote(this.state.selectedNote.parent)
                return
            }

            this.closeNote();

            history.pushState(null, null, '/notes');

            AppToasts.info('Заметка успешно удалена');

        } catch {
            AppToasts.error('Что-то пошло не так');
        }
    }

    async saveNote(data) {
        try {
            const {csrf} = await AppNoteRequests.Update(data, AppUserStore.state.JWT, AppUserStore.state.csrf);

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, csrf);

            
            

            localStorage.setItem("selectedNote", JSON.stringify(data))

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

            this.selectNote(response.body);

            document.querySelector(".notes-container").scroll({top:0,behavior:'smooth'});

            // document.getElementById(String(response.body.id)).scrollIntoView(true);

            history.pushState(null, null, "/notes/" + response.body.id)

        } catch {
            AppToasts.error('Что-то пошло не так');
        }
    }

    async createSubNote() {

        if (!this.state.selectedNote) {
            return
        }

        try {
            const {status, csrf, subnote_id} = await AppNoteRequests.AddSubNote(this.state.selectedNote.id, AppUserStore.state.JWT, AppUserStore.state.csrf);

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, csrf);

            const subNote = {
                id: subnote_id,
                title: "Новая заметка"
            }

            this.state.selectedNoteChildren = [...this.state.selectedNoteChildren, subNote]

            console.log(subnote_id)

            insertBlockPlugin('subnote', subnote_id);

        } catch (e) {
            
            AppToasts.error('Что-то пошло не так');
        }
    }

    async uploadImage({noteId, file}) {
        try {
            const response = await AppNoteRequests.UploadFile(noteId, file, AppUserStore.state.JWT, AppUserStore.state.csrf);

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, response.headers.get('x-csrf-token'));

            if (response.status == 200) {
                const body = await response.json();
                const attachId = body.path.split('.')[0];
                const url = await AppNoteRequests.GetImage(attachId, AppUserStore.state.JWT, AppUserStore.state.csrf);

            } else {
                AppToasts.error('Не удалось загрузить изображение ' + file.name);
            }
        } catch {
            AppToasts.error('Что-то пошло не так');
        }
    }

    async fetchImage({blockId, imageId}) {
        await AppNoteRequests.GetImage(imageId, AppUserStore.state.JWT, AppUserStore.state.csrf);
    }

    async uploadFile({noteId, file, fileName}) {
        try {
            const response = await AppNoteRequests.UploadFile(noteId, file, AppUserStore.state.JWT, AppUserStore.state.csrf);

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, response.headers.get('x-csrf-token'));

            if (response.status != 200) {
                AppToasts.error('Не удалось прикрепить файл ' + file.name);
            }

        } catch {
            AppToasts.error('Что-то пошло не так');
        }
    }

    async downloadFile({id, name}) {
        await AppNoteRequests.DownloadFile(id, name, AppUserStore.state.JWT, AppUserStore.state.csrf);
    }

    startFetching() {
        this.SetState(state => ({
            ...state,
            notes: [],
            fetching: true
        }));
    }

    async createTag(tag:string) {
        const {note, status, csrf} = await AppNoteRequests.AddTag(this.state.selectedNote.id, tag, AppUserStore.state.JWT, AppUserStore.state.csrf)

        AppDispatcher.dispatch(UserActions.UPDATE_CSRF, csrf);

        this.SetState(state => ({
            ...state,
            selectedNote: note
        }))
    }

    async removeTag(tag:string) {
        const {note, status, csrf} = await AppNoteRequests.RemoveTag(this.state.selectedNote.id, tag, AppUserStore.state.JWT, AppUserStore.state.csrf)

        AppDispatcher.dispatch(UserActions.UPDATE_CSRF, csrf);

        this.SetState(state => ({
            ...state,
            selectedNote: note
        }))
    }

    addCollaborator = async ({note_id, username}) => {
        try {
            const {status, csrf} = await AppNoteRequests.AddCollaborator(note_id, username, AppUserStore.state.JWT, AppUserStore.state.csrf)

            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, csrf);

            if (status == 204) {
                AppToasts.success("Приглашение успешно отправлено")
            } else {
                AppToasts.success("Пользователя не существует")
            }

        } catch {
            AppToasts.error("Что-то пошло не так")
        }
    }

    fetchTags = async () => {
        try {
            const response = await AppNoteRequests.GetTags(AppUserStore.state.JWT)


        } catch {
            AppToasts.error("Что-то пошло не так")
        }
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
    CREATE_SUB_NOTE: "CREATE_SUB_NOTE",
    CREATE_TAG: "CREATE_TAG",
    REMOVE_TAG: "REMOVE_TAG",
    ADD_COLLABORATOR: "ADD_COLLABORATOR",
    GET_TAGS: "GET_TAGS"
};

export const AppNotesStore = new NotesStore();