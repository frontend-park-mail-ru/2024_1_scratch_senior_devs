import {ScReact} from "@veglem/screact";
import {Img} from "../Image/Image";
import "./BackgroundPicker.sass"

export class BackgroundPicker extends ScReact.Component<any, any> {
    state = {
        open: false
    }

    private openBtnRef

    private backgroundData = [
        "linear-gradient( 109.6deg,  rgba(57,106,252, 0.6) 11.2%, rgba(48,86,253, 0.6) 91.1% )",
        "linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)",
        "linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)",
        "linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)",
        "linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)",
        "linear-gradient(132deg, #F4D03F 0%, #16A085 100%)",
        "linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)",
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    ]

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside)
    }

    handleClickOutside = (e) => {
        if (this.state.open && !this.openBtnRef.contains(e.target) && !e.target.matches(".background-picker-container, .background-picker-container *")) {
            this.toggleOpen();
        }
    }

    toggleOpen = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))
    }

    selectBackground = (bg) => {
        console.log("selectBackground")
        console.log(bg)
        // AppDispatcher.dispatch(NotesActions.UPDATE_NOTE_BACKGROUND, bg.id)
        this.props.onChange(bg)
    }

    clearBackground = () => {
        this.props.onChange(null)
    }

    render() {
        return (
            <div className={"background-picker-container " + (this.state.open ? "open" : "")}>
                <div className="open-btn" onclick={this.toggleOpen} ref={ref => this.openBtnRef = ref}>
                    <Img src="image.svg" className="icon"/>
                    <span>Шапка</span>
                </div>

                <div className="background-list-container">

                    <div className="background-list-container__top-panel">
                        <span onclick={this.clearBackground}>Очистить</span>
                    </div>

                    <div className="background-list">
                        {this.backgroundData.map(bg => (
                            <div className="background-list__item" key={bg} onclick={() => this.selectBackground(bg)} style={`background: ${bg};`}></div>
                        ))}
                    </div>

                </div>

            </div>
        )
    }
}