type Action = {
    type: string,
    payload: object
}

class Dispatcher {
    private callbacks: Array<(action: Action) => void | Promise<void>> = []

    register(callback: (action: Action) => void | Promise<void>) {
        this.callbacks.push(callback);
    }

    dispatch(action: Action) {
        this.callbacks.forEach((callback) => {
            callback(action);
        })
    }
}

export const AppDispatcher = new Dispatcher();
