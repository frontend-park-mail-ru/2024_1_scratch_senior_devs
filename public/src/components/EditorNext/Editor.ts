import {defaultPlugins, editorOnChange, editorOnInsert, fromJson, inspectBlocks, PluginProps, toJson} from "./Plugin";

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

                // if (record.type === 'childList' && record.addedNodes.length > 0 && record.addedNodes[0].nodeType === Node.ELEMENT_NODE &&
                //     ((record.addedNodes[0] as HTMLElement).tagName == "DIV" || (record.addedNodes[0] as HTMLElement).tagName == "LI")) {
                //     const observer = new MutationObserver((tests) => {
                //         tests.forEach(test => {
                //             if (test.target.textContent.startsWith('/')) {
                //                 const target = test.target.parentElement as HTMLElement
                //                 dropdown.open(target);
                //             } else {
                //                 dropdown.close();
                //             }
                //         })
                //     })
                //
                //     observer.observe((record.addedNodes[0] as HTMLElement), { characterData: true, subtree: true})
                // }
            })
        });

        this.dropdownObserver.observe(this.editable, {
            childList: true,
            characterData: true,
            // characterDataOldValue: true,
            // attributes: true,
            // attributeOldValue: true,
            subtree: true
        })

        // this.insertionObserver = new MutationObserver((records) => {
        //     records.forEach(record => {
        //         if (record.type === 'childList' && record.addedNodes.length > 0 && record.addedNodes[0].nodeType === Node.TEXT_NODE) {
        //             const div = document.createElement('div');
        //             div.innerHTML = record.addedNodes[0].textContent;
        //             (record.addedNodes[0] as Text).replaceWith(div);
        //             document.getSelection().setPosition(div, 1);
        //         }
        //     })
        // });
        //
        // this.insertionObserver.observe(this.editable, {
        //     childList: true
        // })

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
                this.dropdownCallbacks.open(node.parentElement)
            } else {
                this.dropdownCallbacks.close();
            }
        }
    }

}
