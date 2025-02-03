const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const MESSAGE_DIR = path.join(__dirname, '..', '..', 'messages');
  if (!fs.existsSync(MESSAGE_DIR)) {
    fs.mkdirSync(MESSAGE_DIR);
  }

  const roomCode = uuidv4();
  const roomFile = path.join(MESSAGE_DIR, `${roomCode}.json`);
  fs.writeFileSync(roomFile, JSON.stringify([]));
  res.json({ roomCode });
};
