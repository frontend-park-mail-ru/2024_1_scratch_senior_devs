import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {SurvayList} from "../../components/SurveyList/SurvayList";
import {AddSurvay} from "../../components/AddSurvay/AddSurvay";
import "./style.sass";

type AdminState = {
    page: 'statistic' | 'add'
}

export class AdminPage extends ScReact.Component<any, AdminState> {
    state: AdminState = {
        page: 'statistic'
    }

    render(): VDomNode {
        return(
        <div className={'admin-page-wrapper'}>
            <div className={'admin-page-container'}>
                <div className="top-panel">
                    <div
                        className={'admin-page-selector-btn' + (this.state.page === 'statistic' ? ' selected' : '')}
                        onclick={() => {
                            this.setState(s => {
                                return {...s, page: 'statistic'}
                            })
                        }}>
                        <h2>Статистика</h2>
                    </div>
                    <div
                        className={'admin-page-selector-btn' + (this.state.page !== 'statistic' ? ' selected' : '')}
                        onclick={() => {
                            console.log("asdf")
                            this.setState(s => {
                                return {...s, page: 'add'}
                            })
                        }}>
                        <h2>Опросы</h2>
                    </div>
                </div>
                <div className="bottom-panel">
                    {this.state.page === 'statistic' ? <SurvayList/> : <AddSurvay/>}
                </div>
            </div>
        </div>)
    }
}