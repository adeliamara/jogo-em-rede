import net, { Socket } from 'net';
import { User }  from './classe/Client'
import { getUserByNicknameAndPassword, insertUser } from './database';
import { once } from 'events';
import { BattleShipGame } from './classe/BattleShipGame';

let users: User[] = [] 
let sockets: string[] = []
let playersReady: Socket[] = []
let positionBoats: string[] = []


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
      const message = data.toString();
      const [action, ...params] = message.split(' ') 

      let user: User | null = null

      console.log("action: ", action)


      if(action != 'Register' && action != 'Login') {
         user = getUserBySocket(socket)   
      }


      if (action == 'Register') { //tem algum erro
         const [action, nickname, password] = message.split(' ')
   

         user = await getUserByNicknameAndPassword(nickname, password, socket)

         if(user){
            user.socket = socket

            users.push(user)
            sockets.push(`${socket.remoteAddress}:${socket.remotePort}`)
            user.socket.write(`Welcome, ${nickname}!\n`);


         } else{
            await insertUser(nickname, password)
            user = await getUserByNicknameAndPassword(nickname, password, socket)

            if(user){

               user.socket = socket
   
               users.push(user)
               sockets.push(`${socket.remoteAddress}:${socket.remotePort}`)
               user.socket.write(`Welcome, ${nickname}!\n`);

            }
         }
         

      } else if (action == 'Login') {
         const [action, nickname, password] = message.split(' ')

         user = await getUserByNicknameAndPassword(nickname, password, socket)
         
         if(user){
            user.socket = socket
            users.push(user)
            sockets.push(`${socket.remoteAddress}:${socket.remotePort}`)
            
            user.socket.write(`Welcome, ${nickname}!\n`);
         } 

      }
      
      if(user) {
         if (action == 'PositionBoats') {
            // Se o cliente já tiver enviado o seu nickname, mas ainda não tiver informado a posição dos barcos, pedimos a informação
            user.boatsPositioned = true
            positionBoats.push(...params)

            console.log(`Received boats position from ${user.nickname}: ${params}`);

            playersReady.push(socket)
            
            if(playersReady.length == 2){
               startGame(playersReady, positionBoats)
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


async function startGame(playersReady: Socket[], positionBoats: string[]) {

   console.log('Jogo começou')
   

   const player1 = getUserBySocket(playersReady[0]);
   const player2 = getUserBySocket(playersReady[1]);
 
   // Sorteia o jogador que começa o jogo
   const startingPlayerIndex = 0;
 
   let currentPlayer = startingPlayerIndex === 0 ? player1 : player2;
   let opponent = startingPlayerIndex === 0 ? player2 : player1;

   const stringArray = positionBoats.join('*');

   const [positionBoats1, positionBoats2] =  stringArray.split("**")


   console.log(positionBoats1)
   console.log(positionBoats2)
   

   const battleShipGame = new BattleShipGame(currentPlayer, opponent, positionBoats1, positionBoats2, currentPlayer)

   while (true) {
     // Pede ao jogador atual que escolha uma posição para atacar
    
     battleShipGame.showBoards()
     console.log("veio aqui")
     let attackPosition = await once(currentPlayer.socket, 'data');
     let position = attackPosition.toString().trim();
     console.log(position)

     battleShipGame.attackOpponent(position)

     if(battleShipGame.verificarFimDaPartida()){
         player1.socket.end()
         player2.socket.end()
         break;
     }


     
     let temp = currentPlayer;
     currentPlayer = opponent;
     opponent = temp;

      

   }
 }


server.listen(3000, () => {
   console.log('Server started');
});



 