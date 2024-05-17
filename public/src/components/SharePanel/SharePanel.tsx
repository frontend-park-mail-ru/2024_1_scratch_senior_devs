import {ScReact} from "@veglem/screact";
import {Button} from "../Button/Button";
import "./SharePanel.sass"
import {ToggleButton} from "../ToggleButton/ToggleButton";
import {Img} from "../Image/Image";

export class SharePanel extends ScReact.Component<any, any> {
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
                        <ToggleButton />
                    </div>
                    <input type="text" disabled className="share_panel__share-link-container__input" value="http://localhost:8010/notes/0a48fb5e-eb2b-41f4-9e41-87544842f539"/>
                    <Button label="Скопировать"/>
                </div>
                <div className="share_panel__social-btns-container">
                    <h3>Поделиться через соц. сети</h3>
                    <div className="share_panel__social-btns-container__bottom-container">
                        <Img src="vk.png" className="social-icon"/>
                        <Img src="odnoklassniki.png" className="social-icon" />
                        <Img src="whatsapp.png" className="social-icon" />
                    </div>
                </div>
            </div>
        )
    }
}