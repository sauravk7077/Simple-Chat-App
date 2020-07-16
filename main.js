const express = require('express');
const socket = require('socket.io');
const session = require('express-session');
const fmsg = require('./others/messages'); //format message

const app = express();

const PORT = 3000;

const server = app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}.`);
});

let io = socket(server);

app.set('view engine', 'ejs');

app.use(express.static('src'));
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false
}));


io.on('connection', (socket)=>{
    console.log('Connection is made');
    socket.emit('message', fmsg('ChatBoom', "Welcome to ChatBoom."));
    socket.broadcast.emit('message', fmsg('ChatBoom', `A user has joined the room.`));
    socket.on('chat', (data)=>{
        socket.broadcast.emit('chat', fmsg('User', data));
    });
    socket.on('disconnect', ()=>{
        socket.broadcast.emit('message', fmsg("ChatBoom", `A user has disconnected`));
    });
});



app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/chat', (req,res)=>{
    if(req.session.username){
        res.render('chat');
    }else{
        res.redirect('/');
    }
});

app.post('/chat', (req, res)=>{
    req.session.username = req.body.username;
    req.session.room = req.body.rooms;
    res.render('chat');
});
