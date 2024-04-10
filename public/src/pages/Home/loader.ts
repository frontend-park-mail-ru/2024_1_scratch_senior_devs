import {AppUserStore, UserStoreState} from '../../modules/stores/UserStore';
import {AppRouter} from '../../modules/router';

export const HomePageLoader = async () => {
    const p = new Promise((resolve, reject) => {
        let isAuth = AppUserStore.state.isAuth;

        if (isAuth !== undefined) {
            if (isAuth) {
                AppRouter.go("/notes")
                reject()
            } else {
                resolve(null)
            }

            return
        }

        const callback = (state: UserStoreState) => {
            isAuth = state.isAuth;
            AppUserStore.UnSubscribeToStore(callback);
            if (isAuth) {
                AppRouter.go("/notes")
                reject()
            } else {
                resolve(null)
            }
        }

        AppUserStore.SubscribeToStore(callback);
    })

    return await p;
}
