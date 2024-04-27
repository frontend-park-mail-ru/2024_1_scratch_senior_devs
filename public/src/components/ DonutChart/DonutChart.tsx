import {ScReact} from "@veglem/screact";
import "./DonutChart.sass"

type OptionType = {
    label: string,
    value: number
}

type DonutChartStateType = {
    options: OptionType[]
}

const COLORS = [
    "#1B1A55",
    "#535C91",
    "#38419D",
    "#8E8FFA",
    "#35155D",
    "#643843",
    "#393646"
]

export class DonutChart extends ScReact.Component<any, DonutChartStateType> {
    state = {
        options: [
            {
                "label": "Summer",
                "value": 0.25
            },
            {
                "label": "Monsoon",
                "value": 0.15
            },
            {
                "label": "Winter",
                "value": 0.25
            },
            {
                "label": "Zima",
                "value": 0.33
            },
            {
                "label": "Zima123",
                "value": 0.05
            }
        ]
    }

    private chartRef

    componentDidMount() {
        let i = 0
        let tmp = "green repeating-conic-gradient(from 0deg, "

        this.state.options.forEach((option, j) => {
            tmp += `${COLORS[j]} calc(3.6deg * ${i}) calc(3.6deg * ${100 * option.value + i}),`
            i += 100 * option.value
        })

        this.chartRef.style.background = tmp.slice(0, tmp.length - 1)
    }


    render() {
        return (
            <div className="donut-chart-container">
                <div className="x-box" ref={ref => this.chartRef = ref}></div>
                <div className="x-box-cont">
                    {this.props.options.map((item, i) => (
                        <div className="option">
                            <span>{item.label}: {(100 * item.value).toString()}%</span>
                            <div className="option-color" style={`background: ${COLORS[i]};`}>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}