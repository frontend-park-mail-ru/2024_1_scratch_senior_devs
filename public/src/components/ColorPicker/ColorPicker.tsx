import {ScReact} from '@veglem/screact';
import './ColorPicker.sass';

export class ColorPicker extends ScReact.Component<any, any> {
    handleSelectText = (item: { label: any; color: any; }) => {
        document.execCommand('foreColor', false, item.color)
        this.props.onSel('color', item.color);
        this.props.handleClose();
    };

    handleSelectBackground = (item: { label: any; color: any; }) => {
        document.execCommand('backColor', false, item.color)
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
                {
                    label: 'Фиолетовый',
                    color: 'rgb(147, 51, 234)'
                },
                {
                    label: 'Желтый',
                    color: 'rgb(234, 179, 8)'
                },
                {
                    label: 'Зеленый',
                    color: 'rgb(0, 138, 0)'
                },
                {
                    label: 'Оранжевый',
                    color: 'rgb(255, 165, 0)'
                },
                {
                    label: 'Розовый',
                    color: 'rgb(186, 64, 129)'
                },
                {
                    label: 'Серый',
                    color: 'rgb(168, 162, 158)'
                }
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
                {
                    label: 'Фиолетовый',
                    color: '#3f2c4b'
                },
                {
                    label: 'Желтый',
                    color: '#5c4b1a'
                },
                {
                    label: 'Зеленый',
                    color: '#1a5c20'
                },
                {
                    label: 'Оранжевый',
                    color: '#5c3a1a'
                },
                {
                    label: 'Розовый',
                    color: '#5c1a3a'
                },
                {
                    label: 'Серый',
                    color: '#3a3a3a'
                }
            ]
        };

        return (
            <div className={'color-picker-container ' + (this.props.open ? 'open' : '')}>
                <div className="text-color-picker-container">
                    <span className="label">Текст</span>
                    <div className="items">
                        {data.text.map(item => (
                            <div className="item" onmousedown={() => {
                                this.handleSelectText(item);
                            }}>
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
                            <div className="item" onmousedown={() => this.handleSelectBackground(item)}>
                                <div className="icon-container" style={`background: ${item.color}`}>
                                    <span>A</span>
                                </div>
                                <span className="text">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}