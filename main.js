const express = require('express');
const socket = require('socket.io');
const session = require('express-session');
const fmsg = require('./others/messages'); //format message
const {join, removeUser, getAllUsername, getCurrentUser} = require('./others/users');

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

    socket.on('joinRoom', ({username, room})=>{
        let user = join(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', fmsg('ChatBoom', "Welcome to ChatBoom."));
        socket.broadcast.to(user.room).emit('message', fmsg('ChatBoom', `${user.username} has joined the room.`));
        socket.on('chat', (data)=>{
            io.to(user.room).emit('message', fmsg(user.username, data));
        });
        io.to(user.room).emit('allUsers', {
            usernames: getAllUsername()
        });
        
    });
    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);
        if(user)
        {  
            socket.broadcast
            .to(user.room)
            .emit('message', fmsg("ChatBoom", `${user.username} has disconnected`));

            io.to(user.room).emit('allUsers', {
                room: user.room,
                usernames: getAllUsername()
            });
        }
    });
    
});



app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/chat', (req,res)=>{
    if(req.session.username){
        res.render('chat', { username: req.session.username, room: req.session.room});
    }else{
        res.redirect('/');
    }
});

app.post('/chat', (req, res)=>{
    req.session.username = req.body.username;
    req.session.room = req.body.rooms;
    res.render('chat', { username: req.body.username, room: req.body.rooms});
});
