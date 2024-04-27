import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Button} from "../Button/Button";
import {create_UUID} from "../../utils/uuid";
import "./AddSurvay.sass"
import {Input} from "../Input/Input";
import {AppNoteRequests, AppSurveyRequests} from "../../modules/api";
import {AppUserStore, UserActions} from "../../modules/stores/UserStore";
import {AppDispatcher} from "../../modules/dispatcher";

type AddSurveyState = {
    surveys: Array<newSurvey>
}

type newSurvey = {
    id: string
    title: string,
    type: 'NPS' | 'CSAT',
}

export class AddSurvay extends ScReact.Component<any, AddSurveyState> {
    state: AddSurveyState = {
        surveys: []
    }

    handleSubmit = () => {
        console.log(this.state.surveys)

        AppSurveyRequests.CreateSurvey(AppUserStore.state.JWT, AppUserStore.state.csrf, this.state.surveys.map(val => {
            return {
                title: val.title,
                type: val.type
            }
        })).then(response => {
            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, response.csrf);
            this.setState(state => ({
                ...state,
                surveys: []
            }))
        }).catch(res => {
            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, res.csrf);
        })
    }

    render(): VDomNode {
        return (
            <div className="add-survey-page-wrapper">
                <div className="survey-questions-container">
                    {this.state.surveys.map((value, index) => {
                        return (
                            <div key1={value.id} className="survey-question">
                                <input oninput={(e) => {
                                    this.state.surveys[index].title = e.target.value;
                                }} />
                                <select onchange={(e) => {
                                    this.state.surveys[index].type = e.target.value;
                                    console.log(this.state.surveys);
                                }}>
                                    <option value={'NPS'}>
                                        NPS
                                    </option>
                                    <option value={'CSAT'}>
                                        CSAT
                                    </option>
                                </select>
                                <button onclick={() => {
                                    this.setState(s => {
                                        const surveys = this.state.surveys;
                                        surveys.splice(index, 1);
                                        return {...s, surveys: surveys};
                                    })
                                }}>x</button>
                            </div>
                        );
                    })}
                </div>
                {this.state.surveys.length > 0 ?
                    <div className="buttons-container">
                        <Button label={'Добавить вопрос'} onClick={() => {
                            this.setState(s => {
                                const surveys = this.state.surveys;
                                surveys.push({title: '', type: 'NPS', id: create_UUID()});
                                return {...s, surveys: surveys};
                            })
                        }}/>
                        <Button label={'Отправить'} onClick={this.handleSubmit}/>
                    </div>
                :
                    <Button label={'Создать опрос'} onClick={() => {
                        this.setState(s => {
                            const surveys = this.state.surveys;
                            surveys.push({title: '', type: 'NPS', id: create_UUID()});
                            return {...s, surveys: surveys};
                        })
                    }}/>
                }

            </div>
        )
    }
}