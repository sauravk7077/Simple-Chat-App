// Make connection

window.socket = io.connect('http://localhost:3000');

var sendBtn = document.getElementById('send');
var dataInput = document.getElementById('text');

sendBtn.addEventListener('click', ()=>{
    socket.emit('chat', dataInput.value);
    dataInput.value = '';
});


socket.on('chat', (data)=>{
    document.getElementById('data').innerText += '\n' +data;
});