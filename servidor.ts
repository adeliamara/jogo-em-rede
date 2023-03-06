import net from 'net';
import prompt from 'prompt-sync'

const input = prompt()

let nextClientId = 0;
const clients: { [key: number]: net.Socket } = {};

let mensagem = ''

const server = net.createServer((socket) => {

  const clientId = nextClientId++;

  // Armazena a conexão do cliente em um objeto para posterior referência
  clients[clientId] = socket;

  console.log(`Cliente ${clientId} conectado.`);



  socket.on('data', (data) => {
    console.log(`Mensagem recebida do cliente ${clientId}: ${data.toString()}`);
    mensagem = data.toString()
    // Envia uma mensagem de volta para o cliente
    const clientSocket = clients[clientId];
    clientSocket.write(`Mensagem recebida: ${mensagem}`);
  });

  socket.on('end', () => {
    console.log(`Cliente ${clientId} desconectado.`);
    delete clients[clientId];
  });
});

server.listen(3000, () => {
  console.log('Servidor escutando na porta 3000.');
});
