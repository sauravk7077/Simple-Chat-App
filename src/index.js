const {username, rooms} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, rooms);

// Make connection
window.socket = io.connect('http://localhost:3000');

let sendBtn = document.getElementById('send');
let dataInput = document.getElementById('input');
let chatsDiv = document.getElementById('chats');

sendBtn.addEventListener('click', ()=>{
    socket.emit('chat', dataInput.value);
    dataInput.value = '';
    dataInput.focus();
});


socket.on('message', (data)=>{
    displayData(data);
});
socket.on('chat', (data)=>{
    displayData(data);
})


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
}