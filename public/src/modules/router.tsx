import {Component} from "@veglem/screact/dist/component";
import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {HomePage} from "../pages/home";
import {ErrorPage} from "../pages/ErrorPage/errorPage";
import {AuthPage} from "../pages/Auth";
import {NotesPage} from "../pages/Notes";
import {Header} from "../components/Header/header";
import {Background} from "../components/Background/Background";
import {Toasts} from "./toasts";
import NotesPageSkeleton from "../pages/Notes/Skeleton";
import Skeleton from "../pages/Notes/Skeleton";

type routerState = {
    currPage: {new(): Component<any, any> }
    PageProps: any
}

export class Router extends ScReact.Component<any, routerState> {
    private pages: Map<string, {page: {new(): Component<any, any> }, loader: () => Promise<any>}>

    state = {
        currPage: HomePage,
        PageProps: {}
    }

    constructor() {
        super();
        AppRouter = this;

        this.pages = new Map
        this.initPages();
    }

    componentDidMount() {
        const path = window.location.pathname;
        window.addEventListener("popstate", () => {
            this.go(window.location.pathname);
        })
        this.go(path);
    }

    private initPages = () => {
        this.pages['/'] = {page: HomePage, pageProps: {}}
        this.pages['/login'] = {page: AuthPage, pageProps: {needAuth: false}}
        this.pages['/register'] = {page: AuthPage, pageProps: {needAuth: false}}
        this.pages['/notes'] = {page: NotesPage, pageProps: {needAuth: true}}
    }

    public go(path: string): void {
        const page: {page: {new(): Component<any, any> }, pageProps: object, loader: () => Promise<any>} = this.pages[path];

        // TODO: не пускать на страницу с заметками неавторизированного пользователя. Добавить скилетоны
        // if (page.pageProps.needAuth && !AppUserStore.state.isAuth) {
        //     console.log("zsdf")
        //     this.go("/")
        //     return
        // }

        history.pushState({ path }, "", path);

        if (page === undefined) {
            this.setState(s => ({
                ...s,
                currPage: ErrorPage,
                PageProps: {
                    err: "404 NotFound"
                }
            }))
            return
        }

        if (page.loader !== undefined) {
            page.loader().then((props) => {
                this.setState(s => ({
                    ...s,
                    currPage: page.page,
                    PageProps: props
                }));

            }).catch((err) => {
                this.setState(s => ({
                    ...s,
                    currPage: ErrorPage,
                    PageProps: {
                        err: err
                    }
                }));
            })
        } else {
            this.setState(s => ({
                ...s,
                currPage: page.page
            }));
        }
    }

    render(): VDomNode {
        return (
            <div>
                <Toasts />
                <Header currPage={this.state.currPage}/>
                { ScReact.createComponent(this.state.currPage, {...this.state.PageProps, key: this.state.currPage.name}) }
                { (this.state.currPage !== NotesPage && this.state.currPage !== NotesPageSkeleton) ? <Background currPage={this.state.currPage}/> : ""}
            </div>
        );
    }
}

export let AppRouter: Router = undefined