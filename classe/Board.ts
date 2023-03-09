import { User } from "./Client";


export class Board{
    dimension: number;
    positionBoats: string;
    viewCurrentPlayer: string[][];
    viewOpponent: string[][];
    countBoats: number = 5;

    constructor(positionBoats: string,dimension: number = 10){
      this.positionBoats = positionBoats;
      this.dimension = dimension;
      this.viewCurrentPlayer = this.createTabuleiroPlayer();
      this.viewOpponent = this.createTabuleiroOpponent();

    }

  
  // Método privado para criar o tabuleiro
  private createTabuleiroPlayer = () => {
   let tabuleiro = [];
   let arrayPositions = this.positionBoats.split('*');
   for (let i = 0; i < this.dimension; i++) {
     let row = [];
     for (let j = 0; j < this.dimension; j++) {
      if (arrayPositions.includes(`${i}${j}`)) {
         row.push('B'); // preencher o tabuleiro com "-" em cada célula
      } else {
         row.push('-'); // preencher o tabuleiro com "-" em cada célula

       }
     }
     tabuleiro.push(row); // adicionar a linha no tabuleiro
   }
   return tabuleiro; // retornar o tabuleiro criado
 }

 
  // Método privado para criar o tabuleiro
  public createTabuleiroOpponent = () => {
   let tabuleiro = [];
   for (let i = 0; i < this.dimension; i++) {
     let row = [];
     for (let j = 0; j < this.dimension; j++) {
         row.push('-'); // preencher o tabuleiro com "-" em cada célula
       }
     tabuleiro.push(row); // adicionar a linha no tabuleiro
   }

   return tabuleiro;
   } // retornar o tabuleiro criado
 

 public printTabuleiroCurrentPlayer = () => {
   let line = '';
 
   for (let i = 0; i < this.dimension; i++) {
     for (let j = 0; j < this.dimension; j++) {
        if(j != this.dimension - 1) line += this.viewCurrentPlayer[i][j] + " "
        else line += this.viewCurrentPlayer[i][j] + "\n"
     }
   }
   return line;
 };


 public printTabuleiroOpponent= () => {
   let line = '';
 
   for (let i = 0; i < this.dimension; i++) {
     for (let j = 0; j < this.dimension; j++) {
        if(j != this.dimension - 1) line += this.viewOpponent[i][j] + " "
        else line += this.viewOpponent[i][j] + "\n"
     }
   }
   return line;
 };
 
 public receberAttack = (position: string) => {
      
   const x = Number(position[0])
   const y = Number(position[1])

   if(this.viewCurrentPlayer[x][y] == 'B'){
      this.viewOpponent[x][y] = 'x'
      this.viewCurrentPlayer[x][y] = 'x'
      this.countBoats -= 1
   } else {
      this.viewOpponent[x][y] = 'o'
      this.viewCurrentPlayer[x][y] = 'o'
   }

 };


 




 
}



   //  private recebeataque(posicao do ataque){
   //    poiscao do ataque esta em position
   //       se sim, atualaiza no view opponent XMLDocument

   //  }





/*
   1. Visualização do tabuleiro
   2. Criação da classe Partida de Batalha Naval
      - tabuleiro player 1
      - tabuleiro player 2 
      - nickname player 1
      - nickname player 2
      - turno
   3. */