const apiBaseUrl = 'https://your-vercel-app.vercel.app/public/api';
let currentRoom = '';
let username = '';

async function createRoom() {
  const response = await fetch(`${apiBaseUrl}/createRoom`);
  const data = await response.json();
  if (data.roomCode) {
    window.location.href = `/chat.html?room=${data.roomCode}&username=${username}`;
  }
}

async function joinRoom(roomCode, username) {
  if (roomCode.trim() !== '' && username.trim() !== '') {
    const response = await fetch(`${apiBaseUrl}/joinRoom?roomCode=${roomCode}&username=${username}`);
    const messages = await response.json();
    currentRoom = roomCode;
    if (!messages.error) {
      messages.forEach((msg) => {
        const messageElement = document.createElement('p');
        messageElement.textContent = `${msg.username}: ${msg.message}`;
        document.getElementById('messages').appendChild(messageElement);
      });
      document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
    }
  }
}

async function sendMessage() {
  const message = document.getElementById('messageInput').value;
  if (message.trim() !== '') {
    await fetch(`${apiBaseUrl}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomCode: currentRoom, username, message }),
    });
    document.getElementById('messageInput').value = '';
    joinRoom(currentRoom, username); // Refresh messages
  }
}

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  currentRoom = urlParams.get('room');
  username = urlParams.get('username');
  if (currentRoom && username) {
    joinRoom(currentRoom, username);
  }
};
