const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get('room');
const username = localStorage.getItem('username');

if (!username || !room) {
    alert('Invalid username or room. Redirecting to login.');
    window.location.href = 'index.html';
}

socket.emit('joinRoom', { username, room });

socket.on('chatHistory', (history) => {
    const chatBox = document.getElementById('chatBox');
    history.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.username}: ${message.message}`;
        chatBox.appendChild(messageElement);
    });
});

function sendMessage() {
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
