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


    /**
     * Возвращает список заметок
     * @returns {any}
     */
    get notes() {
        return this.#notes;
    }

    /**
     * Получение данных выбранной заметки
     * @param note {HTMLElement}
     */
    fetchNote(note) {
        AppNoteRequests.Get(note.id).then(data => {
            this.#selectedNoteDOM = note;
            this.#selectedNoteData = data;
            AppEventMaker.notify(noteEvents.NOTE_SELECTED, data);
        });
    }

    /**
     * Отключает стиль у заметки
     */
    unselectNote() {
        this.#selectedNoteDOM?.classList.remove("selected");
    }

    /**
     * Инициализация списка заметок
     */
    init () {
        AppNoteRequests.GetAll().then(notes => {
            this.#notes = notes;
            AppEventMaker.notify(NotesStoreEvents.NOTES_RECEIVED, notes);
        });
    }

    /**
     * Обнуляет оффсет когда пользователь поикдает страницу с заметками
     */
    clean (){
        this.#offset = 0;
    }

    /**
     * Поиск заметок по названию
     * @param query {string} поисковой запрос
     */
    searchNotes (query) {
        this.#query = query;
        this.#offset = 0;

        AppNoteRequests.GetAll({title: query, offset: this.#offset, count: this.#count}).then(notes => {
            this.#notes = notes;
            AppEventMaker.notify(NotesStoreEvents.NOTES_RECEIVED, notes, true);
        });
    }

    /**
     * Подгрузка новых заметок
     */
    loadNotes() {
        this.#offset += this.#count;

        const params = {
            title: this.#query,
            offset: this.#offset
        };

        AppNoteRequests.GetAll(params).then(notes => {
            this.#notes += notes;
            AppEventMaker.notify(NotesStoreEvents.NOTES_RECEIVED, notes);
        });
    }
}

export const AppNotesStore = new NotesStore();