import {ScReact} from '@veglem/screact';
import {VDOMAttributes} from '@veglem/screact/dist/vdom';

export const jsx = (tag: any, { children, ...props}) => {

    if (children === undefined) {
        children = [];
    }

    if (typeof tag !== 'string') {
        if ('key1' in props) {
            props.key = props.key1;
        } else {
            props.key = tag.name;
        }
        return ScReact.createComponent(tag, props as { [x: string]: any; } & { key: string; });
    }

    if ('key1' in props) {
        props.key = props.key1;
    } else {
        props.key = tag;
    }
    if (!Array.isArray(children)) {
        children = [children];
    }

    for (let i = 0; i < children.length; ++i) {
        if (Array.isArray(children[i])) {
            const childs = children[i];
            children.splice(i, 1, ...childs);
        }
        if (typeof children[i] === 'string') {
            children[i] = ScReact.createText(children[i]);
        }
    }
    return ScReact.createElement(tag, props as VDOMAttributes & {key: string}, ...children);
};

export const jsxs = (tag: any, { children, ...props}) => {
    return jsx(tag, {children, ...props});
};