const express = require("express");
const parser = require("body-parser");
const _ = require("lodash");
const path = require("path");

const public_dir = path.join(__dirname, "public");

const app = express();
const port = 3000;

app.use(express.static(public_dir));

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());



app.post("/action", (req, res) => {
    console.log(req.body);
    // handle the action

    res.send("Received request");
});



app.listen(port, () => {
    console.log("Started on port " + port);
});