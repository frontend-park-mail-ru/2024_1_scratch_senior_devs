import "../../../build/notes.js";
import {Note} from "../../components/note/note.js";
import Page from "../page.js";
import {NoteEditor} from "../../components/note-editor/note-editor.js";
import {AppNotesStore} from "../../stores/notes/notesStore.js";
import {SearchBar} from "../../components/search-bar/search-bar.js";
import {AppEventMaker} from "../../modules/eventMaker.js";
import {NotesStoreEvents} from "../../stores/notes/events.js";

export default class NotesPage extends Page {
    #notesContainer;

    #notesEditor;

    #searchBar;

    /**
     * Рендеринг списка заметок
     * @param notes
     * @param reset {boolean}
     */
    #renderNotes = (notes, reset=false) => {
        if (reset){
            this.#notesContainer.innerHTML = "";
        }

        if (notes.length > 0) {
            for (const note of notes) {
                const noteClass = new Note(this.#notesContainer, note);
                noteClass.render();
            }

            let hasVerticalScrollbar = this.#notesContainer.scrollHeight > this.#notesContainer.clientHeight;
            hasVerticalScrollbar && this.createObserver();
        } else if (AppNotesStore.notes.length === 0) {
            const h3 = document.createElement("h1");
            h3.innerText = "Не найдено ни одной заметки ;(";
            h3.className = "not-found-label";
            this.#notesContainer.append(h3);
        }
    };

    /**
     * Инициализация обсервера для динамической пагинации заметок
     */
    createObserver() {
        const intersectionObserver = new IntersectionObserver(entries => {
            const lastNote = entries[0];

            if (lastNote.intersectionRatio === 0) {
                return;
            }

            intersectionObserver.unobserve(lastNote.target);

            AppNotesStore.loadNotes();
        });

        intersectionObserver.observe(this.#notesContainer.querySelector(".note-container:last-child"));
    }

    /**
     * Очистка мусора
     */
    remove() {
        AppNotesStore.clean();
        this.#searchBar.remove();
        this.#notesEditor.remove();
        this.#unsubscribeFromEvents();
        super.remove();
    }

    /**
     * Срабатывает при клике по заметке из списка
     * @param note {Element}
     */
    selectNote = (note) => {
        AppNotesStore.unselectNote();
        AppNotesStore.fetchNote(note);
        note.classList.add("selected");
    };

    /**
     * Подписка на ивенты
     */
    #subscribeToEvents() {
        AppEventMaker.subscribe(NotesStoreEvents.NOTES_RECEIVED, this.#renderNotes);
    }

    /**
     * Отписка от ивентов
     */
    #unsubscribeFromEvents() {
        AppEventMaker.subscribe(NotesStoreEvents.NOTES_RECEIVED, this.#renderNotes);
    }

    /**
     * Рендеринг страницы
     */
    render() {
        this.parent.insertAdjacentHTML(
            "afterbegin",
            window.Handlebars.templates["notes.hbs"](this.config)
        );

        this.#notesContainer = document.querySelector(".notes-container");

        this.#notesContainer.addEventListener("click", (e) => {
            let id = undefined;

            if (e.target.matches(".note-container")) {
                id = e.target.id;
            } else if (e.target.matches(".note-container *")) {
                id = e.target.parentNode.id;
            }

            if (id !== undefined) {
                this.self.classList.add("selected");
                this.selectNote(document.getElementById(id));
            }
        });

        this.#searchBar = new SearchBar(this.self.querySelector("aside"), this.config.searchBar);
        this.#searchBar.render();

        this.#notesEditor = new NoteEditor(this.self, this.config.noteEditor);
        this.#notesEditor.render();

        document.title = "Заметки";
        this.#subscribeToEvents();

        AppNotesStore.init();
    }
}