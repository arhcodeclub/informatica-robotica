const express = require('express')
const morgan = require('morgan')

const app = express()

app.listen(3000)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/upstart', (req, res) => {
    console.log("up: start")
    res.end("hello world")                                             
})
app.post('/leftstart', (req, res) => {
    console.log("left: start")
    res.end("hello world")
})
app.post('/rightstart', (req, res) => {
    console.log("right: start")
    res.end("hello world")
})
app.post('/downstart', (req, res) => {
    console.log("down: start")
    res.end("hello world")
})
app.post('/upstop', (req, res) => {
    console.log("up: stop")
    res.end("hello world")
})
app.post('/leftstop', (req, res) => {
    console.log("left: stop")
    res.end("hello world")
})
app.post('/rightstop', (req, res) => {
    console.log("right: stop")
    res.end("hello world")
})
app.post('/downstop', (req, res) => {
    console.log("down: stop")
    res.end("hello world")
})

app.get('/', (req, res) => {
    res.sendFile('./views/index.html', { root: __dirname });
});
