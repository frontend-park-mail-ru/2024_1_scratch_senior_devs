type Elem = ElemNode | TextNode;

type ElemNode = {
    styles: Record<string, string>
    content: Elem[]
}

type TextNode = {
    content: string
}

const BuildTree = (node: Node) : Elem => {
    if (node.nodeName === "#text") {
        return {content: node.textContent}
    } else {
        const children = Array<Elem>();
        node.childNodes.forEach(child => {
            children.push(BuildTree(child));
        })
        const element = node as HTMLElement;
        const styles: Record<string, string> = {}
        for (const style in element.style) {
            styles[style] = element.style[style];
        }
        return {content: children, styles: styles}
    }
}

// const FlatTree = (root: Elem) : Elem[] => {
//
// }