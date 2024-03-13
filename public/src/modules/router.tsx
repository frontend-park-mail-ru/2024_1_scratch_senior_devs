import {Component} from "@veglem/screact/dist/component";
import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {HomePage} from "../pages/home";
import {ErrorPage} from "../pages/ErrorPage/errorPage";
import {AuthPage} from "../pages/Auth";

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
        this.pages['/'] = {page: HomePage}
        this.pages['/auth'] = {page: AuthPage}
    }

    public go(path: string): void {
        const page: {page: {new(): Component<any, any> }, loader: () => Promise<any>} = this.pages[path];

        console.log(page)

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
            ScReact.createComponent(this.state.currPage, this.state.PageProps)
        );
    }
}

export let AppRouter: Router = undefined