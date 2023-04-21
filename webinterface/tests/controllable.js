const { WebSocket } = require("ws");

const socket = new WebSocket("ws://localhost:3000");

let id;

socket.onopen = (e) => {

    socket.send(JSON.stringify({type: "controllable"}));

};

socket.onmessage = (msg) => {

    const data = JSON.parse(msg.data);

    if (!data) return;

    switch (data.type) {
        case "newId": {
            id = data.data;
    
            console.log("Acquired ID");
    
            socket.send(JSON.stringify({type: "connect"}));
        } break;

        case "input":
            // handle input...?
            break;

        default: break;
    }

    console.log(data);

};