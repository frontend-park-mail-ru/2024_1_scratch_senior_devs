import {ScReact} from '@veglem/screact';

export class SwipeArea extends ScReact.Component<any, any> {
    state = {
        x: null,
        y: null
    };

    componentDidMount() {
        document.querySelector(this.props.target).addEventListener('touchstart', this.handleTouchStart, false);
        document.querySelector(this.props.target).addEventListener('touchmove', this.handleTouchMove, false);
    }

    componentWillUnmount() {
        document.querySelector(this.props.target).removeEventListener('touchstart', this.handleTouchStart, false);
        document.querySelector(this.props.target).removeEventListener('touchmove', this.handleTouchMove, false);
    }

    handleTouchStart = (e) => {
        const firstTouch = e.touches[0];
        this.setState(state => ({
            ...state,
            x: firstTouch.clientX,
            y: firstTouch.clientY
        }));
    };

    handleTouchMove = (e) => {
        if (!this.state.x || !this.state.y || !this.props.enable) {
            return false;
        }

        const x2 = e.touches[0].clientX;
        const y2 = e.touches[0].clientY;
        const xDiff = x2 - this.state.x;
        const yDiff = y2 - this.state.y;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 100) {
                this.props.right && this.props.right();
            } else {
                this.props.left && this.props.left();
            }
        } else {
            if (yDiff > 0) {
                this.props.top && this.props.top();
            } else {
                this.props.bottom && this.props.bottom();
            }
        }
    };

    render() {
        return (
            <div>

            </div>
        );
    }
}