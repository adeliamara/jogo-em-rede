import * as net from 'net';

import prompt from 'prompt-sync'

const input = prompt()

const client: net.Socket = new net.Socket();

client.connect(3000, 'localhost', () => {
   console.log('Conectado ao servidor');
   client.write('Olá, eu sou o cliente');
});


client.on('data', (data: Buffer) => {
      while(true){
      console.log(`Mensagem do servidor: ${data.toString()}`);
      const msg = input('Digite sua mensagem feioso')
      client.write(msg);
      //client.end();
      }
   });



client.on('end', () => {
   console.log('Desconectado do servidor');
});