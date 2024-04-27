import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import {DonutChart} from "../ DonutChart/DonutChart";
import {BarChart} from "../BarChart/BarChart";
import "./Question.sass"

export class Question extends ScReact.Component<any, any> {
    state = {
        open: false
    }

    toggleOpen = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))
    }

    render() {
        const mapStat = (stat) => {
            const options = [];
            for (const statKey in stat) {
                options.push({label: statKey, value: stat[statKey]})
            }
            return options;
        }

        return (
            <div className={"question " + (this.state.open ? "open" : "")}>
                <div className="question-item">
                    <h2>{this.props.name}</h2>
                    <Img src="expand.svg" className="expand-btn" onClick={this.toggleOpen}/>
                </div>
                <div className="question-diagram">
                    {this.props.type == "NPS" ? <DonutChart options={mapStat(this.props.stat)}/> : <BarChart options={mapStat(this.props.stat)}/>}
                </div>
                <div>
                    {this.props.value}
                </div>
            </div>
        )
    }
}