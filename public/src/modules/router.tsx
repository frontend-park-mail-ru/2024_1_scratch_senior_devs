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
        const path = window.location.pathname;
        window.addEventListener('popstate', () => {

            if (path.includes('/notes')) {
                const noteId = window.location.pathname.split('/').at(-1);
                AppDispatcher.dispatch(NotesActions.FETCH_NOTE, noteId);
                return;
            }

            this.go(window.location.pathname);
        });

        this.go(path);
    }

    componentDidUpdate() {
        // @ts-ignore
        if (this.state.currPage === NotesPage) {
            document.body.classList.add('locked');
        } else {
            document.body.classList.remove('locked');
        }
    }

    private initPages = () => {
        this.pages['/'] = {page: HomePage, loader: HomePageLoader};
        this.pages['/login'] = {page: AuthPage, loader: AuthPageLoader, skeleton: AuthPageSkeleton};
        this.pages['/register'] = {page: AuthPage, loader: AuthPageLoader, skeleton: AuthPageSkeleton};
        this.pages['/notes'] = {page: NotesPage, loader: NotesLoader, skeleton: NotesPageSkeleton};
        this.pages['/404'] = {page: NotFoundPage };
    };

    public go(path: string): void {
        let page: RouterMapValue = this.pages[path];

        if (path.includes('/notes')) {
            page = this.pages['/notes'];
        }

        history.replaceState(null, null, path);

        if (page === undefined) {
            this.setState(s => ({
                ...s,
                currPage: NotFoundPage
            }));

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

                // TODO
                // this.setState(s => ({
                //     ...s,
                //     currPage: Error,
                //     PageProps: {
                //         err: err
                //     }
                // }));
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