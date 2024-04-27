import {ScReact} from "@veglem/screact";
import "./DonutChart.sass"

type OptionType = {
    label: string,
    color: string,
    value: number
}

type DonutChartStateType = {
    options: OptionType[]
}

export class DonutChart extends ScReact.Component<any, DonutChartStateType> {
    state = {
        options: [
            {
                "label": "Summer",
                "color": "blue",
                "value": 0.5
            },
            {
                "label": "Monsoon",
                "color": "yellow",
                "value": 0.25
            },
            {
                "label": "Winter",
                "color": "green",
                "value": 0.25
            }
        ]
    }

    private chartRef

    componentDidMount() {
        console.log(this.state.options)

        let i = 0
        let tmp = "green repeating-conic-gradient(from 0deg, "

        this.state.options.forEach(option => {
            tmp += `${option.color} calc(3.6deg * ${i}) calc(3.6deg * ${100 * option.value + i}),`
            i += 100 * option.value
        })

        this.chartRef.style.background = tmp.slice(0, tmp.length - 1)
    }

    render() {
        return (
            <div className="donut-chart-container">
                <div className="x-box" ref={ref => this.chartRef = ref}></div>
                <div className="x-box-cont">
                    <h1>Seasons of the year</h1>
                    {this.state.options.map(item => (
                        <span style={`color: ${item.color};`}>{item.label} {(100 * item.value).toString()}%</span>
                    ))}
                </div>
            </div>
        )
    }
}