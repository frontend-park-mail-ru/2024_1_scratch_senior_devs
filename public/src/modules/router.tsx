import {Component} from "@veglem/screact/dist/component";
import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {MainPage} from "../pages/main";
import {MainLoader} from "../pages/main/loader";
import {Skeleton} from "../pages/skeleton/skeleton";
import {ErrorPage} from "../pages/ErrorPage/errorPage";

type routerState = {
    currPage: {new(): Component<any, any> }
    PageProps: any
}

export class Router extends ScReact.Component<any, routerState> {
    private pages: Map<string, {page: {new(): Component<any, any> }, loader: () => Promise<any>}>

    state = {
        currPage: Skeleton,
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
        this.go(path);
    }

    private initPages = () => {
        this.pages['/'] = {page: MainPage, loader: MainLoader}

    }

    public go(path: string): void {
        const page: {page: {new(): Component<any, any> }, loader: () => Promise<any>} = this.pages[path];

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



        this.setState(s => ({
            ...s,
            currPage: Skeleton
        }));

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
    }

    render(): VDomNode {
        return (
            ScReact.createComponent(this.state.currPage, this.state.PageProps)
        );
    }
}

export let AppRouter: Router = undefined