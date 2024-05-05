import {isDebug} from "../utils/consts";
import {AppUserStore} from "./stores/UserStore";

const baseUrl = isDebug ? 'ws://localhost:8080/api/' : 'wss://you-note.ru/api/';

export class WebSocketConnection {
    private socket

    constructor(url:string) {
        this.socket = new WebSocket(baseUrl + url,[AppUserStore.state.JWT.split(" ").at(-1)]);
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

    onMessage(callback) {
        this.socket.onmessage = callback;
    }

    onOpen(callback) {
        this.socket.onopen = callback;
    }

    sendMessage(message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        }
    }
}