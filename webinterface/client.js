class ControllableClient {
    socket;
    id;

    constructor(socket, id) {
        this.socket = socket;
        this.id = id;
    }
}

class ClientManager {
    clients;

    globalController;
    controllableIds;

    constructor() {
        this.clients = [];

        this.controllableIds = 0;
    }

    /** Optional id parameter, if given the current clients are checked for duplicates */
    addClient(ws, id) {
        if (id) {
            for (let c of this.clients) {
                if (c.id === id) return;
            }

            newId = id;
        }

        let newId = this.controllableIds++;

        let newClient = new ControllableClient(ws, newId);

        // send new id to controllable client
        newClient.socket.send(JSON.stringify({newId: newId}));

        newClient.socket.onmessage = (msg) => {};

        newClient.socket.onclose = (e) => { this.removeClient(newClient.id) };




        this.clients.push(newClient);
    }

    removeClient(id) {
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id === id) {
                this.clients[i].socket.close();
                this.clients.splice(i, 1);

                return;
            }
        }
    }

    broadcast(data) {
        this.clients.forEach(client => {

            client.socket.send(JSON.stringify(data));

        });
    }
}

module.exports = {
    ClientManager,
    ControllableClient
};