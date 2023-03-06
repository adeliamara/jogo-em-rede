import net, { Socket } from 'net';


export interface Client {
    socket: Socket;
    nickname: string;
    boatsPositioned: boolean;
  }