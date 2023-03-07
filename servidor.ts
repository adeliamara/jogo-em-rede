import net, { Socket } from 'net';
import { User }  from './classe/Client'
import { getUserByNicknameAndPassword, insertUser } from './database';
import { once } from 'events';

let users: User[] = [] 
let sockets: string[] = []
let playersReady: Socket[] = []


/*
   1. Visualização do tabuleiro
   2. Criação da classe Partida de Batalha Naval
      - tabuleiro player 1
      - tabuleiro player 2 
      - nickname player 1
      - nickname player 2
      - turno
   3. 


*/







function getUserBySocket(socket: Socket) {
   const index = sockets.indexOf(`${socket.remoteAddress}:${socket.remotePort}`)
   return users[index]
}

function disconnectUser(socket: Socket){
   const index = sockets.indexOf(`${socket.remoteAddress}:${socket.remotePort}`)
   sockets.splice(index, 1)
   users.splice(index, 1)
}



const server = net.createServer((socket: Socket) => {
   console.log('Client connected:', socket.remoteAddress, socket.remotePort);

   socket.on('data', async (data: Buffer) => {
      const message = data.toString().trim();
      const [action, ...params] = message.split(' ') 

      let user: User | null = null

      if(action != 'Register' && action != 'Login') {
         user = getUserBySocket(socket)   
      }


      if (action == 'Register') {
         const [action, nickname, password] = message.split(' ')
         insertUser(nickname, password)

         user = await getUserByNicknameAndPassword(nickname, password)

         if(user){
            users.push(user)
            sockets.push(`${socket.remoteAddress}:${socket.remotePort}`)
         } 

         socket.write(`Welcome, ${nickname}!\n`);

      } else if (action == 'Login') {
         const [action, nickname, password] = message.split(' ')

         user = await getUserByNicknameAndPassword(nickname, password)
         
         if(user){
            users.push(user)
            sockets.push(`${socket.remoteAddress}:${socket.remotePort}`)
         } 

         socket.write(`PositionBoats ${user?.nickname}!\n`);
      }
      
      if(user) {
         if (action == 'PositionBoats') {
            // Se o cliente já tiver enviado o seu nickname, mas ainda não tiver informado a posição dos barcos, pedimos a informação
            user.boatsPositioned = true

            console.log(`Received boats position from ${user.nickname}: ${message}`);


            playersReady.push(socket)
            
            if(playersReady.length == 2){
               startGame(playersReady)
               playersReady = []
            } else {
               socket.write(`Waiting for players`)
            }

         }


         

      }

   });

   socket.on('end', () => {
      console.log('Client disconnected:', socket.remoteAddress, socket.remotePort);
      // Removemos o cliente da lista de players conectados
      disconnectUser(socket)
   });



});


async function startGame(playersReady: Socket[]) {

   console.log('Jogo começou')

   const player1 = getUserBySocket(playersReady[0]);
   const player2 = getUserBySocket(playersReady[1]);
 
   // Sorteia o jogador que começa o jogo
   const startingPlayerIndex = Math.floor(Math.random() * 2);

   let currentPlayerSocket = startingPlayerIndex === 0 ? playersReady[0] : playersReady[1];
   let opponentSocket = startingPlayerIndex === 0 ? playersReady[1] : playersReady[0];
 
   let currentPlayer = startingPlayerIndex === 0 ? player1 : player2;
   let opponent = startingPlayerIndex === 0 ? player2 : player1;

   while (true) {
     // Pede ao jogador atual que escolha uma posição para atacar

     currentPlayerSocket.write(`Attack ${opponent.nickname}\n`);
     const data = await once(currentPlayerSocket, 'data');
     const [x, y] = data.toString().trim().split(' ');

      console.log('Movimento recebido do jogador atual', currentPlayer.nickname)
     console.log(x, y)
      
   //   // Realiza o ataque e verifica se o jogador perdeu
   //   const attackResult = game.attack(opponent.nickname, parseInt(x), parseInt(y));
   //   currentPlayerSocket.write(attackResult + '\n');
   //   opponentSocket.write(`OpponentAttack ${x} ${y}\n`);
 
   //   if (game.hasPlayerLost(opponent.nickname)) {
   //     currentPlayerSocket.write('You won!\n');
   //     opponentSocket.write('You lost!\n');
   //     break;
   //   }
 
     // Troca o jogador atual e o oponente
     let temp = currentPlayer;
     currentPlayer = opponent;
     opponent = temp;

     let intermediario = currentPlayerSocket;
     currentPlayerSocket = opponentSocket;
     opponentSocket = intermediario;
   }
 }


server.listen(3000, () => {
   console.log('Server started');
});
