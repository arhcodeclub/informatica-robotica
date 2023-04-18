const { WebSocket } = require("ws");

const socket = new WebSocket("ws://localhost:3000");

let controllableClientIds = [];

socket.onopen = (e) => {

    socket.send(JSON.stringify({isController: 1}));

};

socket.onmessage = (msg) => {

    const data = JSON.parse(msg.data);

    if (data.clients) controllableClientIds = data.cleints;

    console.log(data);

};

setInterval(() => {
    socket.send(JSON.stringify({isController: 1}));
}, 5000);