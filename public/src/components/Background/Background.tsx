import {ScReact} from '@veglem/screact';
import './Background.sass';

export class Background extends ScReact.Component<any, any> {
    render() {
        return (
            <div className="background">
                <div className="parallax-bg"></div>
                <div id="stars"></div>
                <div id="stars2"></div>
                <div id="stars3"></div>
            </div>
        );
    }
}