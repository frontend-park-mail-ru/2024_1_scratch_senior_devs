import {fromJson, inspectBlocks, PluginProps, toJson} from "./Plugin";

export class Editor {
    private readonly editable: HTMLElement;
    private observer: MutationObserver;
    private insertionObserver: MutationObserver;
    private seveCallback

    constructor(note: PluginProps[], parent: HTMLElement) {
        this.editable = document.createElement('div');
        this.editable.contentEditable = "true";

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

            console.log(schema);
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
