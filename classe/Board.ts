import { User } from "./Client";


export class Board{
    dimension: number;
    positionBoats: string;
    viewCurrentPlayer:string[][];
    viewOpponent:string[][];

    constructor(positionBoats: string,dimension: number = 10){
      this.positionBoats = positionBoats;
      this.dimension = dimension;
      this.viewCurrentPlayer = this.createTabuleiroPlayer();
      this.viewOpponent = this.createTabuleiroOpponent();

    }

  
  // Método privado para criar o tabuleiro
  private createTabuleiroPlayer = () => {
   let tabuleiro = [];
   let arrayPositions = this.positionBoats.split(' ');
   for (let i = 0; i < this.dimension; i++) {
     let row = [];
     for (let j = 0; j < this.dimension; j++) {
      if (arrayPositions.includes(`${i}${j}`)) {
         row.push('B '); // preencher o tabuleiro com "-" em cada célula
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
 

 public printTabuleiroCurrentPlayer= () => {
   let line = '';
   let arrayPositions = this.positionBoats.split(' ');
 
   for (let i = 0; i < this.dimension; i++) {
     for (let j = 0; j < this.dimension; j++) {
         console.log(this.viewCurrentPlayer[i][j])
     }
   }
   console.log(line);
 };


 public printTabuleiroCurrentOpponent= () => {
   let line = '';
   let arrayPositions = this.positionBoats.split(' ');
 
   for (let i = 0; i < this.dimension; i++) {
     for (let j = 0; j < this.dimension; j++) {
         console.log(this.viewOpponent[i][j])
     }
   }
   console.log(line);
 };
 
 public receberAttack = (position: string) => {
      
   const x = Number(position[0])
   const y = Number(position[1])

   if(this.viewCurrentPlayer[x][y] == 'B'){
      this.viewOpponent[x][y] = 'x'
      this.viewCurrentPlayer[x][y] = 'x'
   } else {
      this.viewOpponent[x][y] = 'o'
      this.viewCurrentPlayer[x][y] = 'x'
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