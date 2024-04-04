import {ScReact} from "@veglem/screact";
import "./ColorPicker.sass"

export class ColorPicker extends ScReact.Component<any, any> {
    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true)
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true)
    }

    handleClickOutside = (e) => {
        // console.log(e.contains(document.querySelector("color-picker-container")))
        if (this.props.open && !this.ref.contains(e.target) && this.props.toggleBtn && !this.props.toggleBtn.contains(e.target)) {
            this.props.handleClose()
        }
    }

    handleSelectText = (item) => {
        console.log("handleSelectText")
        console.log(item.label)
        this.props.handleClose()
    }

    handleSelectBackground = (item) => {
        console.log("handleSelectBackground")
        console.log(item.label)
        this.props.handleClose()
    }

    render() {
        const data = {
            text: [
                {
                    label: "По умолчанию",
                    color: "white"
                },
                {
                    label: "Красный",
                    color: "rgb(224, 0, 0)"
                },
                {
                    label: "Синий",
                    color: "rgb(37, 99, 235)"
                },
            ],
            bg: [
                {
                    label: "По умолчанию",
                    color: "#000"
                },
                {
                    label: "Красный",
                    color: "#5c1a1a"
                },
                {
                    label: "Синий",
                    color: "#1a3d5c"
                },
            ]
        }

        return (
            <div className={"color-picker-container " + (this.props.open ? "open" : "")} ref={ref => {this.ref = ref}}>
                <div className="text-color-picker-container">
                    <span className="label">Текст</span>
                    <div className="items">
                        {data.text.map(item => (
                            <div className="item" onclick={() => this.handleSelectText(item)}>
                                <div className="icon-container">
                                    <span style={`color: ${item.color}`}>A</span>
                                </div>
                                <span className="text">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="background-color-picker-container">
                    <span className="label">Фон</span>
                    <div className="items">
                        {data.bg.map(item => (
                            <div className="item" onclick={() => this.handleSelectBackground(item)}>
                                <div className="icon-container" style={`background: ${item.color}`}>
                                    <span>A</span>
                                </div>
                                <span className="text">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}