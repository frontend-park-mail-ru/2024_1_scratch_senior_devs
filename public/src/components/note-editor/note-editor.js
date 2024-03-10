import "../../../build/note-editor.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {noteEvents} from "../../pages/notes/events.js";
import {AppNotesStore} from "../../stores/notes/notesStore.js";

export class NoteEditor{
    #parent;
    #config;

    #title;
    #content;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param config {Object} - пропсы
     */
    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    /**
     * Возвращает HTML элемент компонента
     * @returns {HTMLElement}
     */
    get self() {
        return document.getElementById(this.#config.id);
    }

    /**
     * Обработчик выбора заметки
     * @param note {Object}
     */
    #onNoteSelect = (note) => {
        this.#title.innerHTML = "";
        this.#content.innerHTML = "";

        const title = document.createElement("h2");
        title.innerText = note.data.title;
        this.#title.appendChild(title);

        const content = document.createElement("span");
        content.innerText = note.data.content;
        this.#content.appendChild(content);

        this.self.classList.add("active");
        this.#parent.classList.add("active");
    };

    /**
     * Обработчик закрытия окна просмотра заметки
     */
    #closeEditor = () => {
        this.self.classList.remove("active");
        this.#parent.classList.remove("active");

        this.#title.innerText = "";
        this.#content.innerText = "";

        AppNotesStore.unselectNote();
    };

    /**
     * Подписка на события
     */
    #subscribeToEvents() {
        AppEventMaker.subscribe(noteEvents.NOTE_SELECTED, this.#onNoteSelect);
    }

    /**
     * Отписка от событий
     */
    #unsubscribeToEvents() {
        AppEventMaker.unsubscribe(noteEvents.NOTE_SELECTED,this.#onNoteSelect);
    }

    /**
     * Очистка
     */
    remove() {
        this.#unsubscribeToEvents();
    }

    /**
     * Рендеринг компонента
     */
    render() {
        this.#parent.insertAdjacentHTML(
            "beforeend",
            window.Handlebars.templates["note-editor.hbs"](this.#config)
        );

        const closeBtn = this.self.querySelector(".close-editor-btn");
        closeBtn.addEventListener("click", this.#closeEditor);

        this.#title = this.self.querySelector(".note-title");
        this.#content = this.self.querySelector(".note-content");

        this.#subscribeToEvents();
    }
}
