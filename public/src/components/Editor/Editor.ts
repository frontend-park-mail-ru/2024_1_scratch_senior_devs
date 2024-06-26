import {
    defaultPlugins,
    editorOnChange,
    editorOnInsert,
    fromJson,
    inspectBlocks,
    lastChosenElement,
    PluginProps, pluginSettings,
    toJson
} from "./Plugin";
import {AppUserStore} from "../../modules/stores/UserStore";
import {getCaretPosition} from "../../modules/utils";
import {debounce} from "../../utils/debauncer";
import {AppNotesStore} from "../../modules/stores/NotesStore";

export class Editor {
    private readonly editable: HTMLElement;
    private observer: MutationObserver;
    private dropdownObserver: MutationObserver
    private dropdownCallbacks: {open: (elem: HTMLElement) => void, close: () => void}
    private tippyCallbacks: {open: (elem: HTMLElement) => void, close: () => void}

    constructor(
        note: PluginProps[],
        parent: HTMLElement,
        dropdown: {open: (elem: HTMLElement) => void, close: () => void },
        onChange: (schema: PluginProps[]) => void,
        tippy: {open: (elem: HTMLElement) => void, close: () => void}
    ) {

        // TODO: при наборе символов в поисковую строку фокусится редактор заметки (отключить)

        pluginSettings.isEditable = true;
        this.dropdownCallbacks = dropdown;
        this.tippyCallbacks = tippy;
        this.addPlugins();

        document.onpaste = (event) => {
            const isInEditor = (node: Node) => {
                if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).contentEditable === 'true' && !(node as HTMLElement).classList.contains("note-title")) {
                    return true
                } else if (node.parentElement == null) {
                    return false
                } else {
                    return isInEditor(node.parentElement);
                }
            }



            if (isInEditor(document.getSelection().anchorNode)) {
                event.preventDefault();
                let paste = (event.clipboardData).getData("text");
                const selection = window.getSelection();
                if (!selection.rangeCount) return;
                selection.deleteFromDocument();
                selection.getRangeAt(0).insertNode(document.createTextNode(paste));
                selection.collapseToEnd();
            }
        }

        this.editable = document.createElement('div');
        this.editable.id = "note-editor-inner"
        this.editable.contentEditable = "true";

        this.dropdownObserver = new MutationObserver((records) => {
            records.forEach(record => {
                switch (record.type) {
                    case "childList":
                        if (record.addedNodes.length > 0) {
                            editorOnInsert(record.addedNodes[0]);
                        } else if (record.removedNodes.length > 0 && record.removedNodes[0].nodeType === Node.TEXT_NODE) {
                            this.dropdownCallbacks.close();
                        }
                        break;
                    case "characterData":
                        editorOnChange(record.target);
                        break;
                }
            })
        });

        this.dropdownObserver.observe(this.editable, {
            childList: true,
            characterData: true,
            subtree: true
        })

        note.forEach(val => {
            this.editable.append(fromJson(val));
        });

        parent.append(this.editable);

        const selectionCallback = () => {
            const isInEditor = (node: Node) => {
                if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).contentEditable === 'true' && !(node as HTMLElement).classList.contains("note-title")) {
                    return true
                } else if (node.parentElement == null) {
                    return false
                } else {
                    return isInEditor(node.parentElement);
                }
            }

            const scanTree = (node: HTMLElement) => {
                if (`cursor${AppUserStore.state.username}${AppNotesStore.socket_id?.toString().replaceAll('-','').toLowerCase()}` in node.dataset) {
                    delete node.dataset[`cursor${AppUserStore.state.username}${AppNotesStore.socket_id?.toString().replaceAll('-','').toLowerCase()}`];
                }

                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE) {
                        scanTree(child as HTMLElement);
                    }
                })
            }

            const selection = document.getSelection();

            if (!selection.anchorNode) {
                return
            }

            const isEditor = isInEditor(selection.anchorNode)

            if (isEditor) {
                const elem : HTMLElement = selection.anchorNode.nodeType === Node.ELEMENT_NODE ?
                    selection.anchorNode as HTMLElement
                    : selection.anchorNode.parentElement;

                scanTree(this.editable);
                

                elem.dataset[`cursor${AppUserStore.state.username}${AppNotesStore.socket_id?.toString().replaceAll('-','').toLowerCase()}`] = `${getCaretPosition(elem)}`;
                // elem.scrollIntoView();

                // TODO: отоброажать курсоры пользователей при редактировании одной заметки
                // const fakeCaret = document.createElement("div")
                // fakeCaret.className = "fake-caret"
                // elem.append(fakeCaret)

            } else {
                scanTree(this.editable);
            }

            if (!selection.isCollapsed && isEditor) {
                this.tippyCallbacks.open(selection.anchorNode.parentElement);
            } else {
                this.tippyCallbacks.close();
            }
        }

        document.removeEventListener('selectionchange', this.addPlaceHolder)
        document.removeEventListener('selectionchange', debounce(selectionCallback, 500))

        document.addEventListener('selectionchange', this.addPlaceHolder)
        document.addEventListener('selectionchange', debounce(selectionCallback, 500))

        // TODO: убрать задержку при закрытии всплывашки, но оставить задержку при открытии
        // document.onclick = (e) => {
        //     if (!document.querySelector(".tippy-container").contains(e.target as Node)) {
        //         this.tippyCallbacks.close();
        //     }
        // }

        this.observer = new MutationObserver((records) => {
            // if (records.every((record) => {return record.type === 'attributes'})) {
            //     return;
            // }
            if (records.some(record => {return record.type === 'characterData'})) {
                selectionCallback();
            }
            setTimeout(() => {
                const schema = [];
                this.editable.childNodes.forEach(node => {
                    schema.push(toJson(node));
                })

                this.addPlaceHolder();

                if (schema.length > 0 && (schema[schema.length - 1] as PluginProps).pluginName !== 'div' ||
                    ((schema[schema.length - 1] as PluginProps).pluginName === 'div' &&
                        (schema[schema.length - 1] as PluginProps).children?.[0]?.pluginName !== 'br')) {
                    const div = document.createElement('div');
                    div.append(document.createElement('br'));
                    this.editable.append(div);
                }

                onChange(schema)
            })

        });

        this.observer.observe(this.editable, {
            childList: true,
            characterData: true,
            characterDataOldValue: true,
            attributes: true,
            attributeOldValue: true,
            attributeFilter: [
                "data-selected",
                "data-imgid",
                "data-fileid",
                "data-filename",
                "style",
                "data-noteid"
            ],
            subtree: true
        });



        // Заметка открыта с пк и с телефона. Редачится с телефона. С пк курсор начинает скакать
        // Возможное решение: сохранять в дата атрибуты помимо username еще и socket_id чтобы различать девайс с которого редачится заметка
        if (window['mobileCheck']) {
            this.editable.focus()
            this.editable.click()
        }
    }

    getSchema = () => {
        const schema = [];
        this.editable.childNodes.forEach(node => {
            schema.push(toJson(node));
        })
        return schema;
    }

    addPlugins = () => {
        const index = defaultPlugins.findIndex((plugin => {
            return plugin.pluginName === 'text';
        }));
        defaultPlugins[index].onInsert = (node: Node) => {
            const parentPlugin = defaultPlugins.find(plug => {
                return plug.checkPlugin(node.parentElement);
            });
            if ((parentPlugin.pluginName === 'div' || parentPlugin.pluginName === 'li' || parentPlugin.pluginName === 'li-todo') &&
                node.textContent.startsWith('/') &&
                `cursor${AppUserStore.state.username}${AppNotesStore.socket_id?.toString().replaceAll('-','').toLowerCase()}` in node.parentElement.dataset) {

                lastChosenElement.node = node;
                this.dropdownCallbacks.open(node.parentElement)
            } else {
                this.dropdownCallbacks.close();
            }

        }
        const divIndex = defaultPlugins.findIndex((plugin => {
            return plugin.pluginName === 'div';
        }));
        defaultPlugins[divIndex].onInsert = (node: Node) => {
            if (node.textContent.startsWith('/') && `cursor${AppUserStore.state.username}${AppNotesStore.socket_id?.toString().replaceAll('-','').toLowerCase()}` in node.parentElement.dataset) {
                lastChosenElement.node = node;
                this.dropdownCallbacks.open(node as HTMLElement)
            }
        }
        const brIndex = defaultPlugins.findIndex((plugin => {
            return plugin.pluginName === 'br';
        }));
        defaultPlugins[brIndex].onInsert = (node: Node) => {
            if (node.parentElement?.contentEditable === 'true') {
                const div = document.createElement('div');
                div.append(document.createElement('br'));
                (node as HTMLElement).replaceWith(div);
            }
        }
    }

    private lastBlock: HTMLElement = null;

    addPlaceHolder = () => {
        const findBlock = (node: Node): HTMLElement => {
            if (!node || !node.parentElement) {
                return null;
            }
            if (node.parentElement?.contentEditable === 'true' &&
                node.parentElement.parentElement.classList.contains('note-body') &&
                node.nodeType === Node.ELEMENT_NODE &&
                (node as HTMLElement).tagName === "DIV") {
                return node as HTMLElement;
            } else {
                return findBlock(node.parentElement);
            }
        }

        const newBlock = findBlock(document.getSelection().anchorNode);

        this.lastBlock?.classList.remove('blockplaceholder');

        if (newBlock?.textContent === "") {
            newBlock.classList.add('blockplaceholder');
            this.lastBlock = newBlock;
        }
    }
}
