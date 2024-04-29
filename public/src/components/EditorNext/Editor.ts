import {fromJson, inspectBlocks, PluginProps, toJson} from "./Plugin";

export class Editor {
    private readonly editable: HTMLElement;
    private observer: MutationObserver;
    private insertionObserver: MutationObserver;
    private seveCallback
    private dropdownObserver: MutationObserver

    constructor(note: PluginProps[], parent: HTMLElement, dropdown: {open: (elem: HTMLElement) => void, close: () => void }, onChange: (schema: PluginProps[]) => void) {
        this.editable = document.createElement('div');
        this.editable.contentEditable = "true";

        this.dropdownObserver = new MutationObserver((records) => {
            console.log(records)
            records.forEach(record => {
                if (record.type === 'childList' && record.addedNodes.length > 0 && record.addedNodes[0].nodeType === Node.ELEMENT_NODE &&
                    ((record.addedNodes[0] as HTMLElement).tagName == "DIV" || (record.addedNodes[0] as HTMLElement).tagName == "LI")) {
                    console.log('test')
                    const observer = new MutationObserver((tests) => {

                        tests.forEach(test => {
                            if (test.target.textContent.startsWith('/')) {
                                dropdown.open((test.target.parentElement as HTMLElement));
                            } else {
                                dropdown.close();
                            }
                        })
                    })

                    observer.observe((record.addedNodes[0] as HTMLElement), { characterData: true, subtree: true})

                    // openDropdown()
                }
            })
        });

        this.dropdownObserver.observe(this.editable, {childList: true})

        this.insertionObserver = new MutationObserver((records) => {
            records.forEach(record => {
                if (record.type === 'childList' && record.addedNodes.length > 0 && record.addedNodes[0].nodeType === Node.TEXT_NODE) {
                    const div = document.createElement('div');
                    div.innerHTML = record.addedNodes[0].textContent;
                    (record.addedNodes[0] as Text).replaceWith(div);
                    document.getSelection().setPosition(div, 1);
                }
            })
        });

        this.insertionObserver.observe(this.editable, {
            childList: true
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
}
