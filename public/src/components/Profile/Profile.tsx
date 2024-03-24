import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./Profile.sass"
import {Button} from "../Button/Button";
import {AppUserStore, UserActions, UserStoreState} from "../../modules/stores/UserStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {UpdatePasswordForm} from "../UpdatePassword/UpdatePassword";
import {AppToasts} from "../../modules/toasts";
import {imagesUlr} from "../../modules/api";
import {Link} from "../Link/Link";
import {Modal} from "../Modal/Modal";

const MEGABYTE_SIZE = 1024 * 1024
const MAX_AVATAR_SIZE = 5 * MEGABYTE_SIZE

export class Profile extends ScReact.Component<any, any> {
    state = {
        open: false,
        inUpload: false,
        updatePasswordFormOpen: false
    }

    componentDidMount() {
        AppUserStore.SubscribeToStore(this.updateState)
        document.addEventListener('click', this.handleClickOutside, true)
    }

    componentWillUnmount() {
        AppUserStore.UnSubscribeToStore(this.updateState)
        document.removeEventListener('click', this.handleClickOutside, true)
    }

    updateState = (store:UserStoreState) => {
        this.setState(state => ({
            ...state,
            updatePasswordFormOpen: store.updatePasswordFormOpen
        }))
    }

    handleClickOutside = (e) => {
        if (!document.querySelector(".toast")?.contains(e.target) && !document.querySelector(".toggle-profile-button")?.contains(e.target) && !document.querySelector(".popup-content")?.contains(e.target) && !document.querySelector(".modal-wrapper")?.contains(e.target)) {
            this.close()
        }
    }

    close = () => {
        this.setState(state => ({
            ...state,
            open: false
        }))
    }

    toggleOpen = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))
    }

    handleLogout = async () => {
        AppDispatcher.dispatch(UserActions.LOGOUT)
    }

    handlePhotoUpload = (e) => {
        const file = e.target.files[0]

        if (file.size > MAX_AVATAR_SIZE) {
            AppToasts.error("Фото слишком большое")
            console.log(e.target)
            e.target.value = null
            return
        }

        this.setState(state => ({
            ...state,
            inUpload: true
        }))

        AppDispatcher.dispatch(UserActions.UPDATE_AVATAR, file)

        setTimeout(() => {
            this.setState(state => ({
                ...state,
                inUpload: false
            }))

            e.target.value = null
        }, 3000)
    }

    openModal = () => {
        AppDispatcher.dispatch(UserActions.OPEN_CHANGE_PASSWORD_FORM)
    }

    closeChangePasswordForm = () => {
        AppDispatcher.dispatch(UserActions.CLOSE_CHANGE_PASSWORD_FORM)
    }

    render() {
        return (
            <div className={"user-profile-wrapper " + (this.state.open ? "open" : "")}>
                <div className="toggle-profile-button" onclick={this.toggleOpen}>
                    <div className="slider one"></div>
                    <div className="slider two"></div>
                    <div className="slider three"></div>
                </div>
                <div className="panel">
                    <div className="popup-content">
                        <div className="user-avatar-container">
                            <Img src={imagesUlr + this.props.avatarUrl} className={"user-avatar " + (this.state.inUpload ? "loading" : "")}/>

                            <form className="upload-preview">
                                <input type="file" accept=".jpg,.png" id="upload-image-input" hidden="true" onchange={this.handlePhotoUpload}/>
                                <label htmlFor="upload-image-input"></label>
                                <Img src="src/assets/photo.svg" className="upload-preview-icon"/>
                            </form>

                            <div className={"progress-wrapper " + (this.state.inUpload ? "active" : "")}>
                                <div className="inner"></div>
                                <div className="checkmark">
                                    <span></span>
                                    <span></span>
                                </div>
                                <div className="circle">
                                    <div className="bar left">
                                        <div className="progress"></div>
                                    </div>
                                    <div className="bar right">
                                        <div className="progress"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className="username">{AppUserStore.state.username}</span>
                        <Link label="Изменить пароль" onClick={this.openModal}/>
                        <Button label="Выйти" className="logout-btn" onClick={this.handleLogout}/>
                    </div>
                </div>

                <Modal open={this.state.updatePasswordFormOpen} content={<UpdatePasswordForm />} handleClose={this.closeChangePasswordForm}/>

            </div>
        )
    }
}