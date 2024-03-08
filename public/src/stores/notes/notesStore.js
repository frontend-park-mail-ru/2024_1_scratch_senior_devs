import {AppNoteRequests} from "../../modules/ajax.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {NotesStoreEvents} from "./events.js";

class NotesStore {
    #selectedNote;
    #notes;

    get selectedNote() {
        return this.#selectedNote;
    }

    get notes() {
        return this.#notes;
    }

    selectNote(note) {
        this.#selectedNote = note;
    }

    unselectNote() {
        if (this.#selectedNote !== undefined) {
            this.#selectedNote.classList.remove("selected")
        }
    }

    init () {
        AppNoteRequests.GetAll().then(notes => {
            this.#notes = notes;
            AppEventMaker.notify(NotesStoreEvents.NOTES_RECEIVED, notes);
        })
    }

    searchNotes (query) {
        AppNoteRequests.GetAll({title: query}).then(notes => {
            this.#notes = notes;
            AppEventMaker.notify(NotesStoreEvents.NOTES_RECEIVED, notes);
        })
    }
}

export const AppNotesStore = new NotesStore()