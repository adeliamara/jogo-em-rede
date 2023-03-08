const printTabuleiroOpponent = () => {
    let line = '';
    let arrayPositions = '11 22 33 44'.split(' ')
  
  
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (j !== 7) {
            if (arrayPositions.includes(`${i}${j}`)) {
              line += 'B ';
            } else {
              line += '- ';
            }
          } else {
            if (arrayPositions.includes(`${i}${j}`)) {
              line += 'B\n';
            } else {
              line += '-\n';
            }
          }
        }
      }
      console.log(line);
    };
    


  printTabuleiroOpponent()