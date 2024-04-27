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
            <div className={'admin-page-selector'}>
                <div className={'admin-page-selector-btn' + (this.state.page === 'statistic' ? ' admin-page-selector-btn-selected' : '')} onclick={() => {
                    this.setState(s => {
                        return {...s, page: 'statistic'}
                    })
                }}>Статистика
                </div>
                <div className={'admin-page-selector-btn' + (this.state.page !== 'statistic' ? ' admin-page-selector-btn-selected' : '')} onclick={() => {
                    this.setState(s => {
                        return {...s, page: 'add'}
                    })
                }}>Опросы
                </div>
            </div>
            {this.state.page === 'statistic' ? <SurvayList/> : <AddSurvay/>}
        </div>)
    }
}