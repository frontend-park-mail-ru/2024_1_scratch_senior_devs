import {fromJson, PluginProps, pluginSettings} from "./Plugin";

export class Viewer {
    private readonly editable: HTMLElement;

    constructor(note: PluginProps[],
                parent: HTMLElement) {
        pluginSettings.isEditable = false;
        this.editable = document.createElement('div');
        this.editable.id = "note-editor-inner";

        note.forEach(val => {
            this.editable.append(fromJson(val));
        });

        parent.append(this.editable);
    }
}