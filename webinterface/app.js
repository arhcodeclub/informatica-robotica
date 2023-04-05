const express = require("express");
const parser = require("body-parser");
const _ = require("lodash");

const app = express();

app.use(express.static("public"));
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.post("/action", (req, res) => {
    console.log(req.body);
    // handle the action

    res.send("Received request");
});

app.listen(3000, () => {
    console.log("Started!");
});
