export class WebSocketConnection {
    private url
    private socket

    constructor(url:string) {
        this.url = url;
        this.socket = new WebSocket(url);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    }

    close() {
        this.socket.close();
    }

    open(url) {
        if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
            return;
        }

        this.socket = new WebSocket(url);
    }

    onMessage(event) {
        console.log('WebSocket message received:', event.data);
    }

    setOnMessageMethod(callback) {
        this.socket.onmessage = callback;
    }

    onError(event) {
        console.log('WebSocket error:', event);
    }

    onClose(event) {
        console.log('WebSocket connection closed:', event);
        setTimeout(() => {
            this.socket = new WebSocket(this.url);
        }, 5000); // Попытка повторного подключения через 5 секунд
    }

    sendMessage(message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.log('WebSocket connection is not open. Cannot send message.');
        }
    }
}