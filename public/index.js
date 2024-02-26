import {config} from '/config.js';
import {Header} from "./src/components/header/header.js";
import {Wrapper} from "./src/components/wrapper/wrapper.js";
import {Footer} from "./src/components/footer/footer.js";
import {AppUserStore} from "./src/stores/user/userStore.js";
import {router} from "./src/modules/router.js";

const root = document.getElementById('root');

AppUserStore.registerEvents();


function renderHeader() {
    const header = new Header(root, config.header);
    header.render();
}

function renderFooter() {
    const footer = new Footer(root, config.footer);
    footer.render()
}

function renderWrapper() {
    const wrapper = new Wrapper(root, config.wrapper);
    wrapper.render();

    router.init(wrapper.self, config);
}


renderWrapper();
renderHeader();
renderFooter();


