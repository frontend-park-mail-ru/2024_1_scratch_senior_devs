import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import {imagesUlr} from "../../modules/api";
import {AppToasts} from "../../modules/toasts";
import {AppDispatcher} from "../../modules/dispatcher";
import {UserActions} from "../../modules/stores/UserStore";
import "./ProfileAvatar.sass"

const MEGABYTE_SIZE = 1024 * 1024
const MAX_AVATAR_SIZE = 5 * MEGABYTE_SIZE

export class ProfileAvatar extends ScReact.Component<any, any> {
    state = {
        inUpload: false
    }

    handlePhotoUpload = (e) => {
        const file = e.target.files[0]

        if (file.size > MAX_AVATAR_SIZE) {
            AppToasts.error("Фото слишком большое")
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

    render() {
        return (
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
        )
    }
}