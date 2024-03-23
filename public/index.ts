import {renderDOM} from "@veglem/screact/dist/render";
import {ScReact} from "@veglem/screact";
import {App} from "./src/App";
import "./index.sass"

renderDOM('root', ScReact.createComponent(App, {}));
