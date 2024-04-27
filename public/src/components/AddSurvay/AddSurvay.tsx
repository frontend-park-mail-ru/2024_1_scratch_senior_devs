import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Button} from "../Button/Button";
import {create_UUID} from "../../utils/uuid";
import "./AddSurvay.sass"
import {Img} from "../Image/Image";
import {AppSurveyRequests} from "../../modules/api";
import {AppUserStore, UserActions} from "../../modules/stores/UserStore";
import {AppDispatcher} from "../../modules/dispatcher";
import {AppToasts} from "../../modules/toasts";

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

        let flag = false;
        this.state.surveys.forEach(val => {
            if (val.title.length === 0) {
                AppToasts.info('Название не может быть пустым');
                flag = true;
                return;
            }
        });
        if (flag) {
            return;
        }

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
                                <div className="top-question-body">
                                    <h3>Вопрос №{(index + 1).toString()}</h3>
                                    <select  onсhange={(e) => {
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
                                </div>
                                <div className="bottom-question-body">
                                    <input placeholder="Название" oninput={(e) => {
                                        this.state.surveys[index].title = e.target.value;
                                    }}/>
                                    <Img src="close.svg" className="remove-question-btn" onClick={() => {
                                        this.setState(s => {
                                            const surveys = this.state.surveys;
                                            surveys.splice(index, 1);
                                            return {...s, surveys: surveys};
                                        })
                                    }}>x
                                    </Img>
                                </div>

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