import {config} from '/config.js';
import {Header} from "./src/components/header/header.js";
import {Wrapper} from "./src/components/wrapper/wrapper.js";
import {AppUserStore} from "./src/stores/user/userStore.js";
import {router} from "./src/modules/router.js";
import {toasts} from "./src/modules/toasts.js";

const root = document.getElementById('root');

AppUserStore.registerEvents();

const wrapper = new Wrapper(root, config.wrapper);
wrapper.render();

const header = new Header(root, config.header);
header.render();

router.init(wrapper.self, config);


toasts.init(wrapper.self);