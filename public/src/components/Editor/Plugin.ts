import {AppUserStore} from "../../modules/stores/UserStore";
import {parseNoteTitle, setCursorAtNodePosition, truncate} from "../../modules/utils";
import {AppNotesStore, NotesActions} from "../../modules/stores/NotesStore";
import {AppNoteRequests} from "../../modules/api";
import {AppDispatcher} from "../../modules/dispatcher";
import {AppToasts} from "../../modules/toasts";
import {AppNoteStore} from "../../modules/stores/NoteStore";

interface EditorPlugin {
    pluginName: string;
    type: PluginType
    content: PluginContent
    checkPlugin: (node: Node) => boolean
    toJson: (node: Node) => PluginProps
    fromJson: (props: PluginProps) => Node
    insertNode: (innerContent?: Node[], ...args: any) => Node | undefined
    onInsert?: (node: Node) => void
    onChange?: (node: Node) => void
}

export interface PluginProps extends Record<string, string | number | boolean | object> {
    pluginName: string,
    children?: PluginProps[]
}

type PluginType = "block" | "inline";

type PluginContent = "block" | "inline" | "none" | string;

export const defaultPlugins: EditorPlugin[] = [
    {
        pluginName: 'text',
        type: "inline",
        content: "none",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.TEXT_NODE && node.parentElement?.contentEditable !== "true";
        },
        toJson: (node: Node) => {
            const props: TextProps = {
                pluginName: 'text',
                content: node.textContent
            }
            return props;
        },
        fromJson: (props: TextProps) => {
            return document.createTextNode(props.content);
        },
        insertNode: undefined
    },
    {
        pluginName: 'textBlock',
        type: "block",
        content: "none",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.TEXT_NODE && node.parentElement?.contentEditable === "true";
        },
        toJson: (node: Node) => {
            const props: TextProps = {
                pluginName: "textBlock",
                content: node.textContent
            }
            return props;
        },
        fromJson: (props: TextProps) => {
            return document.createTextNode(props.content);
        },
        insertNode: undefined,
        onInsert: (node: Node) => {
            const div = document.createElement('div');
            div.innerHTML = node.textContent;
            (node as Text).replaceWith(div);
            document.getSelection().setPosition(div, 1);
        }
    },
    {
        pluginName: 'div',
        type: "block",
        content: "inline",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'DIV'
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: 'div',
                children: children
            };
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const div = document.createElement('div');
            children.forEach(child => {
                div.append(child);
            })
            return div;
        },
        insertNode: undefined
    },
    {
        pluginName: 'br',
        type: "inline",
        content: "none",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BR';
        },
        toJson: (node: Node) => {
            return {
                pluginName: 'br'
            }
        },
        fromJson: (props: PluginProps) => {
            return document.createElement('br');
        },
        insertNode: undefined
    },
    {
        pluginName: 'ol',
        type: 'block',
        content: 'li|ol|ul|todo',
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'OL';
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: 'ol',
                children: children
            };
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const ol = document.createElement('ol');
            children.forEach(child => {
                ol.append(child);
            })
            return ol;
        },
        insertNode: (innerContent) => {
            const ol = document.createElement('ol');
            const  li = document.createElement('li');
            if (innerContent == null || innerContent.length === 0) {
                li.append(document.createElement('br'));
            } else {
                innerContent.forEach(val => {
                    li.append(val);
                })
            }
            ol.append(li);
            return ol;
        }
    },
    {
        pluginName: 'li',
        type: 'block',
        content: 'inline',
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'LI' &&
                !("selected" in (node as HTMLElement).dataset);
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: 'li',
                children: children
            };
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const li = document.createElement('li');
            children.forEach(child => {
                li.append(child);
            })
            return li;
        },
        insertNode: undefined
    },
    {
        pluginName: 'ul',
        type: 'block',
        content: 'li|ol|ul|todo',
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'UL';
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: 'ul',
                children: children
            };
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const ul = document.createElement('ul');
            children.forEach(child => {
                ul.append(child);
            })
            return ul;
        },
        insertNode: (innerContent) => {
            const ul = document.createElement('ul');
            const  li = document.createElement('li');
            if (innerContent == null || innerContent.length === 0) {
                li.append(document.createElement('br'));
            } else {
                innerContent.forEach(val => {
                    li.append(val);
                })
            }
            ul.append(li);
            return ul;
        }
    },
    {
        pluginName: 'todo',
        type: 'block',
        content: 'li-todo|ol|ul|todo',
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'UL' &&
                'type' in (node as HTMLElement).dataset &&
                (node as HTMLElement).dataset.type === 'todo';
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: 'todo',
                children: children
            };
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const ul = document.createElement('ul');
            ul.dataset.type = 'todo'
            children.forEach(child => {
                ul.append(child);
            })
            const observer = new MutationObserver(records => {
                records.forEach(record => {
                    if (record.addedNodes.length > 0 && record.addedNodes[0].nodeType === 1 &&
                        (record.addedNodes[0] as HTMLElement).tagName === 'LI') {
                        (record.addedNodes[0] as HTMLElement).dataset.selected = 'false';
                        (record.addedNodes[0] as HTMLElement).onclick = (e) => {
                            if (document.getSelection().anchorOffset !== 0) {
                                return;
                            }
                            if ((e.target as HTMLElement).dataset.selected === 'false') {
                                (e.target as HTMLElement).dataset.selected = 'true';
                            } else {
                                (e.target as HTMLElement).dataset.selected = 'false';
                            }
                        }
                    }
                })
            })
            observer.observe(ul, {
                childList: true
            })
            return ul;
        },
        insertNode: (innerContent) => {
            const ul = document.createElement('ul');
            ul.dataset.type = 'todo';
            const  li = document.createElement('li');
            li.dataset.selected = "false"
            if (innerContent == null || innerContent.length === 0) {
                li.append(document.createElement('br'));
            } else {
                innerContent.forEach(val => {
                    li.append(val);
                })
            }
            li.onclick = (e) => {
                if (document.getSelection().anchorOffset !== 0) {
                    return;
                }
                if (li.dataset.selected === 'false') {
                    li.dataset.selected = 'true';
                } else {
                    li.dataset.selected = 'false';
                }
            }
            ul.append(li);
            const observer = new MutationObserver(records => {
                records.forEach(record => {
                    if (record.addedNodes.length > 0 && record.addedNodes[0].nodeType === 1 &&
                        (record.addedNodes[0] as HTMLElement).tagName === 'LI') {
                        (record.addedNodes[0] as HTMLElement).dataset.selected = 'false';
                        (record.addedNodes[0] as HTMLElement).onclick = (e) => {
                            if (document.getSelection().anchorOffset !== 0) {
                                return;
                            }
                            if ((e.target as HTMLElement).dataset.selected === 'false') {
                                (e.target as HTMLElement).dataset.selected = 'true';
                            } else {
                                (e.target as HTMLElement).dataset.selected = 'false';
                            }
                        }
                    }
                })
            })
            observer.observe(ul, {
                childList: true
            })
            return ul;
        },
    },
    {
        pluginName: 'li-todo',
        type: 'block',
        content: 'inline',
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'LI' &&
                ("selected" in (node as HTMLElement).dataset) &&
                ((node as HTMLElement).dataset.selected === 'true' ||
                (node as HTMLElement).dataset.selected === 'false');
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: 'li-todo',
                selected: (node as HTMLElement).dataset.selected,
                children: children
            };
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const li = document.createElement('li');
            children.forEach(child => {
                li.append(child);
            })
            li.dataset.selected = (props.selected as string);
            li.onclick = (e) => {
                if (document.getSelection().anchorOffset !== 0) {
                    return;
                }
                if (li.dataset.selected === 'false') {
                    li.dataset.selected = 'true';
                } else {
                    li.dataset.selected = 'false';
                }
            }
            return li;
        },
        insertNode: undefined,
        onInsert: node => {
            (node as HTMLElement).onclick = () => {
                if (document.getSelection().anchorOffset !== 0) {
                    return;
                }
                if ((node as HTMLElement).dataset.selected === 'false') {
                    (node as HTMLElement).dataset.selected = 'true';
                } else {
                    (node as HTMLElement).dataset.selected = 'false';
                }
            }
        }
    },
    {
        pluginName: 'header',
        type: "block",
        content: "inline",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (
                (node as HTMLElement).tagName === 'H1' ||
                (node as HTMLElement).tagName === 'H2' ||
                (node as HTMLElement).tagName === 'H3' ||
                (node as HTMLElement).tagName === 'H4' ||
                (node as HTMLElement).tagName === 'H5' ||
                (node as HTMLElement).tagName === 'H6'
            )
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            const tag = (node as HTMLElement).tagName;
            return {
                pluginName: 'header',
                size: tag,
                children: children
            };
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const header = document.createElement((props.size as string));
            children.forEach(child => {
                header.append(child);
            })
            return header;
        },
        insertNode: (innerContent, ...args) => {
            const header = document.createElement(args[0]);
            innerContent.forEach(child => {
                header.append(child);
            })
            if (innerContent.length == 0) {
                header.append(document.createElement('br'));
            }
            return header;
        }
    },
    {
        pluginName: "bold",
        type: "inline",
        content: "inline",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === "B";
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: "bold",
                children: children
            }
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const b = document.createElement('b');
            children.forEach(child => {
                b.append(child);
            })
            return b;
        },
        insertNode: (innerContent) => {
            document.execCommand('bold', false, null);
            return null;
        }
    },
    {
        pluginName: "img",
        type: "block",
        content: "none",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE &&
                (node as HTMLElement).tagName === "IMG";
        },
        toJson: (node: Node) => {
            return {
                pluginName: 'img',
                imgId: (node as HTMLImageElement).dataset.imgid
            }
        },
        fromJson: (props: PluginProps) => {
            const img = document.createElement('img');
            img.contentEditable = 'false';
            img.width = 500
            img.src = '/assets/add.svg'; //todo: default image url // скелетоны нужныыыыыы
            img.dataset.imgid = props['imgId'] as string;

            AppNoteRequests.GetImage(props['imgId'] as string, AppUserStore.state.JWT, AppUserStore.state.csrf).then(url => {
                img.src = url;
            })
            return img;
        },
        insertNode: (innerContent, ...args) => {
            const img = document.createElement('img');
            img.contentEditable = 'false';
            img.width = 500
            img.src = '/assets/add.svg'; //todo: default image url  // скелетоны нужныыыыыы аааааааа
            img.dataset.imgid = args[0];

            AppNoteRequests.GetImage(args[0], AppUserStore.state.JWT, AppUserStore.state.csrf).then(url => {
                img.src = url;
            })
            return img;
        }
    },
    {
        pluginName: "underline",
        type: "inline",
        content: "inline",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === "U";
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: "underline",
                children: children
            }
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const b = document.createElement('u');
            children.forEach(child => {
                b.append(child);
            })
            return b;
        },
        insertNode: (innerContent) => {
            document.execCommand('underline', false, null);
            return null;
        }
    },
    {
        pluginName: "strike",
        type: "inline",
        content: "inline",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && ((node as HTMLElement).tagName === "STRIKE" || (node as HTMLElement).tagName === "S");
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: "strike",
                children: children
            }
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const b = document.createElement('s');
            children.forEach(child => {
                b.append(child);
            })
            return b;
        },
        insertNode: (innerContent) => {
            document.execCommand('strikeThrough', false, null);
            return null;
        }
    },
    {
        pluginName: "italic",
        type: "inline",
        content: "inline",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === "I";
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: "italic",
                children: children
            }
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const b = document.createElement('i');
            children.forEach(child => {
                b.append(child);
            })
            return b;
        },
        insertNode: (innerContent) => {
            document.execCommand('italic', false, null);
            return null;
        }
    },
    {
        pluginName: 'span',
        type: "inline",
        content: "inline",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'SPAN' && (node as HTMLElement).style.backgroundColor == ""
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: 'span',
                children: children
            };
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const div = document.createElement('span');
            children.forEach(child => {
                div.append(child);
            })
            return div;
        },
        insertNode: undefined,
        onInsert: (node: Node) => {
            const first = node.firstChild;
            (node as HTMLElement).replaceWith(first);
            document.getSelection().setPosition(first, 1);
        }
    },
    {
        pluginName: "file",
        type: "block",
        content: "none",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE &&
                (node as HTMLElement).tagName === "BUTTON" &&
                'fileid' in (node as HTMLElement).dataset &&
                'filename' in (node as HTMLElement).dataset;
        },
        toJson: (node: Node) => {
            return {
                pluginName: 'file',
                fileId: (node as HTMLElement).dataset.fileid,
                fileName: (node as HTMLElement).dataset.filename
            }
        },
        fromJson: (props: PluginProps) => {
            return RenderAttach(props['fileName'] as string,  props['fileId'] as string);
        },
        insertNode: (innerContent, ...args) => {
            return RenderAttach(args[0][1],  args[0][0]);
        }
    },
    {
        pluginName: "subnote",
        type: "block",
        content: "none",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE &&
                (node as HTMLElement).tagName === "BUTTON" &&
                'noteid' in (node as HTMLElement).dataset;
        },
        toJson: (node: Node) => {
            return {
                pluginName: 'subnote',
                noteId: (node as HTMLImageElement).dataset.noteid
            }
        },
        fromJson: (props: PluginProps) => {
            return RenderSubNote(props['noteId'] as string);
        },
        insertNode: (innerContent, ...args) => {
            return RenderSubNote(args[0][0]);
        }
    },
    {
        pluginName: "youtube",
        type: "block",
        content: "none",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE &&
                (node as HTMLElement).tagName === "IFRAME";
        },
        toJson: (node: Node) => {
            return {
                pluginName: 'youtube',
                src: (node as HTMLImageElement).src
            }
        },
        fromJson: (props: PluginProps) => {
            const img = document.createElement('iframe');
            img.contentEditable = 'false';
            img.src = props.src as string;
            return img;
        },
        insertNode: (innerContent, ...args) => {
            const img = document.createElement('iframe');
            img.contentEditable = 'false';
            img.src = args[0];
            return img;
        }
    },
    {
        pluginName: 'font',
        type: "inline",
        content: "inline",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'FONT'
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: 'font',
                children: children,
                color: (node as HTMLFontElement).color
            };
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const div = document.createElement('font');
            children.forEach(child => {
                div.append(child);
            })
            div.color = props.color as string;
            return div;
        },
        insertNode: undefined,
    },
    {
        pluginName: 'background',
        type: "inline",
        content: "inline",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'SPAN' && (node as HTMLElement).style.backgroundColor != ""
        },
        toJson: (node: Node) => {
            const children: PluginProps[] = [];
            (node as HTMLElement).childNodes.forEach(child => {
                children.push(toJson(child));
            })
            return {
                pluginName: 'background',
                children: children,
                background: (node as HTMLElement).style.backgroundColor
            };
        },
        fromJson: (props: PluginProps) => {
            const children: Node[] = [];
            props.children.forEach(value => {
                children.push(fromJson(value));
            });
            const div = document.createElement('span');
            children.forEach(child => {
                div.append(child);
            })
            div.style.backgroundColor = props.background as string;
            return div;
        },
        insertNode: undefined,
    },
]

export const toJson = (node: Node): PluginProps => {
    let plugin: EditorPlugin;
    defaultPlugins.forEach(value => {
        if (value.checkPlugin(node)) {
            plugin = value;
            return
        }
    })
    if (plugin === undefined) {
        return {
            pluginName: "undefined"
        }
    }
    const json = plugin.toJson(node);
    if (node.nodeType === Node.ELEMENT_NODE) {
        for (const dataKey in (node as HTMLElement).dataset) {
            if (dataKey.startsWith('cursor')) {
                json[dataKey] = (node as HTMLElement).dataset[dataKey];
            }
        }
    }
    return json;
}

export const fromJson = (props: PluginProps) => {
    const isInEditor = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).contentEditable === 'true' && (node as HTMLElement).parentElement.classList.contains("note-body")) {
            return true
        } else if (node.parentElement == null) {
            return false
        } else {
            return isInEditor(node.parentElement);
        }
    }

    let plugin: EditorPlugin;
    defaultPlugins.forEach(value => {
        if (value.pluginName === props.pluginName) {
            plugin = value;
            return
        }
    });
    const node = plugin.fromJson(props);

    for (const propKey in props) {
        if (propKey.startsWith('cursor')) {
            (node as HTMLElement).dataset[propKey] = props[propKey] as string;
        }
    }

    if (`cursor${AppUserStore.state.username}` in props) {
        // const regex = /([a-zA]+)-([\d]+)/;
        // const matches = regex.exec(props.cursor as string);
        

        if (props[`cursor${AppUserStore.state.username}`] === '0') {
            setTimeout(() => {
                setCursorAtNodePosition(node, 0);
                // (node as HTMLElement).click();
                // document.getSelection().setPosition(node, 0);
            })

        } else {
            setTimeout(() => {
                setCursorAtNodePosition(node, Number(props[`cursor${AppUserStore.state.username}`]));
                // (node as HTMLElement).click();
                // document.getSelection().setPosition(node.firstChild, Number(props[`cursor${AppUserStore.state.username}`]));
            })

        }
    }
    return node;
}

export const lastChosenElement: {node?: Node } = {};

export const insertBlockPlugin = (pluginName: string, ...args: any) => {
    let plugin: EditorPlugin;
    defaultPlugins.forEach(val => {
        if (pluginName === val.pluginName) {
            plugin = val;
        }
    });
    // 
    if (plugin === undefined || plugin.insertNode === undefined) {
        return;
    }
    const self: string[] = [plugin.pluginName, plugin.type];
    const anchor = lastChosenElement.node;
    
    const nodeToReplace = findNodeToReplace(anchor, self);
    if (nodeToReplace != null) {
        let childs = [];
        if ((nodeToReplace as Node).nodeType === 3) {
            childs.push(nodeToReplace.textContent);
        } else {
            (nodeToReplace as HTMLElement).childNodes.forEach(value => {
                childs.push(value);
            });
        }
        const newNode = plugin.insertNode([], args);
        (nodeToReplace as HTMLElement).replaceWith(newNode);
        document.getSelection().setPosition(newNode, 0);
    }
}

export const editorOnInsert = (addedNode: Node) => {
    defaultPlugins.forEach(plugin => {
        if (plugin.checkPlugin(addedNode) && plugin.onInsert != null) {
            plugin.onInsert(addedNode)
        }
    });
}

export const editorOnChange = (target: Node) => {
    defaultPlugins.forEach(plugin => {
        if (plugin.checkPlugin(target) && plugin.onChange != null) {
            plugin.onChange(target);
        }
    });
}

// insertInlinePlugin

const getAllowedContent = (content: string) => {
    return content.split('|');
}

const findNodeToReplace = (node: Node, content: string[]) => {
    if ((node as HTMLElement).contentEditable === 'true') {
        return null;
    }
    if (node.parentElement.contentEditable === "true") {
        return node;
    }
    let plugin: EditorPlugin;
    defaultPlugins.forEach(val => {
        if (val.checkPlugin(node.parentElement)) {
            plugin = val;
            return;
        }
    })
    const pluginContent = getAllowedContent(plugin.content);
    for (const nodeStr of content) {
        for (const pluginStr of pluginContent) {
            if (pluginStr === nodeStr) {
                return node;
            }
        }
    }
    return findNodeToReplace(node.parentElement, content);
}

let selectedBlock: HTMLElement;

export const inspectBlocks = () => {
    const findBlock = (node: Node) => {
        if (node == null || (node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === "BODY")) {
            return null;
        }
        if (node.nodeType === node.ELEMENT_NODE && node.parentElement.contentEditable === 'true') {
            return node;
        } else {
            return findBlock(node.parentElement);
        }
    }
    if (selectedBlock != null) {
        selectedBlock.classList.remove('block-chosen');
    }
    selectedBlock = null;
    const block = findBlock(document.getSelection().anchorNode);
    // 
    if (block !== null && block.tagName === 'DIV' && block.textContent === "") {
        block.classList.add('block-chosen');
        selectedBlock = block;
    }
}

document.onselectionchange = () => {
    inspectBlocks();
}

interface TextProps extends PluginProps {
    pluginName: "text" | "textBlock"
    content: string
}

const RenderAttach = (attach_filename:string, attach_id:string) => {
    const attachWrapper = document.createElement('button');
    attachWrapper.className = "attach-wrapper"
    attachWrapper.contentEditable = 'false';
    attachWrapper.dataset.fileid = attach_id; // id аттача
    attachWrapper.dataset.filename = attach_filename; // название аттачи

    const attachContainer = document.createElement("div")
    attachContainer.className = "attach-container"

    const fileExtensionLabel = document.createElement("div")
    fileExtensionLabel.className = "file-extension-label"
    fileExtensionLabel.innerHTML = attach_filename.split('.').at(-1)

    const fileName = document.createElement("span")
    fileName.className = "file-name"
    fileName.innerHTML = truncate(attach_filename, 18)

    attachContainer.appendChild(fileExtensionLabel)
    attachContainer.appendChild(fileName)

    const closeAttachBtnContainer = document.createElement("div")
    closeAttachBtnContainer.className = "close-attach-btn-container"

    const closeBtn = document.createElement("img")
    closeBtn.src = "./src/assets/close.svg"
    closeBtn.className = "close-attach-btn"

    closeBtn.onclick = (e) => {
        e.stopPropagation()
        attachWrapper.remove();
    }

    closeAttachBtnContainer.appendChild(closeBtn)

    attachContainer.appendChild(closeAttachBtnContainer)

    attachWrapper.appendChild(attachContainer)

    attachWrapper.onclick = () => {
        AppNoteRequests.DownloadFile(attach_id as string, attach_filename, AppUserStore.state.JWT, AppUserStore.state.csrf).then()
    }

    return attachWrapper;
}

const RenderSubNote = (subNoteId:string) => {
    const subNoteWrapper = document.createElement("button")
    subNoteWrapper.className = "subnote-wrapper"

    subNoteWrapper.contentEditable = 'false';
    subNoteWrapper.dataset.noteid = subNoteId;

    const subNoteContainer = document.createElement("div")
    subNoteContainer.className = "subnote-container"

    const subNoteTitle = document.createElement("span")
    subNoteTitle.className = "subnote-title"
    // subNoteTitle.innerHTML = subNoteWrapper.dataset.title

    const noteIcon = document.createElement("img")
    noteIcon.src = "./src/assets/note.svg"
    noteIcon.className = "subnote-icon"

    subNoteContainer.appendChild(noteIcon)
    subNoteContainer.appendChild(subNoteTitle)

    const isOwner= AppNotesStore.state.selectedNote.owner_id == AppUserStore.state.user_id

    if (isOwner) {
        const deleteSubNoteBtnContainer = document.createElement("div")
        deleteSubNoteBtnContainer.className = "delete-subnote-btn-container"

        const deleteSubNoteBtn = document.createElement("img")
        deleteSubNoteBtn.src = "./src/assets/trash.svg"
        deleteSubNoteBtn.className = "delete-subnote-btn"

        deleteSubNoteBtnContainer.onclick = (e) => {
            e.stopPropagation()
            subNoteWrapper.remove();

            if (!subNoteWrapper.dataset.deleted) {
                AppDispatcher.dispatch(NotesActions.DELETE_NOTE, {
                    id: subNoteId,
                    redirect: false
                })
            }
        }

        deleteSubNoteBtnContainer.appendChild(deleteSubNoteBtn)
        subNoteContainer.appendChild(deleteSubNoteBtnContainer)
    }

    subNoteWrapper.appendChild(subNoteContainer)

    AppNoteRequests.Get(subNoteId, AppUserStore.state.JWT).then(result => {
        if (result.data.title == null) {
            subNoteTitle.innerHTML = 'Подзаметка'
        }

        //subNoteWrapper.dataset.title = parseNoteTitle(result.data.title)
        subNoteTitle.innerHTML = parseNoteTitle(result.data.title)

    }).catch((e) => {
        subNoteTitle.innerHTML = "Заметка не найдена"
        subNoteWrapper.dataset.deleted = "true"
    });

    let loading = true

    setTimeout(() => {
        loading = false
    }, 1000)

    subNoteWrapper.onclick = () => {
        if (!subNoteWrapper.dataset.deleted) {
            !loading && AppDispatcher.dispatch(NotesActions.OPEN_NOTE, subNoteId)
        } else {
            AppToasts.error("Заметка не найдена")
        }
    }

    return subNoteWrapper
}

