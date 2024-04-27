import {Component} from '@veglem/screact/dist/component';
import {ScReact} from '@veglem/screact';
import {VDomNode} from '@veglem/screact/dist/vdom';
import {HomePage} from '../pages/Home';
import {AuthPage} from '../pages/Auth';
import {NotesPage} from '../pages/Notes';
import {Header} from '../components/Header/Header';
import {Background} from '../components/Background/Background';
import {Toasts} from './toasts';
import NotesPageSkeleton from '../pages/Notes/Skeleton';
import AuthPageSkeleton from '../pages/Auth/Skeleton';
import {AuthPageLoader} from '../pages/Auth/loader';
import {NotesLoader} from '../pages/Notes/loader';
import {HomePageLoader} from '../pages/Home/loader';
import { NotesActions} from './stores/NotesStore';
import {AppDispatcher} from './dispatcher';
import NotFoundPage from '../pages/Error';
import {CSATPage} from "../pages/CSAT/CSAT";

type routerState = {
    currPage: {new(): Component<any, any> }
    PageProps: any
}

type RouterMapValue = {
    page: {new(): Component<any, any> },
    loader: (path?:string) => Promise<any>,
    skeleton: {new(): Component<any, any> }
}


export class Router extends ScReact.Component<any, routerState> {
    private pages: Map<string, RouterMapValue>;

    state = {
        currPage: HomePage,
        PageProps: {}
    };

    constructor() {
        super();
        AppRouter = this;

        this.pages = new Map;
        this.initPages();
    }

    componentDidMount() {
        const path = this.normalizeURL(window.location.pathname);
        window.addEventListener('popstate', this.handlePopState);

        this.go(path);
    }

    normalizeURL = (path:string) => {
        return path.replace(/\/\/+/g, '/').replace(/^\//, '').replace(/\/$/, '')
    }

    private initPages = () => {
        this.pages[''] = {page: HomePage, loader: HomePageLoader};
        this.pages['login'] = {page: AuthPage, loader: AuthPageLoader, skeleton: AuthPageSkeleton};
        this.pages['register'] = {page: AuthPage, loader: AuthPageLoader, skeleton: AuthPageSkeleton};
        this.pages['notes'] = {page: NotesPage, loader: NotesLoader, skeleton: NotesPageSkeleton};
        this.pages['csat'] = {page: CSATPage};
        this.pages['404'] = {page: NotFoundPage };
    };

    public handlePopState = () => {
        
        const path = this.normalizeURL(window.location.pathname)

        

        if (path.includes('notes/')) {
            const noteId = path.split('/').at(-1);
            AppDispatcher.dispatch(NotesActions.FETCH_NOTE, noteId);
            return;
        }
        
        history.replaceState(null, null, path)

        const page: RouterMapValue = this.pages[path];

        

        if (page.loader !== undefined) {

            this.setState(s => ({
                ...s,
                currPage: page.skeleton
            }));

            page.loader(path).then((props) => {
                this.setState(s => ({
                    ...s,
                    currPage: page.page,
                    PageProps: props
                }));
            }).catch(() => {
                this.setState(s => ({
                    ...s,
                    currPage: NotFoundPage
                }));
            });

        } else {
            this.setState(s => ({
                ...s,
                currPage: page.page
            }));
        }
    }

    public go(raw: string): void {
        
        

        const path = this.normalizeURL(raw)

        

        let page: RouterMapValue = this.pages[path];

        if (path.includes('notes/')) {
            page = this.pages['notes'];
        }

        

        history.pushState(null, null, path);
        if (page === undefined) {
            this.setState(s => ({
                ...s,
                currPage: NotFoundPage
            }));

            history.pushState(null, null, "/404")

            return;
        }

        if (page.loader !== undefined) {

            this.setState(s => ({
                ...s,
                currPage: page.skeleton
            }));

            page.loader(path).then((props) => {
                this.setState(s => ({
                    ...s,
                    currPage: page.page,
                    PageProps: props
                }));


            }).catch(() => {
                this.setState(s => ({
                    ...s,
                    currPage: NotFoundPage
                }));
            });

        } else {
            this.setState(s => ({
                ...s,
                currPage: page.page
            }));
        }

    }

    render(): VDomNode {
        // @ts-ignore
        const isNotesPage = this.state.currPage === NotesPage;

        return (
            <div id={'root'} className={isNotesPage ? 'locked' : ''}>
                <Toasts />
                <Background currPage={this.state.currPage?.name}/>
                <Header currPage={this.state.currPage}/>
                {ScReact.createComponent(this.state.currPage, {...this.state.PageProps, key: this.state.currPage?.name}) }
            </div>
        );
    }
}

export let AppRouter: Router = undefined;