import {AppDispatcher} from "../dispatcher";
import {AppAuthRequests, AppProfileRequests} from "../api";
import {AppRouter} from "../router";
import {BaseStore} from "./BaseStore";
import {AppToasts} from "../toasts";

export type UserStoreState = {
    JWT: string | null | undefined,
    otpEnabled: boolean,
    otpDialogOpen: boolean,
    qr: string,
    qrOpen: boolean,
    username: string,
    avatarUrl: string,
    isAuth: boolean,
    errorLoginForm: string | undefined,
    errorRegisterForm: string | undefined,
    errorUpdatePasswordForm: string | undefined,
    updatePasswordFormOpen:boolean
}

export type UserLoginCredentialsType = {
    username: string,
    password: string,
    code: string
}

export type UserRegisterCredentialsType = {
    username: string,
    password: string
}

export type UserUpdatePasswordCredentialsType = {
    oldPassword: string,
    newPassword: string
}

class UserStore extends BaseStore<UserStoreState>{
    state = {
        JWT: null,
        otpEnabled: undefined,
        otpDialogOpen: false,
        qr: undefined,
        qrOpen: false,
        username: "",
        avatarUrl: "",
        isAuth: undefined,
        errorLoginForm: undefined,
        errorRegisterForm: undefined,
        errorUpdatePasswordForm: undefined,
        updatePasswordFormOpen: false
    }

    /**
     * Конструктор класса
     */
    constructor() {
        super();
        this.state.JWT = window.localStorage.getItem('Authorization');
        this.registerEvents();
    }

    /**
     * Регистрация событий
     */
    private registerEvents(){
        AppDispatcher.register(async (action) => {
            switch (action.type){
                case UserActions.LOGIN:
                    await this.login(action.payload);
                    break;
                case UserActions.LOGOUT:
                    await this.logout();
                    break;
                case UserActions.REGISTER:
                    await this.register(action.payload);
                    break;
                case UserActions.CHECK_USER:
                    await this.checkUser();
                    break;
                case UserActions.UPDATE_AVATAR:
                    await this.updateAvatar(action.payload);
                    break;
                case UserActions.UPDATE_PASSWORD:
                    await this.updatePassword(action.payload);
                    break;
                case UserActions.OPEN_CHANGE_PASSWORD_FORM:
                    this.openChangePasswordForm();
                    break;
                case UserActions.CLOSE_CHANGE_PASSWORD_FORM:
                    this.closeChangePasswordForm();
                    break;
                case UserActions.TOGGLE_TWO_FACTOR_AUTHORIZATION:
                    await this.toggleTwoFactorAuthorization();
                    break;
                case UserActions.CLOSE_QR_WINDOW:
                    this.closeQRWindow()
                    break;
            }
        });
    }

    /**
     * Вход в аккаунт
     */
    private async login(credentials:UserLoginCredentialsType){
        this.SetState(state => ({
            ...state,
            errorLoginForm: undefined
        }))

        if (!window.navigator.onLine) {
            AppToasts.error("Потеряно соединение с интернетом")
            this.SetState(state => ({
                ...state,
                errorLoginForm: ""
            }))

            return
        }

        try {
            const res = await AppAuthRequests.Login(credentials);

            if (res.status == 200) {
                this.SetState(state => ({
                    ...state,
                    JWT: res.headers.authorization,
                    username: res.body.username,
                    avatarUrl: res.body.image_path,
                    otpEnabled: res.body.second_factor,
                    isAuth: true,
                    otpDialogOpen: false
                }))

                localStorage.setItem('Authorization', this.state.JWT)
                AppRouter.go("/notes");
            } else if (res.status == 202) {
                this.SetState(state => ({
                    ...state,
                    otpDialogOpen: true
                }))
            } else {
                this.SetState(state => ({
                    ...state,
                    errorLoginForm: "Неправильный логин, пароль или код"
                }))
            }

        } catch (err) {
            this.SetState(state => ({
                ...state,
                errorLoginForm: "Неправильный логин, пароль или код"
            }))
        }
    }

    /**
     * Выход из аккаунта
     */
    public async logout() {

        if (!window.navigator.onLine) {
            AppToasts.error("Потеряно соединение с интернетом")
            return
        }

        try {
            await AppAuthRequests.Logout(this.state.JWT);

            // Обнуление состояния пользователя
            this.SetState(state => ({
                ...state,
                isAuth: false,
                username: "",
                avatarUrl: "",
                otpEnabled: false
            }))

            AppRouter.go("/")

        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Регистрация нового аккаунта
     */
    private async register(credentials:UserRegisterCredentialsType) {
        this.SetState(state => ({
            ...state,
            errorRegisterForm: undefined
        }))

        if (!window.navigator.onLine) {
            AppToasts.error("Потеряно соединение с интернетом")
            return
        }

        try {
            const res = await AppAuthRequests.SignUp(credentials);
            this.SetState(s => {
                return {
                    ...s,
                    isAuth: true,
                    username: res.username,
                    avatarUrl: res.image_path,
                    JWT: res.jwt
                }
            })
            localStorage.setItem('Authorization', this.state.JWT)
            AppRouter.go("/notes")
        } catch (err) {
            console.log(err);

            this.SetState(state => ({
                ...state,
                errorRegisterForm: "Этот логин уже занят"
            }))
        }
    }

    /**
     * Аутентификация пользователя
     */
    private async checkUser(){
        try {
            const res = await AppAuthRequests.CheckUser(this.state.JWT)

            this.SetState(state => ({
                ...state,
                isAuth: true,
                username: res.username,
                avatarUrl: res.image_path,
                otpEnabled: res.otp
            }))
        } catch (err) {
            console.log(err);

            this.SetState(state => ({
                ...state,
                isAuth: false
            }))
        }
    }

    /**
     * Обновление аватарки пользователя
     */
    private async updateAvatar(file:File) {
        const avatarUrl = await AppProfileRequests.UpdateAvatar(file, this.state.JWT)

        this.SetState(state => {
            return {
                ...state,
                avatarUrl: avatarUrl
            }
        })
    }

    /**
     * Обновление пароля пользователя
     */
    private async updatePassword(credentials:UserUpdatePasswordCredentialsType) {
        try {
            await AppProfileRequests.UpdatePassword(credentials, this.state.JWT)

            AppToasts.success("Пароль успешно изменен")

            this.closeChangePasswordForm()
        }
        catch (err) {
            if (err.message == "Неверный пароль") {
                AppToasts.error("Неверный пароль")

                this.SetState(state => ({
                    ...state,
                    errorUpdatePasswordForm: "Неправильный пароль"
                }))
            }
        }
    }

    private openChangePasswordForm() {
        this.SetState(state => ({
            ...state,
            updatePasswordFormOpen: true
        }))
    }

    private closeChangePasswordForm() {
        this.SetState(state => ({
            ...state,
            updatePasswordFormOpen: false,
            errorUpdatePasswordForm: undefined
        }))
    }

    private async toggleTwoFactorAuthorization() {
        const image = await AppAuthRequests.GetQR(this.state.JWT)

        this.SetState(state => ({
            ...state,
            qr: image,
            qrOpen: true
        }))
    }

    private closeQRWindow() {
        this.SetState(state => ({
            ...state,
            qrOpen: false
        }))
    }
}

export const AppUserStore = new UserStore();

export const UserActions = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    REGISTER: "REGISTER",
    CHECK_USER: "CHECK_USER",
    UPDATE_AVATAR: "UPDATE_AVATAR",
    UPDATE_PASSWORD: "UPDATE_PASSWORD",
    OPEN_CHANGE_PASSWORD_FORM: "OPEN_CHANGE_PASSWORD_FORM",
    CLOSE_CHANGE_PASSWORD_FORM: "CLOSE_CHANGE_PASSWORD_FORM",
    TOGGLE_TWO_FACTOR_AUTHORIZATION: "TOGGLE_TWO_FACTOR_AUTHORIZATION",
    CLOSE_QR_WINDOW: "CLOSE_QR_WINDOW"
}