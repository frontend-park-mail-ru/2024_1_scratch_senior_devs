import {isDebug} from "../utils/consts";
import {AppUserStore} from "./stores/UserStore";

const baseUrl = isDebug ? 'ws://localhost:8080/api/' : 'wss://you-note.ru/api/';

export class WebSocketConnection {
    private url
    private socket

    constructor(url:string) {
        this.url = url;
        console.log(baseUrl)
        this.socket = new WebSocket(baseUrl + url,[AppUserStore.state.JWT.split(" ").at(-1)]);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
    }

    close() {
        this.socket.close();
    }

    open(url:string) {
        if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
            return;
        }

        this.socket = new WebSocket(baseUrl + url,[AppUserStore.state.JWT.split(" ").at(-1)]);
    }

    onMessage(event) {
        console.log('WebSocket message received:', event.data);
    }

    onError(event) {
        console.log('WebSocket error:', event);
    }

    sendMessage(message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.log('WebSocket connection is not open. Cannot send message.');
        }
    }
}