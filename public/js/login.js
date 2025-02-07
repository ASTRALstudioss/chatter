function login() {
    const username = document.getElementById('usernameInput').value.trim();
    const room = document.getElementById('roomInput').value.trim();

    if (username && room) {
        localStorage.setItem('username', username);
        window.location.href = `chat.html?room=${room}`;
    } else {
        alert('Please enter both a username and a room name.');
    }
}
