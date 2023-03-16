import net from 'net';
import { machine } from 'os';
import promptSync from 'prompt-sync';
import { getUserMatches } from './database';

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

    let msg: any = showMenu(params)

    msg.then((msg: string) => {
      if(msg == 'SendMenu'){
        client.write(`${msg} ${nickname} ${password}`)
      }else{
        client.write(msg);
      }
       // conteúdo da promessa
    });



    
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
    client.write('SendMenu')
  }

});

client.on('end', () => {
  console.log('Connection closed');
});


function getNicknameAndPassword(){
  console.clear() //adicionado
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

function printUserHistory(matchs:any, wins: any, losses: any) {
  console.clear()
  if(Number(losses) != 0) {
    const porcentagemVitoria = Number(wins)/(Number(wins)+Number(losses)) * 100
    console.log(`=============================================================== `)
    console.log(`Histórico de Partidas - W/D ${porcentagemVitoria}% `)
    console.log(`=============================================================== `)
    console.log(`Você possui ${wins} vitória(s) e ${losses} derrota(s)`)
    //se derrotas e vitorias forem = 0, exiba que a taxa eh zero
    
    matchs.forEach((match: any) => {
        console.log(`       ${match.id}. ${match.winner} ganhou do ${match.loser}`)
    });
  } else if(Number(losses) == 0 && Number(wins) != 0){
    console.log(`=============================================================== `)
    console.log(`Histórico de Partidas - W/D 100% `)
    console.log(`=============================================================== `)
    console.log(`Você possui ${wins} vitória(s) e ${losses} derrota(s)`)
        
    matchs.forEach((match: any) => {
        console.log(`       ${match.id}. ${match.winner} ganhou do ${match.loser}`)
    });
  } else {
    console.log(`=============================================================== `)
    console.log(`Histórico de Partidas `)
    console.log(`=============================================================== `)
    console.log('Você não possui nenhuma partida jogada')
  }

  prompt('\nPress <enter> to continue')

  
}
function getPositionBoats(){
  let board = ''
  
  console.log('Enter column and line. ex: 01')
  for (let i = 0; i < 2; i++) {
    console.log('Digite uma posição em um tabuleiro 5x5')
    let position = prompt('Enter your boats position: ').trim();
    while (Number(position[0]) > 4 || Number(position[1]) > 4) {
      console.log('Digite uma posição em um tabuleiro 5x5')
      position = prompt('Max dimension is 4. Enter yout boats position:')
    }
    board += position + ' ';
  }
  return board
}


async function showMenu(params: Array<string>) {
  console.clear() //adicionado
  console.log('Select an action:\n\t1. Start Game\n\t2. Show History\n\t0. Encerrar conexao')
  let option = prompt('')

  while (Number(option) > 2 || Number(option) < 0) {
    console.log('Select an action:\n\t1. Start Game\n\t2. Show History\n\t0. Encerrar conexao')
    option = prompt('')
  }

  if (option == '2') {
    console.clear() //adicionado
    let [id, vitorias, derrotas] = params[0].split(' ')
    let matchs = await getUserMatches(Number(id))
    printUserHistory(matchs, vitorias, derrotas[0])
    return 'SendMenu'
  } else if(option == '1'){
    console.clear() //adicionado
    if (!boatsPositioned) {
      let board: string = getPositionBoats()
      boatsPositioned = true;
      return `PositionBoats ${board}`;
    } 
  } else if(option == '0'){
    client.end()
  }

  return ' '
}