import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Toast} from "../components/Toast/Toast";
import {createUUID} from "./utils";


export const TOAST_TYPE = {
    SUCCESS: "success",
    ERROR: "error",
    INFO: "info"
};

export type TOAST_DATA = {
    type: string,
    message: string,
    id: string,
    offset: number,
    open: boolean
}

type ToastState = {
    toasts: TOAST_DATA[]
}

const TOAST_DEFAULT_OFFSET_BOTTOM = 25

const TOAST_SHOW_DELAY = 3000
const TOAST_HIDE_ANIMATION_DELAY = 300
const MAX_TOASTS = 3

export class Toasts extends ScReact.Component<any, ToastState> {
    state = {
        toasts: []
    }

    constructor() {
        super();
        AppToasts = this;
    }

    success (message:string) {
        this.setupToast(TOAST_TYPE.SUCCESS, message)
    }

    error (message:string) {
        this.setupToast(TOAST_TYPE.ERROR, message)
    }

    setupToast = (type:string, message:string) => {
        this.setState(state => ({
            ...state,
            toasts: state.toasts.map(toast => {
                toast.offset += 100
                return toast
            })
        }))

        const toast = {
            open: true,
            type: type,
            message: message,
            id: createUUID(),
            offset:TOAST_DEFAULT_OFFSET_BOTTOM
        }

        this.setState(state => ({
            ...state,
            toasts: state.toasts.concat(toast)
        }))

        setTimeout(() => {
            this.closeToast(toast.id)
        }, TOAST_SHOW_DELAY)

        if (this.state.toasts.length > MAX_TOASTS) {
            this.closeToast(this.state.toasts[0].id)
        }
    }

    closeToast = (id:string) => {
        if (!this.state.toasts.find(t => t.id == id)) {
            return
        }

        this.setState(state => ({
            ...state,
            toasts: state.toasts.map(toast => {
                if (toast.id === id) {
                    toast.open = false
                }

                return toast
            })
        }))

        setTimeout(() => {
            this.removeToast(id)
        }, TOAST_HIDE_ANIMATION_DELAY)
    }

    removeToast = (id:string) => {
        const toastToRemove = this.state.toasts.find(t => t.id == id)

        if (!toastToRemove) {
            return
        }

        this.setState(state => ({
            ...state,
            toasts: state.toasts.map(toast => {
                if (state.toasts.indexOf(toastToRemove) > state.toasts.indexOf(toast)) {
                    toast.offset -= 100
                }

                return toast
            })
        }))

        this.setState(state => ({
            ...state,
            toasts: state.toasts.filter(toast => toast.id !== id)
        }))
    }

    render(): VDomNode {
        const toasts = this.state.toasts.map(toast => (
            <Toast key1={toast.id} type={toast.type} message={toast.message} onHide={this.closeToast} offset={toast.offset} open={toast.open}/>
        ))

        return (
            <div>
                {toasts}
            </div>
        );
    }
}

export let AppToasts = undefined