import {ScReact} from "@veglem/screact";
import "./Tooltip.sass"
import {Img} from "../Image/Image";
import {Component} from "@veglem/screact/dist/component";

type TooltipProps = {
    label?: string,
    icon: string,
    showHoverTooltip: boolean,
    iconFromUnicode?: boolean,
    hoverTooltip?: string,
    onClick?: () => void,
    className?: string,
    content?: Component<any, any>
}

export class Tooltip extends ScReact.Component<TooltipProps, any> {
    state = {
        open: false
    }

    private openBtnRef
    private tooltipContentRef

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside = (e) => {
        if (this.state.open && !this.openBtnRef.contains(e.target) && !this.tooltipContentRef.contains(e.target) && !e.target.matches(".note-editor-content, .note-editor-content *")) {
            this.toggleOpen();
        }
    }

    toggleOpen = () => {
        this.setState(state => ({
            ...state,
            open: !state.open
        }))
    }

    render() {
        return (
            <div
                 className={"tooltip-wrapper " + (this.props.className ? this.props.className : "") + (this.state.open && this.props.content ? " open " : "")}
                 onclick={() => this.props.onClick && this.props.onClick() }
            >

                <div className="open-btn" onclick={this.toggleOpen} ref={ref => this.openBtnRef = ref}>

                    <div className="open-btn__icon-container">
                        {this.props.iconFromUnicode ? String.fromCodePoint(parseInt(this.props.icon, 16)) :  <Img src={this.props.icon} className="icon"/>}
                    </div>

                    {this.props.label ? <span className="open-btn__label">{this.props.label}</span> : ""}

                    {this.props.showHoverTooltip ?
                        <div className={"tooltip-container"}>
                            <span>{this.props.hoverTooltip}</span>
                        </div>
                        :
                        ""
                    }
                </div>

                <div className="tooltip-wrapper__content" ref={ref => this.tooltipContentRef = ref}>
                    {this.props.content ? this.props.content : ""}
                </div>

            </div>
        )
    }
}