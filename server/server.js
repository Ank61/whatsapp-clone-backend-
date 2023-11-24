const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()
const setupRoutes = require("./Routes/index")
const socketio = require('socket.io');

const port = process.env.PORT || 8080;

let app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
const server = require('http').Server(app);
const io = socketio(server, { cors: { origin: '*' } })
const users = [];

io.on('connection', (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (data) => {
        const { user } = data
        socket.join(user);
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("new message", (newMessageRecieved) => {
        const { to, message } = newMessageRecieved;
        socket.in(to).emit("message recieved", newMessageRecieved);
    });

socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.username}`);
});
});

setupRoutes(app)
mongoose.connect(process.env.URL).then((res) => {
    console.log('Database connected successfully!');
}).catch((error) => {
    console.log("Error occured while connecting", error);
})

server.listen(port, () => {
    console.log("Server running on port no :- ", port);
});