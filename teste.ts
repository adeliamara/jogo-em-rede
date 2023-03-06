import prompt from 'prompt-sync'

const input = prompt()


export function exibeTabuleiro(){

    const board: string[][] = [  ['███', ' ● ', '███', ' ● ', '███', ' ● ', '███', ' ● '],
    [' ● ', '███', ' ● ', '███', ' ● ', '███', ' ● ', '███'],
    ['███', ' ● ', '███', ' ● ', '███', ' ● ', '███', ' ● '],
    ['   ', '███', '   ', '███', '   ', '███', '   ', '███'],
    ['███', '   ', '███', '   ', '███', '   ', '███', '   '],
    [' ○ ', '███', ' ○ ', '███', ' ○ ', '███', ' ○ ', '███'],
    ['███', ' ○ ', '███', ' ○ ', '███', ' ○ ', '███', ' ○ '],
    [' ○ ', '███', ' ○ ', '███', ' ○ ', '███', ' ○ ', '███'],
  ];
  
  console.log("  0  1  2  3  4  5  6  7")
  for (let row = 0; row < board.length; row++) {
    let rowStr = `${row}`;
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      rowStr += `${piece}`;
    }
    console.log(rowStr);
  }
  
  
  
  
  
  
  
  
}
