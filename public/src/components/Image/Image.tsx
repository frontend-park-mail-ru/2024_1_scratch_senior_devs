import {ScReact} from "@veglem/screact";

type ImageProps = {
    src?: string,
    className?: boolean,
    onClick?: () => void
}


export class Img extends ScReact.Component<ImageProps, any> {
    render() {
        return (
            <img src={this.props.src} alt="" className={this.props.className ? this.props.className : ""} onclick={this.props.onClick}/>
        )
    }
}