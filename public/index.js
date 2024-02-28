import {config} from '/config.js';
import {Header} from "./src/components/header/header.js";
import {Wrapper} from "./src/components/wrapper/wrapper.js";
import {Footer} from "./src/components/footer/footer.js";
import {AppUserStore} from "./src/stores/user/userStore.js";
import {router} from "./src/modules/router.js";

const root = document.getElementById('root');

AppUserStore.registerEvents();


const wrapper = new Wrapper(root, config.wrapper);
wrapper.render();

router.init(wrapper.self, config);

const header = new Header(root, config.header);
header.render();

const footer = new Footer(root, config.footer);
footer.render()

