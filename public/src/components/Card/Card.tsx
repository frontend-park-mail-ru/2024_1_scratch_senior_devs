import {ScReact} from '@veglem/screact';
import './Card.sass';

export class Card extends ScReact.Component<any, any> {
    render() {
        return (
            <div className="card">
                <img src={this.props.icon} alt=""/>
                <h3>{this.props.title}</h3>
                <span>{this.props.description}</span>
            </div>
        );
    }
}