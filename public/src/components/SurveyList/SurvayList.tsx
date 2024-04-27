import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import "./SurvayList.sass"
import {Question} from "../Question/Question";
import {AppSurveyRequests} from "../../modules/api";
import {AppUserStore} from "../../modules/stores/UserStore";

type NPSQuestion = {
    title: string,
    type: 'NPS',
    value: number,
    stat: {
        first: number,
        second: number,
        third: number
    }
}

type CSATQuestion = {
    title: string,
    type: 'CSAT',
    stat: {
        first: number,
        second: number,
        third: number,
        fourth: number,
        fifth: number
    }
    value: number
}

type QuestionsArray = Array<NPSQuestion | CSATQuestion>

export class SurvayList extends ScReact.Component<any, any> {
    state: {questions: QuestionsArray} = {
        questions: [
        ]
    }

    componentDidMount() {
        AppSurveyRequests.GetQuestions(AppUserStore.state.JWT).then(response => {
            this.setState(s => {
                return {...s, questions: response};
            })
        })
    }

    render(): VDomNode {
        return (
            <div className="questions-wrapper">
                {this.state.questions.map(question => (
                    <Question name={question.title} type={question.type} stat={question.stat} value={question.value}/>
                ))}
            </div>
        )
    }
}