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



        this.observer = new MutationObserver(() => {
            const schema = [];
            this.editable.childNodes.forEach(node => {
                schema.push(toJson(node));
            })

            // TODO: вызывать callback сохранения заметки
            // 
            onChange(schema)
        });

        this.observer.observe(this.editable, {
            childList: true,
            characterData: true,
            characterDataOldValue: true,
            attributes: true,
            attributeOldValue: true,
            subtree: true
        });

        document.onselectionchange = () => {
            const isInEditor = (node: Node) => {
                if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).contentEditable === 'true') {
                    return true
                } else if (node.parentElement == null) {
                    return false
                } else {
                    return isInEditor(node.parentElement);
                }
            }

            const scanTree = (node: HTMLElement) => {
                if ('cursor' in node.dataset) {
                    const cursor = node.dataset.cursor;
                    const regex = /([a-zA]+)-([\d]+)/;

                    const matches = regex.exec(cursor);

                    if (matches[1] === AppUserStore.state.username) {
                        delete node.dataset.cursor;
                    }
                }

                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE) {
                        scanTree(child as HTMLElement);
                    }
                })
            }

            const selection = document.getSelection();

            const isEditor = isInEditor(selection.anchorNode);
            console.log(selection)

            if (isEditor) {
                const elem : HTMLElement = selection.anchorNode.nodeType === Node.ELEMENT_NODE ?
                    selection.anchorNode as HTMLElement
                    : selection.anchorNode.parentElement;

                scanTree(this.editable);

                elem.dataset.cursor = `${AppUserStore.state.username}-${selection.anchorOffset}`;
            }
            
            if (!selection.isCollapsed && isEditor) {
                this.tippyCallbacks.open(selection.anchorNode.parentElement);
            } else {
                
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
    }
}
