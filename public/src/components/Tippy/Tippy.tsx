import {ScReact} from "@veglem/screact";
import "./Tippy.sass"
import {Img} from "../Image/Image";
import {ColorPicker} from "../ColorPicker/ColorPicker";
import {LinkInput} from "../LinkInput/LinkInput";
import {AppDispatcher} from "../../modules/dispatcher";
import {NoteStoreActions} from "../../modules/stores/NoteStore";

export class Tippy extends ScReact.Component<any, any> {
    state = {
        link: false,
        colorPicker: false,
        ref: undefined
    }
    private toggleLinkInputRef: HTMLDivElement;
    private toggleBtnRef: any;

    componentDidMount() {
        // document.addEventListener("click", this.handleClickOutside, true)
    }

    componentWillUnmount() {
        // document.removeEventListener("click", this.handleClickOutside, true)
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
        AppDispatcher.dispatch(NoteStoreActions.CHANGE_PIECE_ATTRIBUTES,
            {
                blockId: Number(this.options.blockId),
                anchorId: Number(this.options.anchorId),
                focusId: Number(this.options.focusId),
                anchorPos: Number(this.options.anchorPos),
                focusPos: Number(this.options.focusPos),
                attribute: item.type,
                value: "value" in item ? item.value : undefined
            })
        this.state.ref.style.display = "none";
        this.props.onClose()
    }

    setOptions = (blockId: number, anchorId: number, focusId: number, anchorPos: number, focusPos: number) => {
        this.options = {
            blockId,
            anchorId,
            focusId,
            anchorPos,
            focusPos
        }
    }

    private options = {
        blockId: 0,
        anchorId: 0,
        focusId: 0,
        anchorPos: 0,
        focusPos: 0
    }

    render() {
        const data = [
            // TODO
            // {
            //     type: "bold",
            //     icon: "bold.svg"
            // },
            {
                type: "italic",
                icon: "italics.svg"
            },
            {
                type: "underline",
                icon: "underline.svg"
            },
            {
                type: "lineThrough",
                icon: "crossed.svg"
            }
        ]

        this.props.optionsSetter(this.setOptions);

        return (
            <div className={"tippy-container " + (this.props.open ? "open" : "")} ref={(val) => this.state.ref = val} id={"tippy"}>
                {/*<div className="first-container" onclick={this.toggleLinkInput}  ref={ref => {this.toggleLinkInputRef = ref}}>*/}
                {/*    <Img src="link.svg" className="link-icon" />*/}
                {/*    <span className="link-label">Ссылка</span>*/}
                {/*</div>*/}
                {/*<LinkInput open={this.state.link} handleClose={this.closeLinkInput} toggleBtn={this.toggleLinkInputRef}/>*/}
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
                <ColorPicker onSel={(elem, value) => {
                    const val = {type: "", value: ""};
                    val.type = elem;
                    val.value = value;
                    this.handleSelect(val);
                }} open={this.state.colorPicker} handleClose={this.closeColorPicker} toggleBtn={this.toggleBtnRef}/>
            </div>
        )
    }
}