import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import {DonutChart} from "../ DonutChart/DonutChart";
import {BarChart} from "../BarChart/BarChart";

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
        return (
            <div className={"question " + (this.state.open ? "open" : "")}>
                <div className="question-item">
                    <h2>{this.props.name}</h2>
                    <Img src="expand.svg" className="expand-btn" onClick={this.toggleOpen}/>
                </div>
                <div className="question-diagram">
                    {this.props.type == "NPS" ? <DonutChart/> : <BarChart/>}
                </div>
            </div>
        )
    }
}