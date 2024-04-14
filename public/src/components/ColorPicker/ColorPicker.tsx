import {ScReact} from '@veglem/screact';
import './ColorPicker.sass';

export class ColorPicker extends ScReact.Component<any, any> {
    handleSelectText = (item: { label: any; color: any; }) => {
        console.log('handleSelectText');
        console.log(item.label);
        this.props.onSel('color', item.color);
        this.props.handleClose();
    };

    handleSelectBackground = (item: { label: any; color: any; }) => {
        console.log('handleSelectBackground');
        console.log(item.label);
        this.props.onSel('backgroundColor', item.color);
        this.props.handleClose();
    };

    render() {
        const data = {
            text: [
                {
                    label: 'По умолчанию',
                    color: 'white'
                },
                {
                    label: 'Красный',
                    color: 'rgb(224, 0, 0)'
                },
                {
                    label: 'Синий',
                    color: 'rgb(37, 99, 235)'
                },
            ],
            bg: [
                {
                    label: 'По умолчанию',
                    color: 'rgba(0,0,0,0)'
                },
                {
                    label: 'Красный',
                    color: '#5c1a1a'
                },
                {
                    label: 'Синий',
                    color: '#1a3d5c'
                },
            ]
        };

        return (
            <div className={'color-picker ' + (this.props.open ? 'open' : '')}>
                <div className="text-picker">
                    <span className="text-picker__label">Текст</span>
                    <div className="text-picker__items">
                        {data.text.map(item => (
                            <div className="text-picker__item" onmousedown={() => {
                                console.log('SELECT color');
                                this.handleSelectText(item);
                            }}>
                                <div className="text-picker__icon-container">
                                    <span style={`color: ${item.color}`}>A</span>
                                </div>
                                <span className="text-picker__text">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="background-picker">
                    <span className="background-picker__label">Фон</span>
                    <div className="background-picker__items">
                        {data.bg.map(item => (
                            <div className="background-picker__item" onmousedown={() => this.handleSelectBackground(item)}>
                                <div className="background-picker__icon-container" style={`background: ${item.color}`}>
                                    <span>A</span>
                                </div>
                                <span className="background-picker__text">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}