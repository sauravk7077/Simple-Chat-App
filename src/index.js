
// Make connection
const socket = io.connect('http://localhost:3000');

socket.emit('joinRoom', {username, room});

let sendBtn = document.getElementById('send');
let dataInput = document.getElementById('input');
let chatsDiv = document.getElementById('chats');
let leaveBtn = document.getElementById('leave');
let usersDiv = document.getElementById('users');

leaveBtn.addEventListener('click', ()=>{
    socket.disconnect();
    location.replace('/');
});
sendBtn.addEventListener('click', submitMessage);
dataInput.addEventListener('keydown', (e)=>{
    if (e.keyCode == 13) {
        submitMessage();
    }
});

socket.on('allUsers', ({room, usernames})=>{
    showUsers(usernames);
});


socket.on('message', (data)=>{
    displayData(data);
});
socket.on('chat', (data)=>{
    displayData(data);
});

function submitMessage() {
    socket.emit('chat', dataInput.value);
    //Clears the input
    dataInput.value = '';
    dataInput.focus();
}

function displayData(object) {
    let msg = document.createElement('div');
    let meta = document.createElement('p');
    let message = document.createElement('p');
    meta.innerText = object.username + " - " + object.time;
    message.innerText = object.text;
    meta.className = "meta";
    message.className = "text";
    msg.className = "message";
    msg.append(meta, message);
    chatsDiv.append(msg);
    chatsDiv.scrollTop = chatsDiv.scrollHeight;
}

function showUsers(usernames) {
    usersDiv.innerHTML = `
        ${usernames.map(u=>`<div class="user"> ${u} </div>`).join('')}
    `;
}