const dotenv = require("dotenv");
const express = require("express");
const parser = require("body-parser");
const path = require("path");
const { WebSocketServer } = require("ws");
const { ClientManager } = require("./client");

const public_dir = path.join(__dirname, "public");

const app = express();
const port = 3000;

const clientManager = new ClientManager();
const tempClients = [];


// save the app server instance in a variable
const server = app.listen(port, () => {
    console.log("Started on port " + port);
});

// start websocket server with the before said server
const socket = new WebSocketServer({ server });

// handle connection
socket.on("connection", (ws) => {

    tempClients.push(ws);

    // check if client is valid

    ws.onmessage = (msg) => {

        const data = JSON.parse(msg.data);

        if (!data) return;

        console.log(data);

        if (data.isController) { 
            clientManager.globalController = ws;
        
            // send list of client id's to controller
            let clients = [];

            for (let i = 0; i < clientManager.clients.length; i++) {
                clients.push(clientManager.clients[i].id);
            }

            ws.send(JSON.stringify({clients: clients}));
        }
        else clientManager.addClient(ws, data.id);

    };

});

app.use(express.static(public_dir));
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());


// FOR TESTING PURPOSES

// setInterval(() => {
//     clientManager.broadcast({msg: "test broadcast"});
// }, 1000);