import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./Profile.sass"
import {Button} from "../Button/Button";

export class Profile extends ScReact.Component<any, any> {
    state = {
        open: false
    }

    toggleOpen = () => {
        this.setState(state => ({
            open: !state.open
        }))
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
                        <Img src="src/assets/avatar.png" />
                        <span>YarikMix</span>
                        <Button label="Выйти" />
                    </div>
                </div>
            </div>
        )
    }
}