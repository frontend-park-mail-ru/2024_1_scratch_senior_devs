import {AppNoteRequests} from "../../modules/ajax.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {NotesStoreEvents} from "./events.js";
import {noteEvents} from "../../pages/notes/events.js";

class NotesStore {
    #selectedNoteData;
    #selectedNoteDOM;

    #notes;

    #query = "";
    #offset = 0;
    #count = 10;


    get notes() {
        return this.#notes;
    }

    fetchNote(note) {
        AppNoteRequests.Get(note.id).then(data => {
            this.#selectedNoteDOM = note
            this.#selectedNoteData = data
            AppEventMaker.notify(noteEvents.NOTE_SELECTED, data);
        })
    }

    unselectNote() {
        if (this.#selectedNoteDOM !== undefined) {
            this.#selectedNoteDOM.classList.remove("selected")
        }
    }

    init () {
        AppNoteRequests.GetAll().then(notes => {
            this.#notes = notes;
            AppEventMaker.notify(NotesStoreEvents.NOTES_RECEIVED, notes);
        })
    }

    searchNotes (query) {
        this.#query = query;
        this.#offset = 0;

        AppNoteRequests.GetAll({title: query, offset: this.#offset, count: this.#count}).then(notes => {
            this.#notes = notes;
            AppEventMaker.notify(NotesStoreEvents.NOTES_RECEIVED, notes, true);
        })
    }

    loadNotes() {
        this.#offset += this.#count;

        AppNoteRequests.GetAll({title: this.#query, offset: this.#offset}).then(notes => {
            this.#notes += notes;
            AppEventMaker.notify(NotesStoreEvents.NOTES_RECEIVED, notes);
        })
    }
}

export const AppNotesStore = new NotesStore()