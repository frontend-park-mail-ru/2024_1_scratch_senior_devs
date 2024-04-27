import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Button} from "../Button/Button";

// type SurveyProps = {
//     surveys: Array<SurveyStruct>
// }

type SurveyStruct = {
    id: string,
    title: string,
    answers: Array<string>
}

export class Survey extends ScReact.Component<SurveyStruct, any> {

    render(): VDomNode {
        return(<div>
            <h2>{this.props.title}</h2>
            {this.props.answers.map(value => {
                return (<div>
                    <button style={"display: inline"}>выбрать</button>
                    <p style={"display: inline"}>{value}</p>
                </div>)
            })}
            <Button onClick={() => {}} label={"Отправить"}></Button>
        </div>);
    }
}