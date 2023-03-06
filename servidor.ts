import net, { Socket } from 'net';

interface Client {
   socket: Socket;
   nickname: string;
   boatsPositioned: boolean;
   board?: string;
   turn?: boolean;
}

const clients: { [key: string]: Client } = {};

const server = net.createServer((socket: Socket) => {
   console.log('Client connected:', socket.remoteAddress, socket.remotePort);


   socket.on('data', (data: Buffer) => {
      const message = data.toString().trim();

      if (!clients[`${socket.remoteAddress}:${socket.remotePort}`]?.nickname) {
         // Se o cliente ainda não tiver enviado o seu nickname, armazenamos a informação
         clients[`${socket.remoteAddress}:${socket.remotePort}`] = { socket, nickname: message, boatsPositioned: false };
         console.log(`Client ${socket.remoteAddress}:${socket.remotePort} identified as ${message}`);
         socket.write(`Welcome, ${message}!\n`);
      } else if (!clients[`${socket.remoteAddress}:${socket.remotePort}`]?.boatsPositioned) {
         // Se o cliente já tiver enviado o seu nickname, mas ainda não tiver informado a posição dos barcos, pedimos a informação
         console.log(`Received boats position from ${clients[`${socket.remoteAddress}:${socket.remotePort}`].nickname}: ${message}`);

         // Armazenar a posição dos barcos no objeto do jogador
         clients[`${socket.remoteAddress}:${socket.remotePort}`].boatsPositioned = true;

         startGame()
      } else {
         // Se o cliente já tiver enviado o seu nickname e a posição dos barcos, consideramos a mensagem como uma jogada
         console.log(`Received move from ${clients[`${socket.remoteAddress}:${socket.remotePort}`].nickname}: ${message}`);
         // Armazenar o tabuleiro no banco de dados aqui
      }
   });

   socket.on('end', () => {
      console.log('Client disconnected:', socket.remoteAddress, socket.remotePort);
      // Removemos o cliente da lista de players conectados
      delete clients[`${socket.remoteAddress}:${socket.remotePort}`];
   });



});

function startGame() {
   // Verifica se ambos os jogadores já informaram a posição dos barcos
   const playersReady = Object.keys(clients).filter(client => clients[client].boatsPositioned).length === 2;
   
   if (playersReady) {
     console.log('Both players are ready to play. Starting the game!');
     let currentPlayer = 1;
 
     Object.keys(clients).forEach(client => {
       const { socket } = clients[client];
       socket.on('data', (data: Buffer) => {
         const move = data.toString().trim();

         console.log(`Player ${clients[client].nickname} played: ${move}`);

         if (currentPlayer === 1 && client === Object.keys(clients)[0]) {
           // É a vez do jogador 1 jogar
           clients[client].turn = false;
           clients[Object.keys(clients)[1]].turn = true;
           socket.write('Your turn to play. Enter your move: ');
           currentPlayer = 2;
         } else if (currentPlayer === 2 && client === Object.keys(clients)[1]) {
           clients[client].turn = false;
           clients[Object.keys(clients)[0]].turn = true;
           socket.write('Your turn to play. Enter your move: ');
           currentPlayer = 1;
         } else {
           // Jogada inválida, não é a vez do jogador
           socket.write('Wait for your turn to play.\n');
         }
       });
     });
 
     // Define a vez do jogador 1
     clients[Object.keys(clients)[0]].turn = true;
     clients[Object.keys(clients)[1]].turn = false;
 
     // Envia a mensagem para o jogador 1 iniciar o jogo
     clients[Object.keys(clients)[0]].socket.write('Let the game begin! You play first. Enter your move: ');
   } else {
     // Se ambos os jogadores não tiverem informado a posição dos barcos, adiciona um tempo de espera e chama novamente a função startGame
     console.log('Waiting for both players to position their boats...');
     setTimeout(() => {
       process.nextTick(startGame);
     }, 1000);
   }
 }
  

server.listen(3000, () => {
   console.log('Server started');
});
