import {ScReact} from '@veglem/screact';

export class CarouselItem extends ScReact.Component<any, any> {
    render() {
        return (
            <div className="carousel-item">
                <h3 className="carousel-item__title">{this.props.item.title}</h3>
                <div className="carousel-item__description">{this.props.item.description}</div>
            </div>
        );
    }
}