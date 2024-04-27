import {ScReact} from "@veglem/screact";
import "./BarChart.sass"

export class BarChart extends ScReact.Component<any, any> {
    state = {
        options: [
            {
                "label": "Option 01",
                "value": 0.5,
            },
            {
                "label": "Option 02",
                "value": 0.3,
            },
            {
                "label": "Option 02",
                "value": 0.6,
            },
            {
                "label": "Option 04",
                "value": 0.95,
            },
            {
                "label": "Option 05",
                "value": 0.8,
            }
        ]
    }

    render() {
        return (
            <div className="chart">
                <ul className="numbers">
                    <li><span>100%</span></li>
                    <li><span>50%</span></li>
                    <li><span>0%</span></li>
                </ul>
                <ul className="bars">
                    {this.state.options.map(option => (
                        <li>
                            <div className="bar" style={`height: ${(100 * option.value).toString()}%`}></div><span>{option.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}