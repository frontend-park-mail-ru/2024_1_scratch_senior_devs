import {config} from '/config.js';
import MainPage from './src/pages/main-page/main-page.js';
import {Header} from "./src/components/header/heaader.js";
import LoginPage from "./src/pages/login/login.js";
import RegisterPage from "./src/pages/register/register.js";

const root = document.getElementById('root');
console.log('root');

const wrapper = document.createElement("div")
wrapper.id = "wrapper"
root.appendChild(wrapper)

let page = 'main';

function renderHeader() {
    const header = new Header(wrapper, config);
    header.render();
}

const renderMainPage = () => {
    const main = new MainPage(wrapper, config);
    main.render();
};

const renderLoginPage = () => {
    const login = new LoginPage(wrapper, config);
    login.render();
};

const renderRegisterPage = () => {
    const register = new RegisterPage(wrapper, config);
    register.render()
}

const changePage = (href) => {
    console.log("changePage: " + href)
    switch (href) {
        case 'main':
            if (page !== 'main') {
                renderMainPage();
                page = 'main';
            }
            break;
        case 'login':
            if (page !== 'login') {
                renderLoginPage();
                page = 'login';
            }
            break;
        case 'register':
            if (page !== 'register') {
                renderRegisterPage();
                page = 'register';
            }
            break;
        default:
            console.log('undefined click');
    }
};

const listenClick = (e) => {
    e.preventDefault();
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href').replace('/', '');
    changePage(href);
};

window.addEventListener('click', listenClick);


renderHeader();
renderMainPage();

