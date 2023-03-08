import net from 'net';
import promptSync from 'prompt-sync';

const client = new net.Socket();
const prompt = promptSync();

let nickname = '';
let password = '';
let boatsPositioned = false


client.connect(3000, 'localhost', () => {
  console.log('Connected to server');

  const answer = prompt('Already have a account? (y/n): ')
  let action: string = 'Login'


  if(answer.toLocaleLowerCase() == 'n'){
    console.log('Register ==========')
    action = 'Register'
  }
    nickname = prompt('Enter your nickname: ');
    password = prompt('Enter your password: ');

    const userInfoString = `${action} ${nickname} ${password}`
  
    client.write(userInfoString);
});

client.on('data', (data: Buffer) => {
  const message = data.toString().trim();
  const [action, ...params] = message.split(' ') 

  if(action == 'PositionBoats') {
    console.log(`Welcome, ${params}`);
    if (!boatsPositioned) {
      let board = ''

      console.log('Enter column and line. ex: 01')
      for (let i = 0; i < 5; i++) {
        board += prompt('Enter your boats position: ');
      }

      console.log(board)

      client.write(`PositionBoats ${board}`);
      boatsPositioned = true;
    }
  }

  if(action == 'Waiting'){
    console.log(message)
  }

  if(action == 'Attack') {
    const attack = prompt('Digite um x e um y: ')

    client.write(attack)
  }
  
  
  
  
  
  
  /*
    
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
  }*/
});

client.on('close', () => {
  console.log('Connection closed');
});
