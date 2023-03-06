import net from 'net';
import promptSync from 'prompt-sync';

const client = new net.Socket();
const prompt = promptSync();

let nickname = '';
let boatsPositioned = false;

client.connect(3000, 'localhost', () => {
  console.log('Connected to server');
  nickname = prompt('Enter your nickname: ');
  client.write(`My nickname is ${nickname}\n`);
});

client.on('data', (data: Buffer) => {
  const message = data.toString().trim();
  console.log(message);

  if (message.startsWith('Welcome,')) {
    if (!boatsPositioned) {
      const board = prompt('Enter your boats position: ');
      client.write(board);
      boatsPositioned = true;
    }
  } else if (message === 'Your turn to play. Enter your move: ') {
    const move = prompt('Enter your move: ');
    client.write(move);
  } else if (message.startsWith('Let the game begin!')) {
   const move = prompt('Enter your move: ');
   client.write(move);
  } else if (message === 'Invalid move. Enter another move: ') {
    console.log(message);
    const move = prompt('Enter your move: ');
    client.write(move);
  }
});

client.on('close', () => {
  console.log('Connection closed');
});
