import {
    defaultPlugins,
    editorOnChange,
    editorOnInsert,
    fromJson,
    inspectBlocks,
    lastChosenElement,
    PluginProps,
    toJson
} from "./Plugin";
import {AppUserStore} from "../../modules/stores/UserStore";
import {getCaretPosition} from "../../modules/utils";
import {debounce} from "../../utils/debauncer";

export class Editor {
    private readonly editable: HTMLElement;
    private observer: MutationObserver;
    private dropdownObserver: MutationObserver
    private dropdownCallbacks: {open: (elem: HTMLElement) => void, close: () => void}
    private tippyCallbacks: {open: (elem: HTMLElement) => void, close: () => void}

    constructor(note: PluginProps[],
                parent: HTMLElement,
                dropdown: {open: (elem: HTMLElement) => void, close: () => void },
                onChange: (schema: PluginProps[]) => void,
                tippy: {open: (elem: HTMLElement) => void, close: () => void}) {
        this.dropdownCallbacks = dropdown;
        this.tippyCallbacks = tippy;
        this.addPlugins();

        this.editable = document.createElement('div');
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

        this.observer = new MutationObserver((records) => {
            if (records.every((record) => {return record.type === 'attributes'})) {
                return;
            }
            if (records.some(record => {return record.type === 'characterData'})) {
                selectionCallback();
            }
            setTimeout(() => {
                const schema = [];
                this.editable.childNodes.forEach(node => {
                    schema.push(toJson(node));
                })
                console.log(schema)
                onChange(schema)
            }, 10)

        });

        this.observer.observe(this.editable, {
            childList: true,
            characterData: true,
            characterDataOldValue: true,
            attributes: true,
            attributeOldValue: true,
            subtree: true
        });

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
                if (`cursor${AppUserStore.state.username}` in node.dataset) {
                    delete node.dataset[`cursor${AppUserStore.state.username}`];
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

                elem.dataset[`cursor${AppUserStore.state.username}`] = `${getCaretPosition(elem)}`;

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

        document.onselectionchange = debounce(selectionCallback, 500)

        document.onclick = (e) => {
            if (!document.querySelector(".tippy-container").contains(e.target as Node)) {
                this.tippyCallbacks.close();
            }
        }
    }

    addPlugins = () => {
        const index = defaultPlugins.findIndex((plugin => {
            return plugin.pluginName === 'text';
        }));
        defaultPlugins[index].onInsert = (node: Node) => {
            const parentPlugin = defaultPlugins.find(plug => {
                return plug.checkPlugin(node.parentElement);
            });
            if ((parentPlugin.pluginName === 'div' || parentPlugin.pluginName === 'li' || parentPlugin.pluginName === 'li-todo') && node.textContent.startsWith('/')) {
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
            if (node.textContent.startsWith('/')) {
                lastChosenElement.node = node;
                this.dropdownCallbacks.open(node as HTMLElement)
            }
        }
    }
}
