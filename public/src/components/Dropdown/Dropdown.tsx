import {ScReact} from '@veglem/screact';
import './Dropdown.sass';
import {Img} from '../Image/Image';
import {AppDispatcher} from '../../modules/dispatcher';
import {NoteStoreActions} from '../../modules/stores/NoteStore';
import {AppNotesStore, NotesActions} from '../../modules/stores/NotesStore';
import {MAX_ATTACH_SIZE} from '../../utils/consts';
import {AppToasts} from '../../modules/toasts';

export class Dropdown extends ScReact.Component<any, any> {
    state = {
        selected: null
    };

    private ref;

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            this.props.onClose();
        }
    };

    handleClickOutside = (e) => {
        if (this.props.open && !this.ref.contains(e.target)) {
            this.props.onClose();
        }
    };

    handleOnHover = (id:string) => {
        

        this.setState(state => ({
            ...state,
            selected: id
        }));
    };

    handleOnClick = (id:string) => {
        

        let tag = id;
        let attr = null;
        let content = [];
        if (id === 'bullet-list') {
            attr = {};
            attr.ul = true;
            tag = 'div';
        } else if (id === 'numbered-list') {
            attr = {};
            attr.ol = true;
            tag = 'div';
        } else if (id === 'todo-list') {
            attr = {};
            attr.todo = true;
            tag = 'div';
        } else if (id === 'image') {
            tag = 'img';
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.jpg,.png,.jpeg';
            fileInput.hidden = true;
            this.ref.append(fileInput);
            fileInput.onchange = (e: InputEvent) => {
                fileInput.remove();

                const file = (e.target as HTMLInputElement).files[0]
                if (file.size < MAX_ATTACH_SIZE) {
                    AppDispatcher.dispatch(NotesActions.UPLOAD_IMAGE, {
                        file: file,
                        noteId: AppNotesStore.state.selectedNote.id,
                        blockId: this.props.blockId
                    });
                    AppDispatcher.dispatch(NoteStoreActions.REMOVE_CURSOR, {});
                } else {
                    AppToasts.error('Фото слишком большое');
                }
            };
            fileInput.click();
            attr = {};
            attr.src = '';
            content = undefined;
        } else if (id === 'document') {
            tag = 'div';
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.hidden = true;
            fileInput.accept = ".mp4,.mp3,.wav,.gif,.jpeg,.webp,.jpg,.png,.mp4, .pdf"
            this.ref.append(fileInput);
            fileInput.onchange = (e) => {
                fileInput.remove();
                const file = (e.target as HTMLInputElement).files[0]
                if (file.size < MAX_ATTACH_SIZE) {
                    AppDispatcher.dispatch(NotesActions.UPLOAD_FILE, {
                        file: file,
                        noteId: AppNotesStore.state.selectedNote.id,
                        blockId: this.props.blockId,
                        fileName: (e.target as HTMLInputElement).files[0].name
                    });
                    AppDispatcher.dispatch(NoteStoreActions.REMOVE_CURSOR, {});
                } else {
                    AppToasts.error('Файл слишком большой');
                }
            };
            fileInput.click();
            attr = {};
            attr.file = '';
            attr.fileName = '';
            content = undefined;
        } else if (id === 'youtube') {
            this.props.openYoutubeDialog();
        } else if (id === "note") {
            this.props.openAddNoteLinkDialog()
        }

        AppDispatcher.dispatch(NoteStoreActions.CHANGE_BLOCK_TYPE, {
            blockId: this.props.blockId,
            tag: tag,
            attributes: attr,
            content: content
        });

        // moveCursorUpAndDown(this.props.blockId)

        AppDispatcher.dispatch(NoteStoreActions.MOVE_CURSOR, {
            blockId: this.props.blockId,
            pos: 0
        });

        this.props.onClose();
    };

    render() {
        const data = [
            {
                id: 'h1',
                icon: 'h1.svg',
                title: 'Заголовок 1',
                desc: 'Заголовок первого уровня'
            },
            {
                id: 'h2',
                icon: 'h2.svg',
                title: 'Заголовок 2',
                desc: 'Заголовок второго уровня'
            },
            {
                id: 'h3',
                icon: 'h3.svg',
                title: 'Заголовок 3',
                desc: 'Заголовок третьего уровня'
            },
            {
                id: 'image',
                icon: 'image.svg',
                title: 'Картинка',
                desc: 'Загрузите фото с вашего компьютера'
            },
            {
                id: 'document',
                icon: 'document.svg',
                title: 'Файл',
                desc: 'Загрузите файл с вашего компьютера'
            },
            {
                id: 'youtube',
                icon: 'youtube.svg',
                title: 'Видео',
                desc: 'Вставьте ссылку на видео из ютуба'
            },
            {
                id: 'note',
                icon: 'note.svg',
                title: 'Заметка',
                desc: 'Вставьте ссылку на заметку'
            },
            // {
            //     id: "text",
            //     icon: "text.svg",
            //     title: "Текст",
            //     desc: "Просто текст"
            // },
            {
                id: "todo-list",
                icon: "todo.svg",
                title: "To-do список",
                desc: "Отслеживайте ваши задачи"
            },
            {
                id: 'bullet-list',
                icon: 'bullet-list.svg',
                title: 'Ненумерованный список',
                desc: 'Простой ненумерованный список'
            },
            {
                id: 'numbered-list',
                icon: 'numbered-list.svg',
                title: 'Нумерованный список',
                desc: 'Простой нумерованный список'
            },
        ];

        return (
            <div className={'dropdown ' + (this.props.open ? '' : 'close')} style={this.props.style} ref={ref => this.ref = ref}>
                <div className="listbox">
                    {data.map(item => (
                        <div className={'list-item ' + (this.state.selected == item.id ? 'selected' : '')} onmouseenter={() => this.handleOnHover(item.id)} onclick={() => this.handleOnClick(item.id)}>
                            <div className="icon-container">
                                <Img src={item.icon} />
                            </div>
                            <div className="info-container">
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}