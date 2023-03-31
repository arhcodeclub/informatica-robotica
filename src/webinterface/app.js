const express = require("express");
const parser = require("body-parser");

const app = express()

app.use(express.static("public"));
app.use(parser.urlencoded({ extended: true }))
app.use(parser.json());

app.post("/action", (req, res)=>{
    console.log(req.body); 
});

// app.post('/upstart', (req, res) => {
//     console.log("up: start")
//     res.end("hello world")                                             
// })
// app.post('/leftstart', (req, res) => {
//     console.log("left: start")
//     res.end("hello world")
// })
// app.post('/rightstart', (req, res) => {
//     console.log("right: start")
//     res.end("hello world")
// })
// app.post('/downstart', (req, res) => {
//     console.log("down: start")
//     res.end("hello world")
// })
// app.post('/upstop', (req, res) => {
//     console.log("up: stop")
//     res.end("hello world")
// })
// app.post('/leftstop', (req, res) => {
//     console.log("left: stop")
//     res.end("hello world")
// })
// app.post('/rightstop', (req, res) => {
//     console.log("right: stop")
//     res.end("hello world")
// })
// app.post('/downstop', (req, res) => {
//     console.log("down: stop")
//     res.end("hello world")
// })

app.listen(3000, ()=>{
    console.log("Started!");
});