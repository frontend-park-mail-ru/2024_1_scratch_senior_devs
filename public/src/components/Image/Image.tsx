import {ScReact} from '@veglem/screact';

type ImageProps = {
    src?: string,
    className?: boolean,
    onClick?: (e) => void
}


export class Img extends ScReact.Component<ImageProps, any> {
    render() {
        return (
            <img src={'./src/assets/' + this.props.src} alt="" className={this.props.className ? this.props.className : ''} onclick={(e) => this.props.onClick && this.props.onClick(e)}/>
        );
    }
}