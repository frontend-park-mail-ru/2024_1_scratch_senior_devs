import {config} from '/config.js';
import MainPage from './src/pages/main-page/main-page.js';
import {Header} from "./src/components/header/header.js";
import LoginPage from "./src/pages/login/login.js";
import RegisterPage from "./src/pages/register/register.js";
import {AppUserStore} from "./src/stores/user/userStore.js";

const root = document.getElementById('root');
console.log('root');

const wrapper = document.createElement("div")
wrapper.id = "wrapper"
root.appendChild(wrapper)

export const userInfo = {
    login: '',
    username: '',
    isAuthorized: false,
};

AppUserStore.registerEvents();

const currentUrl = window.location.href.split("/").slice(-1)[0];

const currentPage = {};

let page = '';

function renderHeader() {
    const header = new Header(root, config, userInfo.isAuthorized);
    header.render();
}

const renderMainPage = () => {
    const main = new MainPage(wrapper, config, userInfo);
    if (currentPage.page !== undefined){
        currentPage.page.remove();
    }
    currentPage.page = main;
    main.render();
};

const renderLoginPage = () => {
    const login = new LoginPage(wrapper, config);
    if (currentPage.page !== undefined){
        currentPage.page.remove();
    }
    currentPage.page = login;
    login.render();
};

const renderRegisterPage = () => {
    const register = new RegisterPage(wrapper, config);
    if (currentPage.page !== undefined){
        currentPage.page.remove();
    }
    currentPage.page = register;
    register.render()
}

const changePage = (href) => {
    switch (href) {
        case '':
            if (page !== 'main') {
                renderMainPage();
                page = 'main';
                history.pushState(null, null, '/')
            }
            break;
        case 'main':
            if (page !== 'main') {
                renderMainPage();
                page = 'main';
                history.pushState(null, null, '/' + page)
            }
            break;
        case 'login':
            if (page !== 'login') {
                renderLoginPage();
                page = 'login';
                history.pushState(null, null, '/' + page)
            }
            break;
        case 'register':
            if (page !== 'register') {
                renderRegisterPage();
                page = 'register';
                history.pushState(null, null, '/' + page)
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
changePage(currentUrl);

