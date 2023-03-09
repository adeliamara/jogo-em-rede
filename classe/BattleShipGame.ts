import { Board } from "./Board";
import { User } from "./Client";

export class BattleShipGame{
    private _player1: User;
    private _player2: User;
    private _board1: Board;
    private _board2: Board;
    private _turn: User;

    constructor(player1: User, player2: User, positionBoats1: string, positionBoats2: string, turn: User) {
        this._player1 = player1;
        this._player2 = player2;
        this._board1 =  new Board(positionBoats1);
        this._board2 = new Board(positionBoats2);
        this._turn = turn;   
    }

    public attackOpponent = (position: string) => {
        if(this._turn.nickname == this._player1.nickname){
            this._board2.receberAttack(position)
            this.showBoardsOff()
            this._turn = this._player2
        } else {
            this._board1.receberAttack(position)
            this.showBoardsOff()
            this._turn = this._player1
        }
    }

    public showBoards = () => {

        if(this._turn.nickname == this._player1.nickname){
            this._turn.socket.write(`PrintPlayer ${this._board1.printTabuleiroCurrentPlayer()}`)
            this._turn.socket.write(`PrintOpponent ${this._board1.printTabuleiroOpponent()}`)    
        } else {
            this._turn.socket.write(`PrintPlayer ${this._board2.printTabuleiroCurrentPlayer()}`)
            this._turn.socket.write(`PrintOpponent ${this._board2.printTabuleiroOpponent()}`)
        }


    }

    private showBoardsOff = () => {
        if(this._turn.nickname == this._player1.nickname){
            this._turn.socket.write(`FinalPrint ${this._board1.printTabuleiroCurrentPlayer()}`)
            this._turn.socket.write(`FinalPrint ${this._board1.printTabuleiroOpponent()}`) 
        } else {
            this._turn.socket.write(`FinalPrint ${this._board2.printTabuleiroCurrentPlayer()}`)
            this._turn.socket.write(`FinalPrint ${this._board2.printTabuleiroOpponent()}`) 
        }
    }

    public verificarFimDaPartida = () => {
        if(this._turn.nickname == this._player1.nickname){

        } else {

        }
    }
    
}