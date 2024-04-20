import {AppUserStore, UserStoreState} from '../../modules/stores/UserStore';
import {AppNotesStore} from '../../modules/stores/NotesStore';
import {AppRouter} from '../../modules/router';
import {AppNoteRequests} from '../../modules/api';
import {AppToasts} from '../../modules/toasts';

export const NotesLoader = async (path:string) => {
    const p = new Promise((resolve, reject) => {
        let isAuth = AppUserStore.state.isAuth;

        if (isAuth !== undefined) {
            if (isAuth) {
                AppNotesStore.init().then((store) => {
                    resolve({notes: store.notes});
                });
            } else {
                AppRouter.go('/');
                reject();
            }

            return;
        }

        const callback = (state: UserStoreState) => {
            console.log("NotesPage.loader")

            isAuth = state.isAuth;

            AppUserStore.UnSubscribeToStore(callback);

            if (isAuth) {
                AppNotesStore.init().then((store) => {
                    if (path?.includes('notes/')) {
                        const noteId = window.location.pathname.split('/').at(-1);
                        AppNoteRequests.Get(noteId, AppUserStore.state.JWT).then(note => {
                            resolve({notes: store.notes, note: note});
                        }).catch(() => {
                            // AppToasts.error('Заметка не найдена');
                            // history.pushState(null, '', '/notes');
                            // resolve({notes: store.notes});
                            console.log("not found")
                            AppRouter.go("/404")
                            reject()
                        });
                    } else {
                        resolve({notes: store.notes});
                    }
                });
            } else {
                AppRouter.go('/');
                reject();
            }
        };

        AppUserStore.SubscribeToStore(callback);
    });

    return await p;
};
