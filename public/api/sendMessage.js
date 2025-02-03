const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { roomCode, username, message } = req.body;
  const roomFile = path.join(__dirname, '..', '..', 'messages', `${roomCode}.json`);

  if (fs.existsSync(roomFile)) {
    const messages = JSON.parse(fs.readFileSync(roomFile, 'utf-8'));
    messages.push({ username, message, timestamp: new Date() });
    fs.writeFileSync(roomFile, JSON.stringify(messages));
    res.status(200).json({ success: true });
  } else {
    fs.writeFileSync(roomFile, JSON.stringify([]));
    res.status(404).json({ error: 'Room not found, but a new one has been created.' });
  }
};
