import {ScReact} from "@veglem/screact";
import "./Profile.sass"
import {Button} from "../Button/Button";
import {AppUserStore, UserActions, UserStoreState} from "../../modules/stores/UserStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {UpdatePasswordForm} from "../UpdatePassword/UpdatePassword";
import {Link} from "../Link/Link";
import {Modal} from "../Modal/Modal";
import {ToggleButton} from "../ToggleButton/ToggleButton";
import {ProfileAvatar} from "../ProfileAvatar/ProfileAvatar";
import {QRModal} from "../QRModal/QRModal";


export class Profile extends ScReact.Component<any, any> {
    state = {
        open: false,
        updatePasswordFormOpen: false,
        qrOpen: false
    }

    componentDidMount() {
        AppUserStore.SubscribeToStore(this.updateState)
        document.addEventListener("click", this.handleClickOutside, true)
    }

    componentWillUnmount() {
        AppUserStore.UnSubscribeToStore(this.updateState)
        document.removeEventListener("click", this.handleClickOutside, true)
    }

    updateState = (store:UserStoreState) => {
        this.setState(state => ({
            ...state,
            updatePasswordFormOpen: store.updatePasswordFormOpen,
            qrOpen: store.qrOpen
        }))
    }

    handleClickOutside = (e) => {
        if (!document.querySelector(".toast")?.contains(e.target) &&
            !document.querySelector(".toggle-profile-button")?.contains(e.target) &&
            !Array.from(document.querySelectorAll(".modal-content")).some(modal => modal.contains(e.target)) &&
            !Array.from(document.querySelectorAll(".modal-wrapper")).some(modal => modal.contains(e.target)) &&
            !document.querySelector(".popup-content")?.contains(e.target))
        {
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

    openModal = () => {
        AppDispatcher.dispatch(UserActions.OPEN_CHANGE_PASSWORD_FORM)
    }

    closeChangePasswordForm = () => {
        AppDispatcher.dispatch(UserActions.CLOSE_CHANGE_PASSWORD_FORM)
    }

    toggleTwoFactorAuthorization = (value:boolean) => {
        AppDispatcher.dispatch(UserActions.TOGGLE_TWO_FACTOR_AUTHORIZATION, value)
    }

    closeQR = () => {
        AppDispatcher.dispatch(UserActions.CLOSE_QR_WINDOW)
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

                       <ProfileAvatar avatarUrl={this.props.avatarUrl}/>

                        <span className="username">{AppUserStore.state.username}</span>

                        <Link label="Изменить пароль" onClick={this.openModal}/>

                        <ToggleButton label="Двухфакторная аутентификация" value={this.props.otpEnabled} onToggle={this.toggleTwoFactorAuthorization}/>

                        <Modal open={this.state.qrOpen} content={<QRModal image={this.props.qr}/>} handleClose={this.closeQR}/>

                        <Button label="Выйти" className="logout-btn" onClick={this.handleLogout}/>

                    </div>
                </div>

                <Modal open={this.state.updatePasswordFormOpen} content={<UpdatePasswordForm/>} handleClose={this.closeChangePasswordForm}/>

            </div>
        )
    }
}