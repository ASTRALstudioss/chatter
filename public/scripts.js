const socket = io('http://localhost:3000');
let currentRoom = '';

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

function getRoomCodeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('room');
}

function joinRoom(roomCode) {
  if (roomCode.trim() !== '') {
    currentRoom = roomCode;
    console.log(`Joining room: ${currentRoom}`);
    socket.emit('joinRoom', roomCode);
    messages.innerHTML = ''; // Clear messages when switching rooms
  }
}

socket.on('history', (rows) => {
  console.log('Received history:', rows);
  rows.forEach((row) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = row.message;
    messages.appendChild(messageElement);
  });
  messages.scrollTop = messages.scrollHeight;
});

socket.on('message', ({ roomCode, message }) => {
  console.log(`Received message for room ${roomCode}: ${message}`);
  if (roomCode === currentRoom) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
  }
});

function sendMessage() {
  const message = messageInput.value;
  if (message.trim() !== '') {
    console.log(`Sending message: ${message}`);
    socket.emit('message', { roomCode: currentRoom, message });
    messageInput.value = '';
  }
}

messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

window.onload = () => {
  const roomCode = getRoomCodeFromUrl();
  if (roomCode) {
    joinRoom(roomCode);
  }
};
