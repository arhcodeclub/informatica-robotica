class SocketCommunication {
    socket;
    oneventCallbacks;

    constructor(url) {
        this.connect(url);

        this.oneventCallbacks = [];
        this.socket = undefined;
    }

    addCallback(callback) {
        this.oneventCallbacks.push(callback);
    }

    runEventCallbacks(event) {
        for (let i = 0; i < this.oneventCallbacks.length; i++)
            this.oneventCallbacks[i](event);
    }

    connect(url) {
        try {
            this.socket = new WebSocket(url);

            // run event callback when trying to connect
            this.runEventCallbacks({srcElement: this.socket, type: "connecting"});

            this.socket.onopen = (e) => {
                // send initial message to server
                this.sendData({isController: 1});
                this.runEventCallbacks(e);
            };
        
            // socket server response handler, does nothing atm
            this.socket.onmessage = (e) => {
                this.runEventCallbacks(e);
            };
        
            this.socket.onerror = (e) => {
                this.runEventCallbacks(e);
            };
        
            this.socket.onclose = (e) => {
                this.runEventCallbacks(e);
            };


        } catch(e) { return; }
    }

    getState() {
        return this.socket.readyState;
    }

    /** sends javascript object to websocket endpoint */
    sendData(object) {
        if (this.getState() !== WebSocket.OPEN) return;

        const data = JSON.stringify(object);

        this.socket.send(data);
    }
}