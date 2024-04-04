import {ScReact} from "@veglem/screact";
import "./Tippy.sass"
import {Img} from "../Image/Image";
import {ColorPicker} from "../ColorPicker/ColorPicker";
import {LinkInput} from "../LinkInput/LinkInput";

export class Tippy extends ScReact.Component<any, any> {
    state = {
        link: false,
        colorPicker: false,
        ref: undefined
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true)
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true)
    }

    handleClickOutside = (e) => {
        if (this.props.open && !this.state.ref.contains(e.target)) {
            this.props.onClose()
        }
    }

    toggleLinkInput = () => {
        this.setState(state => ({
            ...state,
            link: !state.link
        }))
    }

    closeLinkInput = () => {
        this.setState(state => ({
            ...state,
            link: false
        }))

        this.props.onClose()
    }

    toggleColorPicker = () => {
        this.setState(state => ({
            ...state,
            colorPicker: !state.colorPicker
        }))

    }

    closeColorPicker = () => {
        this.setState(state => ({
            ...state,
            colorPicker: false
        }))

        this.props.onClose()
    }

    handleSelect = (item) => {
        console.log("handleSelect")
        console.log(item.type)
        this.props.onClose()
    }

    render() {
        const data = [
            {
                type: "bold",
                icon: "bold.svg"
            },
            {
                type: "italics",
                icon: "italics.svg"
            },
            {
                type: "underline",
                icon: "underline.svg"
            },
            {
                type: "crossed",
                icon: "crossed.svg"
            }
        ]

        return (
            <div className={"tippy-container " + (this.props.open ? "open" : "")} ref={(val) => this.state.ref = val}>
                <div className="first-container" onclick={this.toggleLinkInput}  ref={ref => {this.toggleLinkInputRef = ref}}>
                    <Img src="link.svg" className="link-icon" />
                    <span className="link-label">Ссылка</span>
                </div>
                <LinkInput open={this.state.link} handleClose={this.closeLinkInput} toggleBtn={this.toggleLinkInputRef}/>
                <div className="second-container">
                    {data.map(item => (
                        <div className="item" onclick={() => this.handleSelect(item)}>
                            <Img src={item.icon}/>
                        </div>
                    ))}
                </div>
                <div className={"third-container color-picker-toggle " + (this.state.colorPicker ? "open" : "")} onclick={this.toggleColorPicker} ref={ref => {this.toggleBtnRef = ref}}>
                    <Img className="font-icon" src="font.svg"/>
                    <Img className="chevron-icon" src="chevron-bottom.svg"/>
                </div>
                <ColorPicker open={this.state.colorPicker} handleClose={this.closeColorPicker} toggleBtn={this.toggleBtnRef}/>
            </div>
        )
    }
}