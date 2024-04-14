import {ScReact} from '@veglem/screact';
import './Card.sass';

export class Card extends ScReact.Component<any, any> {
    render() {
        return (
            <div className="card">
                <img src={this.props.icon} alt="" className="card__icon"/>
                <h3 className="card__title">{this.props.title}</h3>
                <span className="card__content">{this.props.description}</span>
            </div>
        );
    }
}