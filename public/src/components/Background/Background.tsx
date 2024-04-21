import {ScReact} from '@veglem/screact';
import './Background.sass';
import {NotesPage} from '../../pages/Notes';

export class Background extends ScReact.Component<any, any> {
    render() {
        return (
            <div className="background">
                <div className="background__parallax"></div>
                <div className="background__item background__item-stars"></div>
                <div className="background__item background__item-stars2"></div>
                <div className="background__item background__item-stars3"></div>
            </div>
        );
    }
}