import {config} from '/config.js';
import {Header} from "./src/components/header/header.js";
import {AppUserStore} from "./src/stores/user/userStore.js";
import {router} from "./src/modules/router.js";

const root = document.getElementById('root');
console.log('root');

const wrapper = document.createElement("div")
wrapper.id = "wrapper"

root.appendChild(wrapper)


AppUserStore.registerEvents();



function renderHeader() {
    const header = new Header(root, config.header);
    header.render();
}

renderHeader();


router.init(wrapper, config)


