class EventMaker{
    #eventsMap;

    constructor() {
        this.#eventsMap = new Map();
    }

    /**
     *
     * @param event{string}
     * @param callback{function}
     */
    subscribe(event, callback){
        if (event in this.#eventsMap){
            this.#eventsMap[event].add(callback);
            return;
        }
        this.#eventsMap[event] = new Set([callback]);
    }

    /**
     *
     * @param event{string}
     * @param callback{function}
     */
    unsubscribe(event, callback){
        this.#eventsMap[event].delete(callback);
    }

    /**
     *
     * @param event{string}
     * @param args{any}
     */
    notify(event, ...args){
        if(!(event in this.#eventsMap)){
            return;
        }

        this.#eventsMap[event].forEach((listener) => {
            listener.apply(this, args);
        });
    }
}

export const AppEventMaker = new EventMaker();