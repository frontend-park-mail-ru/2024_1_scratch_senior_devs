import {ScReact} from '@veglem/screact';
import {VDomNode} from '@veglem/screact/dist/vdom';
import {Img} from '../../components/Image/Image';
import "./style.sass"
import {ShiningButton} from '../../components/ShiningButton/ShinigButton';
import {AppRouter} from '../../modules/router';

class NotFoundPage extends ScReact.Component<{err: any}, any> {
    render(): VDomNode {
        return (
            <div className="not-found-page-wrapper">
                <Img className="rocket" src="rocket.svg" />
                <Img className="earth"  src="earth.svg" />
                <Img className="moon"  src="moon.svg" />
                <div className="astronaut-container">
                    <Img className="astronaut" src="astronaut.svg" />
                </div>
                <div className="text-container">
                    <Img src="404.svg"></Img>
                    <h3>Похоже вы</h3>
                    <h2>потерялись в космосе</h2>
                    <ShiningButton label="Вернуться назад" onClick={() => AppRouter.go("/")}/>
                </div>
            </div>
        );
    }
}

export default NotFoundPage