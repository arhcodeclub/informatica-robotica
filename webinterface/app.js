const express = require("express");
const parser = require("body-parser");
const path = require("path");
const _ = require("lodash");
const { WebSocketServer } = require("ws");

const public_dir = path.join(__dirname, "public");

const app = express();
const port = 3000;

// save the app server instance in a variable
const server = app.listen(port, () => {
    console.log("Started on expressPort " + port);
});

// start websocket server with the before said server
const socket = new WebSocketServer({ server });

// handle connection
socket.on("connection", (ws) => {
    ws.on("error", console.error);

    ws.on("message", (data) => {
        console.log("received: " + data);
    });

    ws.send("received");
});

app.use(express.static(public_dir));
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.post("/action", (req, res) => {
    console.log(req.body);
    // handle the action

    res.send("Received request");
});

// test socket functionality
function broadcast(msg) {
    socket.clients.forEach((client) => {
        client.send(msg);
    });
}

setInterval(()=>broadcast("broadcast interval"), 1000);