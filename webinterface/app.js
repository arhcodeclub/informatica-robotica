const dotenv = require("dotenv");
const express = require("express");
const parser = require("body-parser");
const path = require("path");
const { WebSocketServer, WebSocket } = require("ws");

const config = dotenv.config(path.join(__dirname, ".env"));

const port = process.env.SERVER_PORT;

const app = express();

const public_dir = path.join(__dirname, "public");

app.use(express.static(public_dir));
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());


const tempClients = [];
const controllables = [];
/** only one controller for now, might fix in the future */
let controller;
let nextId = 0;

/** returns success state */
function addControllable(ws) {
    if (!(ws instanceof WebSocket)) return false;

    for (let i = 0; i < controllables.length; i++) {
        console.log(ws === controllables[i].ws)

        if (controllables[i].ws === ws) return false;
    }

    let id = nextId++;

    let newControllable = {id, ws};

    controllables.push(newControllable);

    // broadcast new client
    if (controller)
        controller.send(JSON.stringify({type: "addClient", data: newControllable.id}));

    return newControllable;
}

function removeControllable(ws) {
    for (let i = 0; i < controllables.length; i++) {
        if (controllables[i].ws === ws) {

            // broadcast old client
            if (controller)
                controller.send(JSON.stringify({type: "removeClient", data: controllables[i].id}))

            controllables.splice(i, 1);
            return;
        }
    }
}

/** returns success state */
function removeTempClient(ws) {
    let i = tempClients.indexOf(ws);

    if (i < 0) return false;

    tempClients.splice(i, 1);

    return true;
}

function addTempClient(ws) {
    tempClients.push(ws);
}

function onInput(data) {
    for (let i = 0; i < controllables.length; i++) {
        if (controllables[i].id === data.id) {
            controllables[i].ws.send(JSON.stringify(data));
        }
    }
}

// save the app server instance in a variable
const server = app.listen(port, () => {
    console.log("Started on port " + port);
});

// start websocket server with the before said server
const socket = new WebSocketServer({ server });

// handle connection
socket.on("connection", (ws) => {

    addTempClient(ws);

    ws.on("error", console.error);

    // client has to send it's type (controller/controllable)
    ws.on("message", (rawdata) => {

        const data = JSON.parse(rawdata);

        if (!data) return;

        switch (data.type) {
            case "connect": 
                removeTempClient(ws);
                break;

            case "controller":
                controller = ws;

                ws.send(JSON.stringify({type: "connect"}));

                break;

            case "requestClients": {
                let clients = [];

                for (let i = 0; i < controllables.length; i++) {
                    clients.push(controllables[i].id);
                }
                
                ws.send(JSON.stringify({type: "responseClients", data: clients}));
            } break;

            case "controllable": {
                let newClient = addControllable(ws);

                if (!newClient) {
                    ws.send(JSON.stringify({type: "error", data: "failed to add new client"}));

                    return;
                }

                ws.send(JSON.stringify({type: "newId", data: newClient.id}));

            } break;

            case "input": 

                onInput(data.data);

                break;

            default: break;
        }

    });

    ws.on("close", (e) => {

        // remove from clients list
        removeControllable(ws);

    });

    setTimeout(() => {
        
        // remove from temp clients after some time; timeout
        let success = removeTempClient(ws);

        if (!success) return;

        ws.send(JSON.stringify({type: "error", data: "timed out"}));
    }, 2000);

});

// FOR TESTING PURPOSES

// setInterval(() => {
//     clientManager.broadcast({msg: "test broadcast"});
// }, 1000);