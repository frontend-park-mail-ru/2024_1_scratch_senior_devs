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

export class Editor {
    private readonly editable: HTMLElement;
    private observer: MutationObserver;
    private insertionObserver: MutationObserver;
    private seveCallback
    private dropdownObserver: MutationObserver
    private dropdownCallbacks: {open: (elem: HTMLElement) => void, close: () => void}

    constructor(note: PluginProps[], parent: HTMLElement, dropdown: {open: (elem: HTMLElement) => void, close: () => void }, onChange: (schema: PluginProps[]) => void) {
        this.dropdownCallbacks = dropdown;
        this.addPlugins();

        this.editable = document.createElement('div');
        this.editable.contentEditable = "true";

        this.dropdownObserver = new MutationObserver((records) => {
            console.log("zapisi", records)
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
            // console.log(schema);
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
