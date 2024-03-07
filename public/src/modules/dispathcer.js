class Dispatcher{
    #callbacks;

    constructor() {
        this.#callbacks = [];
    }

    /**
     *
     * @param callback{function}
     */
    register(callback){
        this.#callbacks.push(callback);
    }

    /**
     *
     * @param action{type: string, payload: any}
     */
    dispatch(action){
        this.#callbacks.forEach((callback) => {
            callback(action);
        });
    }
}

export const AppDispatcher = new Dispatcher();