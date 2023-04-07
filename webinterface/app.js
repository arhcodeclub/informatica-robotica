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
    console.log("Started on port " + port);
});



// start websocket server with the before said server
const socket = new WebSocketServer({ server });



// handle connection
socket.on("connection", (e) => {
    e.on("error", console.error);

    e.on("message", (data, isBinary) => {

        console.log(JSON.parse(data));
    
    });
});


app.use(express.static(public_dir));
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());