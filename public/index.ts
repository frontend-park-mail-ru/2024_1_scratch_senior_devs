import {renderDOM} from '@veglem/screact/dist/render';
import {ScReact} from '@veglem/screact';
import {App} from './src/App';
import './index.sass';
import '@veglem/ui-kit/dist/main.css';

renderDOM('root', ScReact.createComponent(App, {}));

if (process.env.NODE_ENV === 'production') {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => navigator.serviceWorker.ready.then((worker) => {
                // @ts-ignore
                worker.sync.register('syncdata');
            }));
    }
}

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./sw.js')
//         .then(() => navigator.serviceWorker.ready.then((worker) => {
//             // @ts-ignore
//             worker.sync.register('syncdata');
//         }));
// }
