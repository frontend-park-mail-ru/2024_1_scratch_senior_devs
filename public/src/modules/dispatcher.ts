type Action = {
    type: string,
    payload?: any
}

class Dispatcher {
    private callbacks: Array<(action: Action) => void | Promise<void>> = [];

    register(callback: (action: Action) => void | Promise<void>) {
        this.callbacks.push(callback);
    }

    dispatch(type:string, payload:any=null) {
        const action = {
            type: type,
            payload: payload
        };

        this.callbacks.forEach((callback) => {
            callback(action);
        });
    }
}

export const AppDispatcher = new Dispatcher();
