interface EditorPlugin {
    pluginName: string;
    type: PluginType
    content: PluginContent
    checkPlugin: (node: Node) => boolean
    toJson: (node: Node) => PluginProps
    fromJson: (props: PluginProps) => Node
    insertNode: (innerContent?: Node[], ...args: any) => Node | undefined
}

export interface PluginProps extends Record<string, string | number | boolean | object> {
    pluginName: string,
    children?: PluginProps[]
}

type PluginType = "block" | "inline";

type PluginContent = "block" | "inline" | "none" | string;

const defaultPlugins: EditorPlugin[] = [
    {
        pluginName: 'text',
        type: "inline",
        content: "none",
        checkPlugin: (node: Node) => {
            return node.nodeType === node.TEXT_NODE && node.parentElement.contentEditable !== "true";
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
            return node.nodeType === node.TEXT_NODE && node.parentElement.contentEditable === "true";
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
        insertNode: undefined
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
            return node.nodeType === node.ELEMENT_NODE && (node as HTMLElement).tagName === 'UL';
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
                ("selected" in (node as HTMLElement).dataset);
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
        insertNode: undefined
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
            const header = document.createElement((props.tag as string));
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
            return header;
        }
    },
    // {
    //     pluginName: "img",
    //     type: "block",
    //     content: "none",
    //     checkPlugin: (node: Node) => {
    //         return node.nodeType === node.ELEMENT_NODE &&
    //             (node as HTMLElement).tagName === "IMG";
    //     },
    //     toJson: (node: Node) => {
    //
    //     }
    // }
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
    }
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
    return plugin.toJson(node);
}

export const fromJson = (props: PluginProps) => {
    let plugin: EditorPlugin;
    defaultPlugins.forEach(value => {
        if (value.pluginName === props.pluginName) {
            plugin = value;
            return
        }
    });
    return plugin.fromJson(props);
}

export const insertBlockPlugin = (pluginName: string, ...args: any) => {
    let plugin: EditorPlugin;
    defaultPlugins.forEach(val => {
        if (pluginName === val.pluginName) {
            plugin = val;
        }
    });
    console.log(plugin.pluginName)
    if (plugin === undefined || plugin.insertNode === undefined) {
        return;
    }
    const self: string[] = [plugin.pluginName, plugin.type];
    const anchor = document.getSelection().anchorNode;
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
        const newNode = plugin.insertNode(childs, args);
        (nodeToReplace as HTMLElement).replaceWith(newNode);
        document.getSelection().setPosition(newNode, newNode.childNodes.length);
    }
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
    console.log(block);
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
