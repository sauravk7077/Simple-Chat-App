const express = require('express');
const socket = require('socket.io');

const app = express();

const PORT = 3000;

const server = app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}.`);
});

let io = socket(server);

app.use(express.static('src'));


io.on('connection', (socket)=>{
    console.log('Connection is made');

    socket.on('chat', (data)=>{
        socket.emit('chat', data);
    });
    socket.on('disconnect', ()=>{
        console.log('User disconnected');
    })
});
