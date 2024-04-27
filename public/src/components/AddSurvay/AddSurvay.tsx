import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Button} from "../Button/Button";
import {create_UUID} from "../../utils/uuid";

type AddSurveyState = {
    surveys: Array<newSurvey>
}

type newSurvey = {
    id: string
    title: string,
    type: 'NPS' | 'CSAT'
}

export class AddSurvay extends ScReact.Component<any, AddSurveyState> {
    state: AddSurveyState = {
        surveys: []
    }

    render(): VDomNode {
        return <div>
            <div>
                {this.state.surveys.map((value, index) => {
                    return (
                        <div key1={value.id}>
                            <input onchange={(e) => {
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
            <Button label={'Добавить вопрос'} onClick={() => {
                this.setState(s => {
                    const surveys = this.state.surveys;
                    surveys.push({title: '', type: 'NPS', id: create_UUID()});
                    return {...s, surveys: surveys};
                })
            }}/>
        </div>;
    }
}