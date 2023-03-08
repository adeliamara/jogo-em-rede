import { Board } from "./Board";
import { User } from "./Client";

export class BattleShipGame{
    private _player1: User;
    private _player2: User;
    private _board1: Board;
    private _board2: Board;
    private _turn: User;

    constructor(player1: User, player2: User, positionBoats1: string, positionBoats2: string, turn: User) {
        this._player1= player1;
        this._player2= player2;
        this._board1 =  new Board(positionBoats1);
        this._board2 = new Board(positionBoats2);
        this._turn = turn;   
    }



    private attackOpponent = (currentPlayer: User, position: string) => {
        if(currentPlayer.nickname == this._player1.nickname){
            this._board2.receberAttack(position)
        } else {
            this._board1.receberAttack(position)
        }
    }

    public showBoards = (currentPlayer: User) =>{
        if(currentPlayer.nickname == this._player1.nickname){
            this._board1.printTabuleiroCurrentPlayer()
        } else {
            this._board1.receberAttack
        }
    }


    
}