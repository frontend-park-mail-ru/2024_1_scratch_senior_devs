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
import {NotesActions} from './stores/NotesStore';
import {AppDispatcher} from './dispatcher';
import NotFoundPage from '../pages/Error';
import {NoteType} from "../utils/types";
import {SharedNotePage} from "../pages/SharedNote";
import {AppUserStore} from "./stores/UserStore";
import {AppSharedNoteRequests} from "./api";

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
        this.pages['404'] = {page: NotFoundPage };
    };

    public handlePopState = () => {
        
        const path = this.normalizeURL(window.location.pathname)

        let isAuth = AppUserStore.state.isAuth;

        if (path.includes('notes/')) {
            const noteId = path.split('/').at(-1);

            if (isAuth) {
                AppSharedNoteRequests.Get(noteId).then(note => {
                    AppDispatcher.dispatch(NotesActions.SELECT_NOTE, note);
                }).catch(() => {
                    AppDispatcher.dispatch(NotesActions.FETCH_NOTE, noteId);
                });
            } else {
                AppSharedNoteRequests.Get(noteId).then(note => {
                    this.openSharedNotePage(note)
                }).catch(() => {
                    AppRouter.go("/")
                });
            }

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

        const path = this.normalizeURL(raw) // TODO: "/" -> empty string

        let page: RouterMapValue = this.pages[path];

        if (path.includes('notes/')) {
            page = this.pages['notes'];
        }

        console.log("history.pushState")
        console.log(path)
        console.log(raw)
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

    public openSharedNotePage (note:NoteType) {
        history.pushState(null, null, "/notes/" + note.id);

        this.setState(s => ({
            ...s,
            currPage: SharedNotePage,
            PageProps: {note: note}
        }));
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