export class BaseStore<S> {
    protected state: S;

    private callbacks: Set<(state: S) => void> = new Set

    public SubscribeToStore(callback: (state: S) => void) {
        this.callbacks.add(callback);
    }

    public UnSubscribeToStore(callback: (state: S) => void) {
        this.callbacks.delete(callback);
    }

    protected SetState(updater: (u: S) => S){
        this.state = updater(this.state);
        this.callbacks.forEach((callback: (state: S) => void) => {
            callback(this.state);
        })
    }
}