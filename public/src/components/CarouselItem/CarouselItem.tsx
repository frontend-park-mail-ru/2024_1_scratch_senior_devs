import {ScReact} from "@veglem/screact";

export class CarouselItem extends ScReact.Component<any, any> {
    render() {
        return (
            <div className="carousel-item">
                <h3 className="carousel-item-title">{this.props.item.title}</h3>
                <div className="carousel-item-description">{this.props.item.description}</div>
            </div>
        )
    }
}