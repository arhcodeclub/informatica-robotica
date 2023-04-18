const { WebSocket } = require("ws");

const socket = new WebSocket("ws://localhost:3000");

let id;

socket.onopen = (e) => {

    socket.send(JSON.stringify({isController: 0}));

};

socket.onmessage = (msg) => {

    const data = JSON.parse(msg.data);

    if (!data) return;

    if (data.newId !== undefined) {
        id = data.newId;

        console.log("Acquired ID");
    }

    console.log(data);

};