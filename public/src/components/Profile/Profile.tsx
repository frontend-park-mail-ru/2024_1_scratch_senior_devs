import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./Profile.sass"
import {Button} from "../Button/Button";
import {AppUserStore, UserActions} from "../../modules/stores/UserStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {UpdatePasswordForm} from "../UpdatePassword/UpdatePassword";

export class Profile extends ScReact.Component<any, any> {
    state = {
        open: false,
        updatePasswordFormOpen: false,
        inUpload: false
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true)
    }

    handleClickOutside = (e) => {
        if (!document.querySelector(".toggle-profile-button").contains(e.target) && !document.querySelector(".popup-content").contains(e.target) && !document.querySelector(".modal-wrapper").contains(e.target)) {
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
        this.setState(state => ({
            ...state,
            inUpload: true
        }))

        AppDispatcher.dispatch(UserActions.UPDATE_AVATAR, e.target.files[0])

        setTimeout(() => {
            this.setState(state => ({
                ...state,
                inUpload: false
            }))
        }, 3000)
    }

    openModal = () => {
        this.setState(state => ({
            ...state,
            updatePasswordFormOpen: true
        }))
    }

    closeModal = () => {
        this.setState(state => ({
            ...state,
            updatePasswordFormOpen: false
        }))
    }

    render() {
        return (
            <div className={"user-profile-wrapper " + (this.state.open ? "open" : "")}>

                <UpdatePasswordForm open={this.state.updatePasswordFormOpen} closeModal={this.closeModal}/>

                <div className="toggle-profile-button" onclick={this.toggleOpen}>
                    <div className="slider one"></div>
                    <div className="slider two"></div>
                    <div className="slider three"></div>
                </div>
                <div className="panel">
                    <div className="popup-content">
                        <div className="user-avatar-container">

                            <Img src={"http://localhost/images/" + this.props.avatarUrl} className={"user-avatar " + (this.state.inUpload ? "loading" : "")}/>

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
                        <span className="change-password-btn" onclick={this.openModal}>Изменить пароль</span>
                        <Button label="Выйти" className="logout-btn" onClick={this.handleLogout}/>
                    </div>
                </div>
            </div>
        )
    }
}