import {ScReact} from "@veglem/screact";
import {Button} from "../Button/Button";
import "./SharePanel.sass"
import {ToggleButton} from "../ToggleButton/ToggleButton";
import {Img} from "../Image/Image";
import {NotesActions} from "../../modules/stores/NotesStore";
import {parseNoteTitle} from "../../modules/utils";
import {AppDispatcher} from "../../modules/dispatcher";
import {AppToasts} from "../../modules/toasts";
import {baseUrl} from "../../utils/consts";

export class SharePanel extends ScReact.Component<any, any> {

    handleToggle = (value:boolean) => {
        AppDispatcher.dispatch(value ? NotesActions.SET_PUBLIC : NotesActions.SET_PRIVATE)
    }

    shareToVK = () => {
        console.log("shareToVK")
        const url = "https://vk.com/share.php?url=" + this.getNoteURL()+ "&title=" + parseNoteTitle(this.props.note.data.title)
        this.openShareWindow(url)
    }

    shareToOK= () => {
        const url = "https://connect.ok.ru/offer?url=" + this.getNoteURL() + "&title=" + parseNoteTitle(this.props.note.data.title)
        this.openShareWindow(url)
    }

    shareToWhatsApp = () => {
        const url = "https://wa.me/?text=" + this.getNoteURL()
        this.openShareWindow(url)
    }

    openShareWindow = (url:string) => {
        const width = 800, height = 500;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        const social_window = window.open(url, "share_window", "height=" + height + ",width=" + width + ",top=" + top + ",left=" + left);
        social_window.focus();
    }

    copyNoteURL = async () => {
        await navigator.clipboard.writeText(window.location.href)
        AppToasts.info("Ссылка на заметку скопирована")
    }

    getNoteURL = () => baseUrl + "/notes/" + this.props.note?.id

    render() {
        return (
            <div className="share_panel">
                <div className="share_panel__invite-people-container">
                    <h3>Пригласить людей</h3>
                    <div className="share_panel__invite-people-container__bottom-container">
                        <input type="text" placeholder="Введите логин" className="invite-input"/>
                        <Button label="Отправить"/>
                    </div>
                </div>
                <div className="share_panel__share-link-container">
                    <h3>Поделиться ссылкой</h3>
                    <div className="share_panel__share-link-container__center-container">
                        <span>Просматривать могут все, у кого есть ссылка</span>
                        <ToggleButton value={this.props.note?.public} onToggle={this.handleToggle}/>
                    </div>
                    <input type="text" disabled className="share_panel__share-link-container__input" value={this.getNoteURL()} />
                    <Button label="Скопировать" onClick={this.copyNoteURL} />
                </div>
                <div className="share_panel__social-btns-container">
                    <h3>Поделиться через соц. сети</h3>
                    <div className="share_panel__social-btns-container__bottom-container">
                        <Img src="vk.png" className="social-icon" onClick={this.shareToVK}/>
                        <Img src="odnoklassniki.png" className="social-icon" onClick={this.shareToOK} />
                        <Img src="whatsapp.png" className="social-icon" onClick={this.shareToWhatsApp} />
                    </div>
                </div>
            </div>
        )
    }
}