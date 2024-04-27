import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {SurvayList} from "../../components/SurveyList/SurvayList";
import {AddSurvay} from "../../components/AddSurvay/AddSurvay";
import "./style.sass";
import {BarChart} from "../../components/BarChart/BarChart";
import {DonutChart} from "../../components/ DonutChart/DonutChart";

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
                        <h3>Статистика</h3>
                    </div>
                    <div
                        className={'admin-page-selector-btn' + (this.state.page !== 'statistic' ? ' selected' : '')}
                        onclick={() => {
                            console.log("asdf")
                            this.setState(s => {
                                return {...s, page: 'add'}
                            })
                        }}>
                        <h3>Опросы</h3>
                    </div>
                </div>
                <div className="bottom-panel">
                    {this.state.page === 'statistic' ? <SurvayList/> : <AddSurvay/>}
                </div>
            </div>
        </div>)
    }
}