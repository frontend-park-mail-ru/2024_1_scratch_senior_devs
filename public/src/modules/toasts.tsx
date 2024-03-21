import {ScReact} from "@veglem/screact";
import {VDomNode} from "@veglem/screact/dist/vdom";
import {Toast} from "../components/Toast/Toast";
import {createUUID} from "./utils";


export const TOAST_TYPE = {
    SUCCESS: "success",
    ERROR: "error"
};

export type TOAST_DATA = {
    type: string,
    message: string,
    id: string,
    offset: number
}

type ToastState = {
    toasts: TOAST_DATA[]
}

const TOAST_DEFAULT_OFFSET_BOTTOM = 25

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
            type: type,
            message: message,
            id: createUUID(),
            offset:TOAST_DEFAULT_OFFSET_BOTTOM
        }

        this.setState(state => ({
            ...state,
            toasts: state.toasts.concat(toast)
        }))

        // TODO: Ограничить количество тостов
        // this.state.toasts.splice(4).forEach(toast => {
        //     this.removeToast(toast.id)
        // })
    }

    removeToast = (id:string) => {
        const toastToRemove = this.state.toasts.find(t => t.id == id)

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
        return (
            <div>
                {this.state.toasts.map(toast => (
                    <Toast key1={toast.id} type={toast.type} message={toast.message} onHide={this.removeToast} offset={toast.offset}/>
                ))}
            </div>
        );
    }
}

export let AppToasts = undefined