import {AppUserStore, UserStoreState} from "../../modules/stores/UserStore";
import {AppNotesStore} from "../../modules/stores/NotesStore";
import {AppRouter} from "../../modules/router";

export const NotesLoader = async () => {
    const p = new Promise((resolve, reject) => {
        let isAuth = AppUserStore.state.isAuth;

        if (isAuth !== undefined) {
            if (isAuth) {
                AppNotesStore.init().then((store) => {
                    resolve({notes: store.notes});
                })
            } else {
                AppRouter.go("/")
                reject()
            }

            return
        }

        const callback = (state: UserStoreState) => {
            isAuth = state.isAuth;

            AppUserStore.UnSubscribeToStore(callback);

            if (isAuth) {
                AppNotesStore.init().then((store) => {
                    resolve({notes: store.notes});
                })
            } else {
                AppRouter.go("/")
                reject()
            }
        }

        AppUserStore.SubscribeToStore(callback);
    })

    return await p;
}
