import {ScReact} from '@veglem/screact';
import './Tippy.sass';
import {Img} from '../Image/Image';
import {ColorPicker} from '../ColorPicker/ColorPicker';
import {LinkInput} from '../LinkInput/LinkInput';
import {AppDispatcher} from '../../modules/dispatcher';
import {NoteStoreActions} from '../../modules/stores/NoteStore';

export class Tippy extends ScReact.Component<any, any> {
    state = {
        linkInputOpen: false,
        colorPickerOpen: false
    };

    private tippyRef:HTMLDivElement;
    private toggleLinkInputRef: HTMLDivElement;
    private toggleBtnRef: any;

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = (e) => {
        if (this.props.open && !this.tippyRef.contains(e.target)) {
            this.closeColorPicker();
            this.props.onClose();
        }
    };

    toggleLinkInput = () => {
        this.setState(state => ({
            ...state,
            linkInputOpen: !state.linkInputOpen
        }));
    };

    handleEnterLink = (link:string) => {
        console.log('handleEnterLink');
        console.log(link);

        // TODO
        // AppDispatcher.dispatch(
        //     NoteStoreActions.CHANGE_PIECE_ATTRIBUTES,
        //     {
        //         blockId: Number(this.options.blockId),
        //         anchorId: Number(this.options.anchorId),
        //         focusId: Number(this.options.focusId),
        //         anchorPos: Number(this.options.anchorPos),
        //         focusPos: Number(this.options.focusPos),
        //         attribute: item.type,
        //         value: "value" in item ? item.value : undefined
        //     }
        // )

        this.setState(state => ({
            ...state,
            linkInputOpen: false
        }));

        this.props.onClose();
    };

    toggleColorPicker = () => {
        this.setState(state => ({
            ...state,
            colorPickerOpen: !state.colorPickerOpen
        }));
    };

    closeColorPicker = () => {
        this.setState(state => ({
            ...state,
            colorPickerOpen: false
        }));

        // this.props.onClose()
    };

    handleSelect = (item) => {
        console.log('handleSelect');
        console.log(item.type);
        AppDispatcher.dispatch(
            NoteStoreActions.CHANGE_PIECE_ATTRIBUTES,
            {
                blockId: Number(this.options.blockId),
                anchorId: Number(this.options.anchorId),
                focusId: Number(this.options.focusId),
                anchorPos: Number(this.options.anchorPos),
                focusPos: Number(this.options.focusPos),
                attribute: item.type,
                value: 'value' in item ? item.value : undefined
            }
        );
        this.closeColorPicker();
        this.props.onClose();
    };

    setOptions = (blockId: number, anchorId: number, focusId: number, anchorPos: number, focusPos: number) => {
        this.options = {
            blockId,
            anchorId,
            focusId,
            anchorPos,
            focusPos
        };
    };

    private options = {
        blockId: 0,
        anchorId: 0,
        focusId: 0,
        anchorPos: 0,
        focusPos: 0
    };

    render() {
        const data = [
            // TODO: жирный текст и гиперссылки не робят
            {
                type: 'bold',
                icon: 'bold.svg'
            },
            {
                type: 'italic',
                icon: 'italics.svg'
            },
            {
                type: 'underline',
                icon: 'underline.svg'
            },
            {
                type: 'lineThrough',
                icon: 'crossed.svg'
            }
        ];

        this.props.optionsSetter(this.setOptions);

        return (
            <div className={'tippy-container ' + (this.props.open ? 'open' : '')} ref={(val) => this.tippyRef = val} id={'tippy'}>

                <div className="first-container" onclick={this.toggleLinkInput}  ref={ref => {this.toggleLinkInputRef = ref;}}>
                    <Img src="link.svg" className="link-icon" />
                    <span className="link-label">Ссылка</span>
                </div>

                <LinkInput open={this.state.linkInputOpen} onSubmit={this.handleEnterLink} toggleBtn={this.toggleLinkInputRef}/>
                <div className="second-container">
                    {data.map(item => (
                        <div className="item" onclick={() => this.handleSelect(item)}>
                            <Img src={item.icon}/>
                        </div>
                    ))}
                </div>

                <div className={'third-container color-picker-toggle ' + (this.state.colorPickerOpen ? 'open' : '')} onclick={this.toggleColorPicker} ref={ref => {this.toggleBtnRef = ref;}}>
                    <Img className="font-icon" src="font.svg"/>
                    <Img className="chevron-icon" src="chevron-bottom.svg"/>
                </div>

                <ColorPicker
                    onSel={(elem, value) => {
                        const val = {type: '', value: ''};
                        val.type = elem;
                        val.value = value;
                        this.handleSelect(val);
                    }}
                    open={this.state.colorPickerOpen}
                    handleClose={this.closeColorPicker}
                    toggleBtn={this.toggleBtnRef}
                />
            </div>
        );
    }
}