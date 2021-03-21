const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000
const path = require('path');

app.use(express.static(__dirname + "/public"))


function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--
    }
}

function SendOffer(offer) {
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    this.broadcast.emit("BackAnswer", data)
}

// app.get('/', function(req, res){
//     res.render('/public/login.html')
// })
// app.listen(port, () => console.log(`Active on ${port} port`))
let clients = 0

io.on('connection', function (socket) {
    socket.on("NewClient", function () {
        if (clients < 2) {
            if (clients == 1) {
                this.emit('CreatePeer')
            }
        }
        else
            this.emit('SessionActive')
        clients++;
    })
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
})

app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname+'/public/login.html'))
})

app.get('/register', function(req, res){
    res.sendFile(path.join(__dirname+'/public/register.html'))
})

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/public/index.html'))
})

app.get('/video_chat', function(req, res){
    res.sendFile(path.join(__dirname+'/public/video_chat.html'))
})

app.get('/user', function(req, res){
    res.sendFile(path.join(__dirname+'/public/index_mock.html'))
})

// app.listen(5000, () => console.log(`Active on 5000 port`))


http.listen(port, () =>{
    
    console.log(`Active on ${port} port`)

})



