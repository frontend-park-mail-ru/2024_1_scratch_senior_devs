import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import "./Survey.sass"
import {AppSurveyRequests} from "../../modules/api";
import {AppUserStore, UserActions} from "../../modules/stores/UserStore";
import {AppDispatcher} from "../../modules/dispatcher";

type SurveyProps = {
    surveys: Array<SurveyStruct>
}

type SurveyStruct = {
    id: string,
    title: string,
    type: 'NPS' | 'CSAT'
}

export class Survey extends ScReact.Component<SurveyProps, SurveyStruct | undefined | 'ended'> {

    componentDidMount() {
        AppSurveyRequests.GetSurvey(AppUserStore.state.JWT).then(response => {
            this.props.surveys = [];
            response.forEach(val => {
                this.props.surveys.push({
                    id: val.id,
                    title: val.title,
                    type: val.question_type
                })
            })
            this.setState(s => {
                return this.props.surveys[0];
            });
        })
    }

    surveyHandler = (answer: number) => {
        // todo: send resultn
        AppSurveyRequests.Vote(AppUserStore.state.JWT, AppUserStore.state.csrf, {
            question_id: (this.state as SurveyStruct).id,
            voice: answer
        }).then(response => {
            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, response.csrf);
            if (this.state !== undefined && this.state !== 'ended') {
                this.setState(s => {
                    const currindex = this.props.surveys.indexOf(this.state as SurveyStruct);
                    if (currindex === this.props.surveys.length - 1) {
                        return 'ended';
                    } else {
                        return this.props.surveys[currindex + 1];
                    }
                })
            }
        }).catch(res => {
            AppDispatcher.dispatch(UserActions.UPDATE_CSRF, res.csrf);
        })
    }

    render(): VDomNode {
        if (this.state !== undefined && this.state === 'ended') {
            return (
                <div>
                    Спасибо, что прошли опрос
                </div>
            )
        }else if (this.state !== undefined && this.state !== 'ended') {
            return (
                <div className={"survey-wrapper"}>
                    <div className={'survey-counter'}>
                        <p>{(this.props.surveys.indexOf(this.state) + 1).toString()}/{this.props.surveys.length.toString()}</p>
                    </div>
                    <h2 className={"survey-title"}>{this.state.title}</h2>
                    {
                        this.state.type === 'NPS' ?
                            <div className={'survey-nps'}>
                                <button onclick={() => {this.surveyHandler(1)}} className={'survey-nps-btn'}>0</button>
                                <button onclick={() => {this.surveyHandler(1)}} className={'survey-nps-btn'}>1</button>
                                <button onclick={() => {this.surveyHandler(2)}} className={'survey-nps-btn'}>2</button>
                                <button onclick={() => {this.surveyHandler(3)}} className={'survey-nps-btn'}>3</button>
                                <button onclick={() => {this.surveyHandler(4)}} className={'survey-nps-btn'}>4</button>
                                <button onclick={() => {this.surveyHandler(5)}} className={'survey-nps-btn'}>5</button>
                                <button onclick={() => {this.surveyHandler(6)}} className={'survey-nps-btn'}>6</button>
                                <button onclick={() => {this.surveyHandler(7)}} className={'survey-nps-btn'}>7</button>
                                <button onclick={() => {this.surveyHandler(8)}} className={'survey-nps-btn'}>8</button>
                                <button onclick={() => {this.surveyHandler(9)}} className={'survey-nps-btn'}>9</button>
                                <button onclick={() => {this.surveyHandler(10)}} className={'survey-nps-btn'}>10</button>
                            </div> :
                            <div className={'survey-csat'}>
                                <button onclick={() => {this.surveyHandler(1)}} className={'survey-csat-btn'}>1</button>
                                <button onclick={() => {this.surveyHandler(2)}} className={'survey-csat-btn'}>2</button>
                                <button onclick={() => {this.surveyHandler(3)}} className={'survey-csat-btn'}>3</button>
                                <button onclick={() => {this.surveyHandler(4)}} className={'survey-csat-btn'}>4</button>
                                <button onclick={() => {this.surveyHandler(5)}} className={'survey-csat-btn'}>5</button>
                            </div>
                    }
                    <div className={'survey-description'}>
                        <div className={'survey-notrecomend'}>Точно не рекомендую</div>
                        <div className={'survey-recomend'}>Точно рекомендую</div>
                    </div>
                </div>);
        } else {
            return (
                <div className={"survey-wrapper-skeleton"}></div>
            )
        }

    }
}