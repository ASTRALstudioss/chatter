const socket = io('http://localhost:3000');
let currentRoom = '';
let username = '';

const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

function getRoomCodeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('room');
}

function getUsernameFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('username');
}

function joinRoom(roomCode, username) {
  if (roomCode.trim() !== '' && username.trim() !== '') {
    currentRoom = roomCode;
    console.log(`Joining room: ${currentRoom}`);
    socket.emit('joinRoom', { roomCode, username });
    messages.innerHTML = ''; // Clear messages when switching rooms
  }
}

socket.on('history', (rows) => {
  console.log('Received history:', rows);
  rows.forEach((row) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${row.username}: ${row.message}`;
    messages.appendChild(messageElement);
  });
  messages.scrollTop = messages.scrollHeight;
});

socket.on('message', ({ roomCode, username, message }) => {
  console.log(`Received message for room ${roomCode} from ${username}: ${message}`);
  if (roomCode === currentRoom) {
    const messageElement = document.createElement('p');
    messageElement.textContent = `${username}: ${message}`;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
  }
});

function sendMessage() {
  const message = messageInput.value;
  if (message.trim() !== '') {
    console.log(`Sending message: ${message}`);
    socket.emit('message', { roomCode: currentRoom, username, message });
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
  username = getUsernameFromUrl();
  if (roomCode && username) {
    joinRoom(roomCode, username);
  }
};
