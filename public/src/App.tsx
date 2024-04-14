import {ScReact} from '@veglem/screact';
import {Router} from './modules/router';
import './utils/reset.sass';
import './utils/fonts.sass';
import {AppToasts} from './modules/toasts';

export class App extends ScReact.Component<any, any> {
    componentDidMount() {
        window.addEventListener('online', () =>
            AppToasts.info("Соединение восстановлено")
        );

        window.addEventListener('offline', () =>
            AppToasts.info("Потеряно соединение с интернетом")
        );
    }

    render() {
        return(
            <Router></Router>
        );
    }
}