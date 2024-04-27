import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {BarChart} from "../BarChart/BarChart";
import {DonutChart} from "../ DonutChart/DonutChart";
import "./SurvayList.sass"
import {Img} from "../Image/Image";
import {Question} from "../Question/Question";

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