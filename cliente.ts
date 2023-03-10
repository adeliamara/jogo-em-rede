import net from 'net';
import promptSync from 'prompt-sync';

const client = new net.Socket();
const prompt = promptSync();

let nickname = '';
let password = '';
let boatsPositioned = false


client.connect(3000, 'localhost', () => {
  console.log('Connected to server');

  const userInfoString = getNicknameAndPassword();

  client.write(userInfoString);
});

client.on('data', (data: Buffer) => {
  const message = data.toString();
  const [action, ...params] = message.split(/\s(.+)/);

  if (action == 'Credenciais') {
    console.log("Password incorrect!")
    
    const userInfoString = getNicknameAndPassword();

    client.write(userInfoString);
  }
  if (action == 'Welcome,') {
    if (!boatsPositioned) {
      let board = ''

      console.log('Enter column and line. ex: 01')
      for (let i = 0; i < 2; i++) {
        let position = prompt('Enter your boats position: ').trim();
        while (Number(position[0]) > 4 || Number(position[1]) > 4) {
          position = prompt('Max dimension is 4. Enter yout boats position:')
        }

        board += position + ' ';

      }


      client.write(`PositionBoats ${board}`);
      boatsPositioned = true;
    }
  }

  if (action == 'Waiting') {
    console.log(message)
  }

  if (action == 'Attack') {
    const attack = prompt('Digite um x e um y: ')

    client.write(attack)
  }


  if (action == 'PrintPlayer') {
    console.log("Meu tabuleiro: ")
    console.log(params, '\n')
  }


  if (action == 'FinalPrint') {
    console.log("Tabuleiro oponente apos ataque: ")
    console.log(params, '\n')
  }

  if (action == 'PrintOpponent') {
    console.log("board atual do oponente: ")

    console.log(params, '\n')

    const attackPosition = prompt('\nDigite uma posição para atacar no board inimigo: ')

    client.write(attackPosition)

  }

  if (action == "You") {
    console.log(params[0])
    console.log("FIM DO JOGO ACABOU!!!!!!!!!!!!!!!")
  }

});

client.on('close', () => {
  console.log('Connection closed');
});


function getNicknameAndPassword(){

  const answer = prompt('Already have a account? (y/n): ')
  let action: string = 'Login'


  if (answer.toLocaleLowerCase() == 'n') {
    console.log('Register ==========')
    action = 'Register'
  }
  nickname = prompt('Enter your nickname: ');
  password = prompt('Enter your password: ');

  const userInfoString = `${action} ${nickname} ${password}`

  return userInfoString;

}