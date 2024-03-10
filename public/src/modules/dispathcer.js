/** @typedef  {{type: string, payload: any}} CallbackAction**/

class Dispatcher{
    #callbacks;

    /**
     * Конструктор класса
     */
    constructor() {
        this.#callbacks = [];
    }

    /**
     * Регистрация калбэка
     * @param callback {function}
     */
    register(callback){
        this.#callbacks.push(callback);
    }

    /**
     *
     * @param action {CallbackAction}
     */
    dispatch(action){
        this.#callbacks.forEach((callback) => {
            callback(action);
        });
    }
}

export const AppDispatcher = new Dispatcher();