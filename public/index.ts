import {renderDOM} from "@veglem/screact/dist/render";
import {ScReact} from "@veglem/screact";
import {App} from "./src/App";
import "./index.sass"

renderDOM('root', ScReact.createComponent(App, {}));

if ('serviceWorker' in navigator) {
    // Весь код регистрации у нас асинхронный.
    navigator.serviceWorker.register('./sw.ts')
        .then(() => navigator.serviceWorker.ready.then((worker) => {
            console.log("worker.sync")
            worker.sync.register('syncdata');
        }))
        .catch((err) => console.log(err));
}