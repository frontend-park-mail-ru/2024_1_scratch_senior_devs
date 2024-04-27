import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import "./SurvayList.sass"
import {Question} from "../Question/Question";

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

export class SurvayList extends ScReact.Component<any, any> {
    state = {
        questions: [
            {
                "name": "Вопрос №1",
                "type": "NPS"
            },
            {
                "name": "Вопрос №2",
                "type": "CSAT"
            },
            {
                "name": "Вопрос №3",
                "type": "NPS"
            }
        ]
    }

    render(): VDomNode {
        return (
            <div className="questions-wrapper">
                {this.state.questions.map(question => (
                    <Question name={question.name} type={question.type} />
                ))}
            </div>
        )
    }
}