class EventMaker{
    #eventsMap;

    constructor() {
        this.#eventsMap = new Map();
    }

    subscribe(event, callback){
        if (event in this.#eventsMap){
            this.#eventsMap[event].add(callback);
            return;
        }
        this.#eventsMap[event] = new Set([callback]);
    }

    unsubscribe(event, callback){
        this.#eventsMap[event].delete(callback);
    }

    notify(event, ...args){
        if(!(event in this.#eventsMap)){
            return;
        }

        this.#eventsMap[event].forEach((listener) => {
            listener.apply(this, args);
        })
    }
}

export const AppEventMaker = new EventMaker();