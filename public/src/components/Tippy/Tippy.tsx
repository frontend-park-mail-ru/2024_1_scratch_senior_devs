import {ScReact} from '@veglem/screact';
import './Tippy.sass';
import {Img} from '../Image/Image';
import {ColorPicker} from '../ColorPicker/ColorPicker';
import {AppDispatcher} from '../../modules/dispatcher';
import {NoteStoreActions} from '../../modules/stores/NoteStore';
import {LinkInput} from "../LinkInput/LinkInput";

export class Tippy extends ScReact.Component<any, any> {
    state = {
        linkInputOpen: false,
        colorPickerOpen: false
    };

    private tippyRef:HTMLDivElement;
    private toggleLinkInputRef: HTMLDivElement;
    private toggleBtnRef: any;

    componentDidMount() {
        // document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        // document.removeEventListener('click', this.handleClickOutside, true);
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
        if (item.type === 'bold') {
            document.execCommand('bold', false, null);
        }
        if (item.type === 'italic') {
            document.execCommand('italic', false, null);
        }
        if (item.type === 'underline') {
            document.execCommand('underline', false, null);
        }
        if (item.type === 'lineThrough') {
            document.execCommand('strikeThrough', false, null);
        }

        this.closeColorPicker();
        this.props.onClose();
    };

    render() {
        // TODO: Сделать гиперссылки

        const data = [
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

        return (
            <div className={'tippy-container ' + (this.props.open ? 'open' : '')} ref={(val) => this.tippyRef = val} style={this.props.style} id={'tippy'}>

                {/*<div className="first-container" onclick={this.toggleLinkInput}  ref={ref => {this.toggleLinkInputRef = ref;}}>*/}
                {/*    <Img src="link.svg" className="link-icon" />*/}
                {/*    <span className="link-label">Ссылка</span>*/}
                {/*</div>*/}

                {/*<LinkInput open={this.state.linkInputOpen} onSubmit={this.handleEnterLink} toggleBtn={this.toggleLinkInputRef}/>*/}

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