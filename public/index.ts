import {renderDOM} from '@veglem/screact/dist/render';
import {ScReact} from '@veglem/screact';
import {App} from './src/App';
import './index.sass';
import {Survey} from "./src/components/Survey/Survey";

if (window.location.pathname === '/survey') {
    renderDOM('root', ScReact.createComponent(Survey, {
        surveys: [
            {
                id: "1",
                title: "Как вам наш сервис?",
                type: 'CSAT',
            },
            {
                id: "1",
                title: "Как вам наш редактор?",
                type: 'CSAT',
            },
            {
                id: "1",
                title: "Как вам наша главная страница?",
                type: 'NPS',
            }
        ],
        key: 'modal'
    }));
} else {
    renderDOM('root', ScReact.createComponent(App, {}));
}



// if (process.env.NODE_ENV === 'production') {
//     if ('serviceWorker' in navigator) {
//         navigator.serviceWorker.register('./sw.js')
//             .then(() => navigator.serviceWorker.ready.then((worker) => {
//                 // @ts-ignore
//                 worker.sync.register('syncdata');
//             }));
//     }
// }
//

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => navigator.serviceWorker.ready.then((worker) => {
            // @ts-ignore
            worker.sync.register('syncdata');
        }));
}
