import {AppUserStore, UserActions, UserStoreState} from "../../modules/stores/UserStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {AppRouter} from "../../modules/router";

export const AuthPageLoader = async () => {
    const p = new Promise((resolve, reject) => {
        let isAuth = undefined;
        const callback = (state: UserStoreState) => {
            isAuth = state.isAuth;

            AppUserStore.UnSubscribeToStore(callback);

            if (isAuth) {
                AppRouter.go("/")
                reject()
            } else {
                resolve(null)
            }
        }

        if (AppUserStore.state.isAuth !== undefined) {
            resolve(null)
            return
        }

        AppUserStore.SubscribeToStore(callback);
        AppDispatcher.dispatch(UserActions.CHECK_USER)
    })

    return await p;
}