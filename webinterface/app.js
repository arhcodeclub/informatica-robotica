const express = require("express");
const parser = require("body-parser");
const path = require("path");
const _ = require("lodash");
const { WebSocketServer } = require("ws");

const public_dir = path.join(__dirname, "public");

const app = express();
const port = 3000;

const robotClients = [];


// save the app server instance in a variable
const server = app.listen(port, () => {
    console.log("Started on port " + port);
});

// start websocket server with the before said server
const socket = new WebSocketServer({ server });

// handle connection
socket.on("connection", (e) => {
    e.on("error", console.error);

    console.log("connection");

    e.on("message", (data) => {
        console.log(JSON.parse(data));
    });
});

app.use(express.static(public_dir));
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());


setInterval(() => {
    socket.clients.forEach((client) => {
        client.send("test");
    })
}, 1000);