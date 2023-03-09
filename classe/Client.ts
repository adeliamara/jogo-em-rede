import { Socket } from "net";

export interface User {
  user_id: number;
  nickname: string;
  password: string;
  boatsPositioned: boolean;
  turn: boolean;
  win: number;
  losses: number;
  socket: Socket;
}