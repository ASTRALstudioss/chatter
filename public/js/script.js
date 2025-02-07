const socket = io();

let username = '';
let room = '';

function joinChat() {
    username = document.getElementById('usernameInput').value.trim();
    room = document.getElementById('roomInput').value.trim();

    console.log('Username:', username);
    console.log('Room:', room);

    if (username && room) {
        document.querySelector('.login-container').style.display = 'none';
        document.querySelector('.chat-container').style.display = 'flex';

        socket.emit('joinRoom', { username, room });
    } else {
        alert('Please enter both a username and a room name.');
    }
}

socket.on('chatHistory', (history) => {
    const chatBox = document.getElementById('chatBox');
    history.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.username}: ${message.message}`;
        chatBox.appendChild(messageElement);
    });
});

function sendMessage() {
    const chatBox = document.getElementById('chatBox');
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
        socket.emit('message', message);
        messageInput.value = '';
    }
}

socket.on('message', (message) => {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.username}: ${message.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

document.getElementById('messageInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
